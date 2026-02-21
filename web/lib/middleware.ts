/**
 * API middleware utilities for wrapping route handlers
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { validateSession, generateRequestId } from './api-auth';
import { handleError, AppError, ValidationError } from './error-handler';
import { logger, LogContext } from './logger';

export interface MiddlewareContext {
  requestId: string;
  startTime: number;
  userId?: number;
  username?: string;
  method: string;
  path: string;
}

/**
 * High-order function to wrap API route handlers with middleware
 */
export function withMiddleware(
  handler: (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const path = new URL(req.url).pathname;
    const method = req.method;

    const context: MiddlewareContext = {
      requestId,
      startTime,
      method,
      path,
    };

    const logContext: LogContext = {
      requestId,
      action: method,
      resource: path,
    };

    try {
      logger.logRequest(method, path, logContext);

      const response = await handler(req, context);
      const duration = Date.now() - startTime;

      // Extract status code from response
      const statusCode = response.status;
      logger.logResponse(method, path, statusCode, duration, logContext);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.logApiError(
        method,
        path,
        (error as any).statusCode || 500,
        error as Error,
        { ...logContext, userId: context.userId, username: context.username }
      );

      return handleError(error);
    }
  };
}

/**
 * Middleware to add session validation
 */
export function withSession(
  handler: (
    req: NextRequest,
    context: MiddlewareContext
  ) => Promise<NextResponse>
): (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse> {
  return async (req: NextRequest, context: MiddlewareContext) => {
    try {
      const session = await validateSession();
      context.userId = session.userId;
      context.username = session.username;
      return await handler(req, context);
    } catch (error) {
      throw error;
    }
  };
}

/**
 * Middleware to validate request body against schema
 */
export function withValidation<T>(
  schema: ZodSchema,
  handler: (
    req: NextRequest,
    context: MiddlewareContext,
    body: T
  ) => Promise<NextResponse>
): (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse> {
  return async (req: NextRequest, context: MiddlewareContext) => {
    try {
      const body = await req.json();
      const validatedData = schema.parse(body) as T;
      return await handler(req, context, validatedData);
    } catch (error) {
      if ((error as any).issues) {
        // Zod validation error
        const issues = (error as any).issues.map((issue: any) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        throw new ValidationError(issues);
      }
      throw error;
    }
  };
}

/**
 * Middleware for query parameter validation
 */
export function withQueryValidation<T>(
  schema: ZodSchema,
  handler: (
    req: NextRequest,
    context: MiddlewareContext,
    query: T
  ) => Promise<NextResponse>
): (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse> {
  return async (req: NextRequest, context: MiddlewareContext) => {
    try {
      const { searchParams } = new URL(req.url);
      const query = Object.fromEntries(searchParams);
      const validatedQuery = schema.parse(query) as T;
      return await handler(req, context, validatedQuery);
    } catch (error) {
      if ((error as any).issues) {
        const issues = (error as any).issues.map((issue: any) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        throw new ValidationError(issues);
      }
      throw error;
    }
  };
}

/**
 * Compose multiple middleware
 */
export function compose(
  ...middlewares: Array<(handler: any) => any>
): (handler: any) => any {
  return (handler) => {
    let wrapped = handler;
    for (let i = middlewares.length - 1; i >= 0; i--) {
      wrapped = middlewares[i](wrapped);
    }
    return wrapped;
  };
}

/**
 * Only allow specific HTTP methods
 */
export function withMethods(
  allowedMethods: string[],
  handler: (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse>
): (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse> {
  return async (req: NextRequest, context: MiddlewareContext) => {
    if (!allowedMethods.includes(req.method)) {
      throw new AppError('METHOD_NOT_ALLOWED', 405, `Method ${req.method} not allowed`);
    }
    return await handler(req, context);
  };
}

/**
 * Rate limiting middleware (placeholder)
 */
export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60 * 1000, // 1 minute
  handler?: (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse>
): (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse> | ((req: NextRequest, context: MiddlewareContext) => Promise<NextResponse>) {
  // TODO: Implement actual rate limiting with Redis or in-memory store
  if (handler) {
    return async (req: NextRequest, context: MiddlewareContext) => {
      // Rate limiting logic would go here
      return await handler(req, context);
    };
  }

  return (handler: any) => {
    return async (req: NextRequest, context: MiddlewareContext) => {
      // Rate limiting logic would go here
      return await handler(req, context);
    };
  };
}

/**
 * Audit logging middleware
 */
export function withAudit(
  resourceName: string,
  handler: (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse>
): (req: NextRequest, context: MiddlewareContext) => Promise<NextResponse> {
  return async (req: NextRequest, context: MiddlewareContext) => {
    const response = await handler(req, context);

    // Log successful write operations
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && response.status < 400) {
      logger.logAudit(req.method, resourceName, {
        requestId: context.requestId,
        userId: context.userId,
        username: context.username,
      });
    }

    return response;
  };
}
