import { z } from 'zod';
import { AppError } from './errors';

// Common validation schemas
export const commonSchemas = {
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  url: z.string().url('Invalid URL format'),
  date: z.date().or(z.string().transform(str => new Date(str))),
  positiveNumber: z.number().positive('Must be a positive number'),
  nonNegativeNumber: z.number().min(0, 'Must be a non-negative number'),
  stringMax: (max: number) => z.string().max(max, `Must be ${max} characters or less`),
  stringMin: (min: number) => z.string().min(min, `Must be at least ${min} characters`),
};

// User validation schemas
export const userSchemas = {
  profile: z.object({
    firstName: commonSchemas.stringMin(2).max(50),
    lastName: commonSchemas.stringMin(2).max(50),
    bio: commonSchemas.stringMax(500).optional(),
    website: commonSchemas.url.optional(),
    location: z.object({
      city: commonSchemas.stringMin(2).max(100),
      state: commonSchemas.stringMin(2).max(100),
      country: commonSchemas.stringMin(2).max(100),
    }),
    socialMedia: z.object({
      facebook: commonSchemas.url.optional(),
      twitter: commonSchemas.url.optional(),
      instagram: commonSchemas.url.optional(),
      linkedin: commonSchemas.url.optional(),
    }).optional(),
  }),
  
  vendorProfile: z.object({
    businessName: commonSchemas.stringMin(2).max(100),
    businessType: z.enum(['individual', 'company']),
    businessLicense: commonSchemas.stringMax(100).optional(),
    taxId: commonSchemas.stringMax(50).optional(),
    specialties: z.array(z.string().max(50)).max(10).optional(),
    yearsInBusiness: commonSchemas.nonNegativeNumber.max(100).optional(),
  }).optional(),
  
  preferences: z.object({
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      sms: z.boolean(),
    }).optional(),
    privacy: z.object({
      profileVisible: z.boolean(),
      showLocation: z.boolean(),
      showContactInfo: z.boolean(),
    }).optional(),
    language: z.string().max(10).optional(),
    timezone: z.string().max(50).optional(),
  }).optional(),
};

// Venue validation schemas
export const venueSchemas = {
  basic: z.object({
    title: commonSchemas.stringMin(5).max(100),
    description: commonSchemas.stringMin(20).max(2000),
    category: z.string().min(1, 'Category is required'),
    price: commonSchemas.positiveNumber,
    capacity: commonSchemas.positiveNumber,
    location: z.object({
      address: commonSchemas.stringMin(10).max(200),
      city: commonSchemas.stringMin(2).max(100),
      state: commonSchemas.stringMin(2).max(100),
      country: commonSchemas.stringMin(2).max(100),
      coordinates: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      }).optional(),
    }),
  }),
  
  amenities: z.array(z.string().max(50)).max(50).optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10),
  availability: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  })).optional(),
};

// Booking validation schemas
export const bookingSchemas = {
  create: z.object({
    venueId: z.string().min(1, 'Venue ID is required'),
    startDate: commonSchemas.date,
    endDate: commonSchemas.date,
    guestCount: commonSchemas.positiveNumber,
    specialRequests: commonSchemas.stringMax(500).optional(),
    contactInfo: z.object({
      name: commonSchemas.stringMin(2).max(100),
      email: commonSchemas.email,
      phone: commonSchemas.phone.optional(),
    }),
  }),
  
  update: z.object({
    startDate: commonSchemas.date.optional(),
    endDate: commonSchemas.date.optional(),
    guestCount: commonSchemas.positiveNumber.optional(),
    specialRequests: commonSchemas.stringMax(500).optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  }),
};

// Payment validation schemas
export const paymentSchemas = {
  card: z.object({
    number: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
    expiryMonth: z.number().min(1).max(12),
    expiryYear: z.number().min(new Date().getFullYear()),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
    name: commonSchemas.stringMin(2).max(100),
  }),
  
  payment: z.object({
    amount: commonSchemas.positiveNumber,
    currency: z.string().length(3, 'Currency must be 3 characters'),
    description: commonSchemas.stringMax(200).optional(),
    metadata: z.record(z.string()).optional(),
  }),
};

// Validation utility functions
export class ValidationUtils {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        if (firstError) {
          throw AppError.fromValidationError(
            firstError.path.join('.'),
            firstError.message
          );
        }
      }
      throw error;
    }
  }

  static validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): Partial<T> {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        if (firstError) {
          throw AppError.fromValidationError(
            firstError.path.join('.'),
            firstError.message
          );
        }
      }
      throw error;
    }
  }

  static safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        if (firstError) {
          return { 
            success: false, 
            error: `Validation error in ${firstError.path.join('.')}: ${firstError.message}` 
          };
        }
      }
      return { success: false, error: 'Validation failed' };
    }
  }

  static validateStrict<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        if (firstError) {
          throw AppError.fromValidationError(
            firstError.path.join('.'),
            firstError.message
          );
        }
      }
      throw error;
    }
  }

  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validatePassword(password: string): boolean {
    return password.length >= 8 && 
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  }

  static validateDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }

  static validatePrice(price: number): boolean {
    return price > 0 && price <= 1000000; // Max $1M
  }

  static validateCapacity(capacity: number): boolean {
    return capacity > 0 && capacity <= 10000; // Max 10K people
  }
}

// Form validation helpers
export class FormValidation {
  static validateRequired(value: unknown, fieldName: string): string | null {
    if (value === null || value === undefined || value === '') {
      return `${fieldName} is required`;
    }
    return null;
  }

  static validateMinLength(value: string, minLength: number, fieldName: string): string | null {
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
  }

  static validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
    if (value.length > maxLength) {
      return `${fieldName} must be ${maxLength} characters or less`;
    }
    return null;
  }

  static validatePattern(value: string, pattern: RegExp, fieldName: string, message: string): string | null {
    if (!pattern.test(value)) {
      return `${fieldName}: ${message}`;
    }
    return null;
  }

  static validateCustom<T>(value: T, validator: (value: T) => string | null): string | null {
    return validator(value);
  }
}
