/**
 * Structured logging utility for consistent log formatting and levels
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  requestId?: string;
  userId?: number;
  sessionId?: string;
  username?: string;
  action?: string;
  resource?: string;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  metadata?: Record<string, any>;
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
}

/**
 * Logger class for structured logging
 */
export class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  /**
   * Format log entry as JSON
   */
  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  /**
   * Write log to appropriate stream
   */
  private writeLog(entry: LogEntry): void {
    const formatted = this.formatLog(entry);

    if (entry.level === LogLevel.ERROR) {
      console.error(formatted);
    } else if (entry.level === LogLevel.WARN) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Core logging method
   */
  log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    metadata?: Record<string, any>
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
    };

    this.writeLog(entry);
  }

  /**
   * Debug log
   */
  debug(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    if (this.isDev) {
      this.log(LogLevel.DEBUG, message, context, metadata);
    }
  }

  /**
   * Info log
   */
  info(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, metadata);
  }

  /**
   * Warn log
   */
  warn(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, metadata);
  }

  /**
   * Error log with exception details
   */
  error(
    message: string,
    context?: LogContext,
    error?: Error,
    metadata?: Record<string, any>
  ): void {
    const entry: LogEntry = {
      level: LogLevel.ERROR,
      message,
      timestamp: new Date().toISOString(),
      context,
      metadata,
      error: error
        ? {
            message: error.message,
            code: (error as any).code,
            stack: this.isDev ? error.stack : undefined,
          }
        : undefined,
    };

    this.writeLog(entry);
  }

  /**
   * Log API request
   */
  logRequest(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, context);
  }

  /**
   * Log API response with duration
   */
  logResponse(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
    context?: LogContext
  ): void {
    this.info(`${method} ${path} ${statusCode}`, context, {
      duration: `${durationMs}ms`,
    });
  }

  /**
   * Log API error
   */
  logApiError(
    method: string,
    path: string,
    statusCode: number,
    error: Error,
    context?: LogContext
  ): void {
    this.error(`${method} ${path} ${statusCode}`, context, error);
  }

  /**
   * Log audit event (user action)
   */
  logAudit(action: string, resource: string, context?: LogContext): void {
    this.info(`Audit: ${action} on ${resource}`, {
      ...context,
      action,
      resource,
    });
  }

  /**
   * Log security event
   */
  logSecurity(event: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.warn(`Security: ${event}`, context, metadata);
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger();
