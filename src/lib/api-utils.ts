import { NextResponse } from 'next/server';
import { logAPIError } from './logger';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): NextResponse {
  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message, 
        code: error.code,
        success: false 
      },
      { status: error.statusCode }
    );
  }
  
  // Log unhandled errors
  logAPIError('unknown_endpoint', error);
  
  return NextResponse.json(
    { 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      success: false 
    },
    { status: 500 }
  );
}

export function createSuccessResponse<T>(data: T, statusCode: number = 200): NextResponse {
  return NextResponse.json({
    data,
    success: true,
    timestamp: new Date().toISOString()
  }, { status: statusCode });
}

export function createErrorResponse(message: string, statusCode: number = 400, code?: string): NextResponse {
  return NextResponse.json({
    error: message,
    code,
    success: false,
    timestamp: new Date().toISOString()
  }, { status: statusCode });
}

export function validateRequiredFields(body: Record<string, unknown>, requiredFields: string[]): void {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    throw new APIError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_FIELDS'
    );
  }
}

export function validateFieldType(value: unknown, expectedType: string, fieldName: string): void {
  if (typeof value !== expectedType) {
    throw new APIError(
      `Invalid type for ${fieldName}. Expected ${expectedType}, got ${typeof value}`,
      400,
      'INVALID_TYPE'
    );
  }
}

export function validateNumberRange(value: number, min: number, max: number, fieldName: string): void {
  if (value < min || value > max) {
    throw new APIError(
      `${fieldName} must be between ${min} and ${max}`,
      400,
      'INVALID_RANGE'
    );
  }
}

export function validateStringLength(value: string, minLength: number, maxLength: number, fieldName: string): void {
  if (value.length < minLength || value.length > maxLength) {
    throw new APIError(
      `${fieldName} must be between ${minLength} and ${maxLength} characters`,
      400,
      'INVALID_LENGTH'
    );
  }
}

export function sanitizeInput(input: string): string {
  // Basic input sanitization
  return input.trim().replace(/[<>]/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
