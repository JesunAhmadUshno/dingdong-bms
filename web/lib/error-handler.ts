import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Custom application error class with status code and error code
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Validation error - 400 Bad Request
 */
export class ValidationError extends AppError {
  constructor(public errors: any[]) {
    super('VALIDATION_ERROR', 400, 'Validation failed', errors);
  }
}

/**
 * Authentication error - 401 Unauthorized
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super('AUTH_ERROR', 401, message);
  }
}

/**
 * Authorization error - 403 Forbidden
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super('AUTHZ_ERROR', 403, message);
  }
}

/**
 * Not found error - 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource} not found`);
  }
}

/**
 * Conflict error - 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', 409, message);
  }
}

/**
 * Database error - 500 Internal Server Error
 */
export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details?: any) {
    super('DB_ERROR', 500, message, details);
  }
}

/**
 * Rate limit error - 429 Too Many Requests
 */
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super('RATE_LIMIT', 429, message);
  }
}

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    errorId?: string;
  };
}

/**
 * Convert error to standardized API response
 */
export function handleError(error: unknown, isDev = process.env.NODE_ENV === 'development'): NextResponse<ApiErrorResponse> {
  // Handle known AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: isDev ? error.details : undefined,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle validation errors from zod
  if (error instanceof Error && error.name === 'ZodError') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: isDev ? (error as any).issues : undefined,
        },
      },
      { status: 400 }
    );
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid JSON in request body',
        },
      },
      { status: 400 }
    );
  }

  // Handle unexpected errors
  const errorId = crypto.randomUUID();
  console.error(`[${errorId}] Unexpected error:`, error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: isDev ? String(error) : 'An unexpected error occurred',
        errorId,
      },
    },
    { status: 500 }
  );
}

/**
 * Assert condition, throw error if false
 */
export function assert(condition: boolean, error: AppError | string): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new AppError('ASSERTION_ERROR', 500, error);
    }
    throw error;
  }
}
