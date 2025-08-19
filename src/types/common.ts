import type { Timestamp } from "firebase/firestore";

// Base entity interface for all database models
export interface BaseEntity {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Standard API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  startAfter?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// Error types
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form validation
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
}

// Search and filter
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'price' | 'rating' | 'distance' | 'date';
  sortOrder?: 'asc' | 'desc';
}

// File upload
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// User roles and permissions
export type UserRole = 'user' | 'vendor' | 'user_vendor' | 'admin';

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}
