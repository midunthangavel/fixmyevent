// Application Constants
export const APP_CONFIG = {
  name: 'FixmyEvent',
  version: '0.2.0',
  description: 'Event Planning Made Easy',
  url: 'https://fixmyevent.com',
  supportEmail: 'support@fixmyevent.com',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedImageFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  maxImagesPerVenue: 10,
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
  },
} as const;

// API Constants
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retryAttempts: 3,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
    },
    venues: {
      list: '/venues',
      detail: '/venues/:id',
      search: '/venues/search',
      create: '/venues',
      update: '/venues/:id',
      delete: '/venues/:id',
    },
    bookings: {
      list: '/bookings',
      detail: '/bookings/:id',
      create: '/bookings',
      update: '/bookings/:id',
      cancel: '/bookings/:id/cancel',
    },
    reviews: {
      list: '/reviews',
      create: '/reviews',
      update: '/reviews/:id',
      delete: '/reviews/:id',
    },
  },
} as const;

// Event Categories
export const EVENT_CATEGORIES = {
  WEDDING: 'wedding',
  CORPORATE: 'corporate',
  BIRTHDAY: 'birthday',
  CONFERENCE: 'conference',
  PARTY: 'party',
  MEETING: 'meeting',
  SEMINAR: 'seminar',
  WORKSHOP: 'workshop',
  EXHIBITION: 'exhibition',
  CONCERT: 'concert',
  SPORTS: 'sports',
  OTHER: 'other',
} as const;

export const EVENT_CATEGORY_LABELS: Record<typeof EVENT_CATEGORIES[keyof typeof EVENT_CATEGORIES], string> = {
  [EVENT_CATEGORIES.WEDDING]: 'Wedding',
  [EVENT_CATEGORIES.CORPORATE]: 'Corporate Event',
  [EVENT_CATEGORIES.BIRTHDAY]: 'Birthday Party',
  [EVENT_CATEGORIES.CONFERENCE]: 'Conference',
  [EVENT_CATEGORIES.PARTY]: 'Party',
  [EVENT_CATEGORIES.MEETING]: 'Meeting',
  [EVENT_CATEGORIES.SEMINAR]: 'Seminar',
  [EVENT_CATEGORIES.WORKSHOP]: 'Workshop',
  [EVENT_CATEGORIES.EXHIBITION]: 'Exhibition',
  [EVENT_CATEGORIES.CONCERT]: 'Concert',
  [EVENT_CATEGORIES.SPORTS]: 'Sports Event',
  [EVENT_CATEGORIES.OTHER]: 'Other',
} as const;

// Venue Amenities
export const VENUE_AMENITIES = {
  PARKING: 'parking',
  WIFI: 'wifi',
  CATERING: 'catering',
  AUDIO_VISUAL: 'audio_visual',
  STAGE: 'stage',
  DANCE_FLOOR: 'dance_floor',
  BAR: 'bar',
  RESTROOMS: 'restrooms',
  ACCESSIBILITY: 'accessibility',
  OUTDOOR_SPACE: 'outdoor_space',
  KITCHEN: 'kitchen',
  SECURITY: 'security',
  VALET: 'valet',
  TRANSPORTATION: 'transportation',
} as const;

export const AMENITY_LABELS: Record<typeof VENUE_AMENITIES[keyof typeof VENUE_AMENITIES], string> = {
  [VENUE_AMENITIES.PARKING]: 'Parking',
  [VENUE_AMENITIES.WIFI]: 'WiFi',
  [VENUE_AMENITIES.CATERING]: 'Catering',
  [VENUE_AMENITIES.AUDIO_VISUAL]: 'Audio/Visual',
  [VENUE_AMENITIES.STAGE]: 'Stage',
  [VENUE_AMENITIES.DANCE_FLOOR]: 'Dance Floor',
  [VENUE_AMENITIES.BAR]: 'Bar',
  [VENUE_AMENITIES.RESTROOMS]: 'Restrooms',
  [VENUE_AMENITIES.ACCESSIBILITY]: 'Accessibility',
  [VENUE_AMENITIES.OUTDOOR_SPACE]: 'Outdoor Space',
  [VENUE_AMENITIES.KITCHEN]: 'Kitchen',
  [VENUE_AMENITIES.SECURITY]: 'Security',
  [VENUE_AMENITIES.VALET]: 'Valet',
  [VENUE_AMENITIES.TRANSPORTATION]: 'Transportation',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
  USER_VENDOR: 'user_vendor',
  ADMIN: 'admin',
} as const;

export const USER_ROLE_LABELS: Record<typeof USER_ROLES[keyof typeof USER_ROLES], string> = {
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.VENDOR]: 'Vendor',
  [USER_ROLES.USER_VENDOR]: 'User & Vendor',
  [USER_ROLES.ADMIN]: 'Administrator',
} as const;

// Booking Statuses
export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
} as const;

export const BOOKING_STATUS_LABELS: Record<typeof BOOKING_STATUSES[keyof typeof BOOKING_STATUSES], string> = {
  [BOOKING_STATUSES.PENDING]: 'Pending',
  [BOOKING_STATUSES.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUSES.CANCELLED]: 'Cancelled',
  [BOOKING_STATUSES.COMPLETED]: 'Completed',
  [BOOKING_STATUSES.NO_SHOW]: 'No Show',
} as const;

