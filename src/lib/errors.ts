import type { AppError } from '@/types/common';

// Error codes for consistent error handling
export const ERROR_CODES = {
  // Authentication errors
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS',
  AUTH_WEAK_PASSWORD: 'AUTH_WEAK_PASSWORD',
  AUTH_INVALID_EMAIL: 'AUTH_INVALID_EMAIL',
  
  // Database errors
  DB_DOCUMENT_NOT_FOUND: 'DB_DOCUMENT_NOT_FOUND',
  DB_PERMISSION_DENIED: 'DB_PERMISSION_DENIED',
  DB_QUOTA_EXCEEDED: 'DB_QUOTA_EXCEEDED',
  DB_UNAVAILABLE: 'DB_UNAVAILABLE',
  DB_ALREADY_EXISTS: 'DB_ALREADY_EXISTS',
  
  // Validation errors
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_INVALID_VALUE: 'VALIDATION_INVALID_VALUE',
  VALIDATION_TOO_LONG: 'VALIDATION_TOO_LONG',
  VALIDATION_TOO_SHORT: 'VALIDATION_TOO_SHORT',
  
  // Business logic errors
  BOOKING_UNAVAILABLE: 'BOOKING_UNAVAILABLE',
  BOOKING_ALREADY_EXISTS: 'BOOKING_ALREADY_EXISTS',
  VENUE_NOT_FOUND: 'VENUE_NOT_FOUND',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Network errors
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',
  NETWORK_BAD_REQUEST: 'NETWORK_BAD_REQUEST',
  NETWORK_SERVER_ERROR: 'NETWORK_SERVER_ERROR',
  
  // File upload errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE: 'FILE_INVALID_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Custom error classes
export class AppError extends Error implements AppError {
  public code: ErrorCode;
  public statusCode: number;
  public details?: Record<string, any>;

  constructor(
    message: string,
    code: ErrorCode = ERROR_CODES.UNKNOWN_ERROR,
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }

  static fromFirebaseError(error: any): AppError {
    const firebaseErrorMap: Record<string, { code: ErrorCode; statusCode: number; message: string }> = {
      'auth/user-not-found': {
        code: ERROR_CODES.AUTH_USER_NOT_FOUND,
        statusCode: 404,
        message: 'User not found'
      },
      'auth/wrong-password': {
        code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
        statusCode: 401,
        message: 'Invalid email or password'
      },
      'auth/email-already-in-use': {
        code: ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS,
        statusCode: 409,
        message: 'Email already exists'
      },
      'auth/weak-password': {
        code: ERROR_CODES.AUTH_WEAK_PASSWORD,
        statusCode: 400,
        message: 'Password is too weak'
      },
      'auth/invalid-email': {
        code: ERROR_CODES.AUTH_INVALID_EMAIL,
        statusCode: 400,
        message: 'Invalid email format'
      },
      'permission-denied': {
        code: ERROR_CODES.DB_PERMISSION_DENIED,
        statusCode: 403,
        message: 'Permission denied'
      },
      'not-found': {
        code: ERROR_CODES.DB_DOCUMENT_NOT_FOUND,
        statusCode: 404,
        message: 'Document not found'
      },
      'unavailable': {
        code: ERROR_CODES.DB_UNAVAILABLE,
        statusCode: 503,
        message: 'Service temporarily unavailable'
      }
    };

    const errorInfo = firebaseErrorMap[error.code] || {
      code: ERROR_CODES.UNKNOWN_ERROR,
      statusCode: 500,
      message: error.message || 'An unknown error occurred'
    };

    return new AppError(errorInfo.message, errorInfo.code, errorInfo.statusCode, {
      originalError: error,
      firebaseCode: error.code
    });
  }

  static fromValidationError(field: string, message: string): AppError {
    return new AppError(
      `Validation error in field '${field}': ${message}`,
      ERROR_CODES.VALIDATION_REQUIRED_FIELD,
      400,
      { field, message }
    );
  }

  static fromNetworkError(error: any): AppError {
    if (error.code === 'ECONNABORTED') {
      return new AppError('Request timeout', ERROR_CODES.NETWORK_TIMEOUT, 408);
    }
    
    if (error.response) {
      const statusCode = error.response.status;
      const message = error.response.data?.message || 'Network request failed';
      
      if (statusCode >= 500) {
        return new AppError(message, ERROR_CODES.NETWORK_SERVER_ERROR, statusCode);
      }
      
      if (statusCode >= 400) {
        return new AppError(message, ERROR_CODES.NETWORK_BAD_REQUEST, statusCode);
      }
    }
    
    return new AppError('Network error', ERROR_CODES.NETWORK_UNAVAILABLE, 503);
  }
}

// Error handler utility
export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }
    
    if (error && typeof error === 'object' && 'code' in error) {
      // Firebase error
      return AppError.fromFirebaseError(error);
    }
    
    if (error && typeof error === 'object' && 'response' in error) {
      // Network error
      return AppError.fromNetworkError(error);
    }
    
    // Generic error
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return new AppError(message, ERROR_CODES.UNKNOWN_ERROR, 500);
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  static getErrorMessage(error: unknown): string {
    if (this.isAppError(error)) {
      return error.message;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'An unknown error occurred';
  }

  static getErrorCode(error: unknown): ErrorCode {
    if (this.isAppError(error)) {
      return error.code;
    }
    
    return ERROR_CODES.UNKNOWN_ERROR;
  }
}

// Error logger utility
export class ErrorLogger {
  static log(error: AppError, context?: Record<string, any>): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      context,
      stack: error.stack
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog);
    }
    
    // In production, you might want to send to a logging service
    // TODO: Implement production logging service
  }
}
