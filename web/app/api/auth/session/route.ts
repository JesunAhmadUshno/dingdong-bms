import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { USERS } from '@/lib/database';
import crypto from 'crypto';
import { withMiddleware, MiddlewareContext } from '@/lib/middleware';
import { logger } from '@/lib/logger';
import { AppError, AuthenticationError, ValidationError } from '@/lib/error-handler';

// Initialize DB on first request
try {
  initializeDatabase();
} catch (e) {
  console.log('Database already initialized');
}

// Generate session ID
function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

// Create session (15 minutes) - with validation
export const POST = withMiddleware(
  async (request: NextRequest, context: MiddlewareContext) => {
    try {
      const body = await request.json();
      const { username, password } = body;

      // Validate required fields
      if (!username || !password) {
        throw new ValidationError([
          !username && { path: 'username', message: 'Required' },
          !password && { path: 'password', message: 'Required' },
        ].filter(Boolean) as any[]);
      }

      // Validate field lengths
      if (typeof username !== 'string' || username.length < 3 || username.length > 50) {
        throw new AppError(
          'VALIDATION_ERROR',
          400,
          'Username must be between 3 and 50 characters'
        );
      }

      if (typeof password !== 'string' || password.length < 6) {
        throw new AppError(
          'VALIDATION_ERROR',
          400,
          'Password must be at least 6 characters'
        );
      }

      // Find user in mock database
      const user = USERS.find((u) => u.username === username && u.password === password && u.status === 'verified');

      if (!user) {
        logger.logSecurity('Failed login attempt', { username });
        throw new AuthenticationError('Invalid credentials');
      }

      // Create session
      const sessionId = generateSessionId();
      const token = generateSessionId(); // Separate token for added security
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      const stmt = db.prepare(`
        INSERT INTO sessions (session_id, user_id, username, email, full_name, phone, legal_sin_or_bn, profile_type, role_id, role_name, properties, status, token, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        sessionId,
        user.user_id,
        user.username,
        user.email,
        user.full_name,
        user.phone,
        user.legal_sin_or_bn || '',
        user.profile_type,
        user.role_id,
        user.role_id === 1 ? 'RENTER' : user.role_id === 2 ? 'LEASEHOLDER' : user.role_id === 3 ? 'OWNER' : user.role_id === 4 ? 'CORPORATE_OWNER' : user.role_id === 11 ? 'ADMIN' : 'USER',
        JSON.stringify(user.properties || []),
        'active',
        token,
        expiresAt.toISOString()
      );

      logger.logAudit('LOGIN', `user/${user.user_id}`, {
        requestId: context.requestId,
        userId: user.user_id,
        username: user.username,
      });

      return NextResponse.json(
        { 
          success: true, 
          sessionId,
          token,
          user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            phone: user.phone,
            legal_sin_or_bn: user.legal_sin_or_bn,
            profile_type: user.profile_type,
            role_id: user.role_id,
            status: user.status,
          }
        },
        { status: 201 }
      );
    } catch (error) {
      throw error;
    }
  }
)

// Get session - with validation
export const GET = withMiddleware(
  async (request: NextRequest, context: MiddlewareContext) => {
    try {
      const sessionId = request.headers.get('x-session-id');
      const token = request.headers.get('x-session-token');

      if (!sessionId || !token) {
        throw new AuthenticationError('Missing session credentials');
      }

      const stmt = db.prepare("SELECT * FROM sessions WHERE session_id = ? AND token = ? AND expires_at > datetime('now')");
      const session = stmt.get(sessionId, token) as any;

      if (!session) {
        throw new AuthenticationError('Session expired or invalid');
      }

      logger.debug('Session retrieved successfully', {
        requestId: context.requestId,
        userId: session.user_id,
        username: session.username,
      });

      return NextResponse.json({
        success: true,
        session: {
          user_id: session.user_id,
          username: session.username,
          email: session.email,
          full_name: session.full_name,
          phone: session.phone,
          legal_sin_or_bn: session.legal_sin_or_bn,
          profile_type: session.profile_type,
          role_id: session.role_id,
          role_name: session.role_name,
          properties: JSON.parse(session.properties || '[]'),
          status: session.status,
        }
      });
    } catch (error) {
      throw error;
    }
  }
)

// Delete session (logout) - with validation
export const DELETE = withMiddleware(
  async (request: NextRequest, context: MiddlewareContext) => {
    try {
      const sessionId = request.headers.get('x-session-id');
      const token = request.headers.get('x-session-token');

      if (!sessionId || !token) {
        throw new AuthenticationError('Missing session credentials');
      }

      // Get session before deletion for audit
      const getStmt = db.prepare('SELECT user_id, username FROM sessions WHERE session_id = ? AND token = ? LIMIT 1');
      const session = getStmt.get(sessionId, token) as any;

      if (!session) {
        throw new AuthenticationError('Session not found');
      }

      const stmt = db.prepare('DELETE FROM sessions WHERE session_id = ? AND token = ?');
      stmt.run(sessionId, token);

      logger.logAudit('LOGOUT', `user/${session.user_id}`, {
        requestId: context.requestId,
        userId: session.user_id,
        username: session.username,
      });

      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      throw error;
    }
  }
)