// Payment Statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export const PAYMENT_STATUS_LABELS: Record<typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES], string> = {
  [PAYMENT_STATUSES.PENDING]: 'Pending',
  [PAYMENT_STATUSES.PAID]: 'Paid',
  [PAYMENT_STATUSES.FAILED]: 'Failed',
  [PAYMENT_STATUSES.REFUNDED]: 'Refunded',
  [PAYMENT_STATUSES.PARTIALLY_REFUNDED]: 'Partially Refunded',
} as const;

// Currency Options
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  CAD: 'CAD',
  AUD: 'AUD',
  JPY: 'JPY',
  CHF: 'CHF',
  CNY: 'CNY',
  INR: 'INR',
  BRL: 'BRL',
} as const;

export const CURRENCY_SYMBOLS: Record<typeof CURRENCIES[keyof typeof CURRENCIES], string> = {
  [CURRENCIES.USD]: '$',
  [CURRENCIES.EUR]: '€',
  [CURRENCIES.GBP]: '£',
  [CURRENCIES.CAD]: 'C$',
  [CURRENCIES.AUD]: 'A$',
  [CURRENCIES.JPY]: '¥',
  [CURRENCIES.CHF]: 'CHF',
  [CURRENCIES.CNY]: '¥',
  [CURRENCIES.INR]: '₹',
  [CURRENCIES.BRL]: 'R$',
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_SECOND: 1000,
  SECONDS_PER_MINUTE: 60,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  DAYS_PER_WEEK: 7,
  DAYS_PER_MONTH: 30,
  DAYS_PER_YEAR: 365,
  DAYS_OF_WEEK: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const,
  DAYS_PER_WEEK_ARRAY: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const,
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  EMAIL: {
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]+$/,
    MAX_LENGTH: 20,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z\s\-']+$/,
  },
  VENUE_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2000,
  },
  PRICE: {
    MIN: 0,
    MAX: 1000000,
    DECIMAL_PLACES: 2,
  },
  CAPACITY: {
    MIN: 1,
    MAX: 10000,
  },
  RATING: {
    MIN: 1,
    MAX: 5,
    DECIMAL_PLACES: 1,
  },
} as const;

// UI Constants
export const UI = {
  BREAKPOINTS: {
    XS: 475,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
    '3XL': 1600,
    '4XL': 1920,
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
      EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
    '3XL': '4rem',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
    WEAK_PASSWORD: 'Password is too weak',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
  },
  VENUE: {
    NOT_FOUND: 'Venue not found',
    ALREADY_EXISTS: 'A venue with this name already exists',
    INVALID_DATA: 'Invalid venue data provided',
    UNAUTHORIZED_ACCESS: 'You are not authorized to access this venue',
  },
  BOOKING: {
    NOT_FOUND: 'Booking not found',
    ALREADY_EXISTS: 'A booking already exists for this time slot',
    INVALID_DATES: 'Invalid booking dates provided',
    VENUE_UNAVAILABLE: 'Venue is not available for the selected dates',
    UNAUTHORIZED_ACCESS: 'You are not authorized to access this booking',
  },
  GENERAL: {
    NETWORK_ERROR: 'Network error. Please check your connection and try again',
    SERVER_ERROR: 'Server error. Please try again later',
    VALIDATION_ERROR: 'Please check your input and try again',
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Successfully logged in',
    REGISTER: 'Account created successfully',
    LOGOUT: 'Successfully logged out',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  VENUE: {
    CREATED: 'Venue created successfully',
    UPDATED: 'Venue updated successfully',
    DELETED: 'Venue deleted successfully',
  },
  BOOKING: {
    CREATED: 'Booking created successfully',
    UPDATED: 'Booking updated successfully',
    CANCELLED: 'Booking cancelled successfully',
  },
  GENERAL: {
    SAVED: 'Changes saved successfully',
    DELETED: 'Item deleted successfully',
    UPDATED: 'Updated successfully',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recent_searches',
  FAVORITES: 'favorites',
  CART: 'cart',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  VENUES: '/venues',
  VENUE_DETAIL: '/venues/:id',
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: '/bookings/:id',
  ADD_LISTING: '/add-listing',
  SEARCH: '/search',
  FAVORITES: '/favorites',
  CHAT: '/chat',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const;

// Export all constants as a single object for easy access
export const CONSTANTS = {
  APP: APP_CONFIG,
  API: API_CONFIG,
  CATEGORIES: EVENT_CATEGORIES,
  CATEGORY_LABELS: EVENT_CATEGORY_LABELS,
  AMENITIES: VENUE_AMENITIES,
  AMENITY_LABELS,
  ROLES: USER_ROLES,
  ROLE_LABELS: USER_ROLE_LABELS,
  BOOKING_STATUSES,
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  CURRENCIES,
  CURRENCY_SYMBOLS,
  TIME: TIME_CONSTANTS,
  VALIDATION,
  UI,
  ERRORS: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES,
  STORAGE: STORAGE_KEYS,
  ROUTES,
} as const;
