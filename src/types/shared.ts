import { CONSTANTS } from '@/constants';

// Base types for common properties
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BaseImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
}

export interface BasePricing {
  hourly: number;
  daily: number;
  weekly?: number;
  monthly?: number;
  currency: keyof typeof CONSTANTS.CURRENCIES;
  deposit?: number;
  cancellationFee?: number;
}

export interface BaseCapacity {
  min: number;
  max: number;
  recommended?: number;
  standing?: number;
  seated?: number;
}

export interface BaseAvailability {
  startDate: string;
  endDate: string;
  availableDays: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
  availableHours: {
    start: string;
    end: string;
  };
  blackoutDates?: string[];
  advanceBookingDays?: number;
}

// Venue Types
export interface BaseVenue extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  location: BaseLocation;
  images: BaseImage[];
  category: keyof typeof CONSTANTS.CATEGORIES;
  subcategories?: string[];
  capacity: BaseCapacity;
  pricing: BasePricing;
  rating: number;
  reviewCount: number;
  amenities: Record<keyof typeof CONSTANTS.AMENITIES, boolean>;
  availability: BaseAvailability;
  owner: BaseOwner;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  featured: boolean;
  verified: boolean;
  tags: string[];
  policies?: VenuePolicies;
  socialMedia?: SocialMediaLinks;
  contactInfo: ContactInfo;
}

export interface BaseOwner extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  verified: boolean;
  rating?: number;
  responseTime?: number;
}

export interface VenuePolicies {
  cancellation: 'flexible' | 'moderate' | 'strict' | 'super_strict';
  smoking: boolean;
  pets: boolean;
  alcohol: boolean;
  music: boolean;
  decorations: boolean;
  outsideCatering: boolean;
  outsideVendors: boolean;
  insurance: boolean;
  security: boolean;
  cleaning: boolean;
}

export interface SocialMediaLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  emergencyPhone?: string;
  responseTime?: string;
  preferredContact: 'email' | 'phone' | 'both';
}

// User Types
export interface BaseUser extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  preferences: UserPreferences;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLoginAt?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  language: string;
  timezone: string;
  currency: keyof typeof CONSTANTS.CURRENCIES;
  marketingEmails: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  bookingUpdates: boolean;
  venueRecommendations: boolean;
  promotionalOffers: boolean;
  securityAlerts: boolean;
}

// Booking Types
export interface BaseBooking extends BaseEntity {
  venueId: string;
  userId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  totalPrice: number;
  status: keyof typeof CONSTANTS.BOOKING_STATUSES;
  paymentStatus: keyof typeof CONSTANTS.PAYMENT_STATUSES;
  specialRequests?: string;
  eventType?: string;
  eventDescription?: string;
  setupTime?: number;
  cleanupTime?: number;
  additionalServices?: AdditionalService[];
  cancellationReason?: string;
  refundAmount?: number;
  notes?: string;
}

export interface AdditionalService {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  total: number;
}

// Review Types
export interface BaseReview extends BaseEntity {
  venueId: string;
  userId: string;
  bookingId?: string;
  rating: number;
  comment: string;
  images?: BaseImage[];
  helpful: number;
  reported: boolean;
  response?: ReviewResponse;
  categories: ReviewCategory[];
}

export interface ReviewResponse {
  id: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCategory {
  category: string;
  rating: number;
}

// Search and Filter Types
export interface BaseSearchFilters {
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  guestCount?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  categories?: Array<keyof typeof CONSTANTS.CATEGORIES>;
  amenities?: Array<keyof typeof CONSTANTS.AMENITIES>;
  rating?: number;
  availability?: {
    startDate: string;
    endDate: string;
  };
  features?: string[];
  radius?: number;
  sortBy?: 'price' | 'rating' | 'distance' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface BasePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API Response Types
export interface BaseApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: BasePagination;
  errors?: ApiError[];
  meta?: Record<string, unknown>;
}

export interface BaseError {
  code: string;
  message: string;
  details?: unknown;
  field?: string;
  timestamp: string;
}

export interface ApiError extends BaseError {
  statusCode: number;
  path: string;
  method: string;
}

// Form Types
export interface BaseFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime-local' | 'file';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: FieldValidation;
  options?: FormOption[];
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  custom?: (value: unknown) => boolean | string;
}

export interface FormOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// UI Component Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface BaseButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface BaseInputProps extends BaseComponentProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

export type ValueOf<T> = T[keyof T];

// Event Types
export interface BaseEvent extends BaseEntity {
  name: string;
  description: string;
  type: keyof typeof CONSTANTS.CATEGORIES;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venueId: string;
  userId: string;
  guestCount: number;
  budget?: number;
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  tags: string[];
  notes?: string;
  attachments?: BaseImage[];
}

// Notification Types
export interface BaseNotification extends BaseEntity {
  userId: string;
  type: 'booking' | 'venue' | 'review' | 'payment' | 'system' | 'marketing';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expiresAt?: string;
}

// All types are already exported above

