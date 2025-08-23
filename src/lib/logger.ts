export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  [key: string]: unknown;
}

export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static isTest = process.env.NODE_ENV === 'test';

  static debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  static info(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.info(`[INFO] ${message}`, context);
    }
  }

  static warn(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.warn(`[WARN] ${message}`, context);
    }
    
    // In production, send to monitoring service
    this.sendToMonitoring('warn', message, context);
  }

  static error(message: string, error?: unknown, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.error(`[ERROR] ${message}`, error, context);
    }
    
    // In production, send to error tracking service
    this.sendToMonitoring('error', message, { error, ...context });
  }

  static log(message: string, context?: LogContext): void {
    this.info(message, context);
  }

  private static sendToMonitoring(_level: string, _message: string, _context?: LogContext): void {
    // TODO: Implement monitoring service integration
    // For now, this is a placeholder
  }
}

// Convenience functions for common logging patterns
export const logFirebaseInit = (projectId: string) => 
  Logger.info('Firebase initialized successfully', { projectId });

export const logFirebaseError = (error: unknown, context?: LogContext) => 
  Logger.error('Firebase initialization failed', error, context);

export const logServiceError = (service: string, operation: string, error: unknown, context?: LogContext) => 
  Logger.error(`${service} ${operation} failed`, error, { service, operation, ...context });

export const logAPIError = (endpoint: string, error: unknown, context?: LogContext) => 
  Logger.error(`API error in ${endpoint}`, error, { endpoint, ...context });

export const logUserAction = (action: string, userId: string, context?: LogContext) => 
  Logger.info(`User action: ${action}`, { action, userId, ...context });

export const logServiceInfo = (service: string, operation: string, message: string, context?: LogContext) => 
  Logger.info(`${service} ${operation}: ${message}`, { service, operation, ...context });

export const logServiceWarn = (service: string, operation: string, message: string, context?: LogContext) => 
  Logger.warn(`${service} ${operation}: ${message}`, { service, operation, ...context });
