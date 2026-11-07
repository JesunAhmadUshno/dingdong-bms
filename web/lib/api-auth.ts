/**
 * API authentication utilities for session validation
 */

import { AppError } from './error-handler';
import { logger } from './logger';
import db from './db';

export interface SessionData {
  id: string;
  username: string;
  userId: number;
  createdAt: string;
  expiresAt: string;
}

/**
 * Validate session token and retrieve session data.
 * Reads the x-session-id / x-session-token headers that lib/auth-context.tsx sends
 * (the pair POST /api/auth/session returns and the client keeps in localStorage).
 * @throws AuthenticationError if session is invalid or expired
 */
export async function validateSession(req: Request): Promise<SessionData> {
  const sessionToken = req.headers.get('x-session-token');
  const sessionId = req.headers.get('x-session-id');

  if (!sessionToken || !sessionId) {
    throw new AppError('NO_SESSION', 401, 'No active session');
  }

  try {
    // Query session from database
    const session = db
      .prepare(
        `
      SELECT session_id as id, username, user_id as userId, created_at as createdAt, expires_at as expiresAt
      FROM sessions
      WHERE session_id = ? AND token = ?
    `
      )
      .get(sessionId, sessionToken) as any;

    if (!session) {
      logger.logSecurity('Invalid session token used', { sessionId });
      throw new AppError('INVALID_SESSION', 401, 'Invalid session');
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      logger.info('Session expired', { sessionId, username: session.username });
      throw new AppError('SESSION_EXPIRED', 401, 'Session expired');
    }

    return {
      id: session.id,
      username: session.username,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error('Session validation failed', { sessionId }, error as Error);
    throw new AppError(
      'SESSION_ERROR',
      500,
      'Session validation error',
      process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    );
  }
}

/**
 * Get session without throwing (returns null if no session)
 */
export async function getSessionIfExists(req: Request): Promise<SessionData | null> {
  try {
    return await validateSession(req);
  } catch {
    return null;
  }
}

/**
 * Extract user ID from session
 */
export async function getUserId(req: Request): Promise<number> {
  const session = await validateSession(req);
  return session.userId;
}

/**
 * Extract username from session
 */
export async function getUsername(req: Request): Promise<string> {
  const session = await validateSession(req);
  return session.username;
}

/**
 * Check if user owns a specific occupant (for access control)
 */
export async function canAccessOccupant(req: Request, occupantId: number): Promise<boolean> {
  try {
    const session = await validateSession(req);
    // Check if user_id matches occupant's user_id
    const occupant = db
      .prepare('SELECT user_id FROM occupants WHERE id = ? LIMIT 1')
      .get(occupantId) as any;

    if (!occupant) {
      return false;
    }

    return occupant.user_id === session.userId;
  } catch {
    return false;
  }
}

/**
 * Create request ID for logging
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
