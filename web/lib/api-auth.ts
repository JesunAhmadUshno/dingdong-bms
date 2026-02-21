/**
 * API authentication utilities for session validation
 */

import { cookies } from 'next/headers';
import { AppError } from './error-handler';
import { logger } from './logger';
import Database from 'better-sqlite3';
import path from 'path';

const SESSION_TOKEN_COOKIE = 'dingdong_session_token';
const SESSION_ID_COOKIE = 'dingdong_session_id';

export interface SessionData {
  id: string;
  username: string;
  userId: number;
  createdAt: string;
  expiresAt: string;
}

/**
 * Get database connection
 */
function getDatabase(): Database.Database {
  const dbPath = path.join(process.cwd(), 'dingdong.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  return db;
}

/**
 * Validate session token and retrieve session data
 * @throws AuthenticationError if session is invalid or expired
 */
export async function validateSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_TOKEN_COOKIE)?.value;
  const sessionId = cookieStore.get(SESSION_ID_COOKIE)?.value;

  if (!sessionToken || !sessionId) {
    throw new AppError('NO_SESSION', 401, 'No active session');
  }

  try {
    const db = getDatabase();

    // Query session from database
    const session = db
      .prepare(
        `
      SELECT id, username, user_id as userId, created_at as createdAt, expires_at as expiresAt
      FROM sessions
      WHERE id = ? AND token = ?
    `
      )
      .get(sessionId, sessionToken) as any;

    db.close();

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
export async function getSessionIfExists(): Promise<SessionData | null> {
  try {
    return await validateSession();
  } catch {
    return null;
  }
}

/**
 * Extract user ID from session
 */
export async function getUserId(): Promise<number> {
  const session = await validateSession();
  return session.userId;
}

/**
 * Extract username from session
 */
export async function getUsername(): Promise<string> {
  const session = await validateSession();
  return session.username;
}

/**
 * Check if user owns a specific occupant (for access control)
 */
export async function canAccessOccupant(occupantId: number): Promise<boolean> {
  try {
    const session = await validateSession();
    const db = getDatabase();

    // Check if user_id matches occupant's user_id
    const occupant = db
      .prepare('SELECT user_id FROM occupants WHERE id = ? LIMIT 1')
      .get(occupantId) as any;

    db.close();

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
