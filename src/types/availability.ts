import { z } from 'zod';

// Availability status
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  BLOCKED: 'blocked',
  MAINTENANCE: 'maintenance',
  HOLIDAY: 'holiday',
  CUSTOM: 'custom',
} as const;

export type AvailabilityStatus = typeof AVAILABILITY_STATUS[keyof typeof AVAILABILITY_STATUS];

// Time slot schema
export const timeSlotSchema = z.object({
  id: z.string(),
  startTime: z.string(), // HH:mm format
  endTime: z.string(), // HH:mm format
  duration: z.number().int().positive(), // minutes
  isAvailable: z.boolean().default(true),
  maxBookings: z.number().int().positive().default(1),
  currentBookings: z.number().int().min(0).default(0),
  price: z.number().positive().optional(),
  notes: z.string().optional(),
});

export type TimeSlot = z.infer<typeof timeSlotSchema>;

// Daily availability schema
export const dailyAvailabilitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  isWorkingDay: z.boolean().default(true),
  workingHours: z.object({
    start: z.string().default('09:00'),
    end: z.string().default('17:00'),
  }).default({}),
  timeSlots: z.array(timeSlotSchema).default([]),
  exceptions: z.array(z.object({
    startTime: z.string(),
    endTime: z.string(),
    status: z.nativeEnum(AVAILABILITY_STATUS),
    reason: z.string().optional(),
    notes: z.string().optional(),
  })).default([]),
  totalBookings: z.number().int().min(0).default(0),
  maxBookings: z.number().int().positive().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DailyAvailability = z.infer<typeof dailyAvailabilitySchema>;

// Weekly schedule schema
export const weeklyScheduleSchema = z.object({
  id: z.string(),
  userId: z.string(),
  weekStartDate: z.date(),
  weekEndDate: z.date(),
  schedule: z.object({
    monday: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }).optional(),
    tuesday: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }).optional(),
    wednesday: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }).optional(),
    thursday: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }).optional(),
    friday: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }).optional(),
    saturday: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }).optional(),
    sunday: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }).optional(),
  }),
  isRecurring: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WeeklySchedule = z.infer<typeof weeklyScheduleSchema>;

// Recurring availability schema
export const recurringAvailabilitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  pattern: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().int().positive().default(1),
    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(), // 0 = Sunday, 6 = Saturday
    dayOfMonth: z.number().int().min(1).max(31).optional(),
    monthOfYear: z.number().int().min(1).max(12).optional(),
    startDate: z.date(),
    endDate: z.date().optional(),
    count: z.number().int().positive().optional(),
  }),
  availability: dailyAvailabilitySchema.omit({ id: true, userId: true, date: true, createdAt: true, updatedAt: true }),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RecurringAvailability = z.infer<typeof recurringAvailabilitySchema>;

// Blocked time schema
export const blockedTimeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  status: z.nativeEnum(AVAILABILITY_STATUS),
  reason: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    interval: z.number().int().positive().default(1),
    endDate: z.date().optional(),
    count: z.number().int().positive().optional(),
  }).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlockedTime = z.infer<typeof blockedTimeSchema>;

// Availability conflict schema
export const availabilityConflictSchema = z.object({
  id: z.string(),
  userId: z.string(),
  conflictingBookings: z.array(z.object({
    bookingId: z.string(),
    serviceName: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    conflictType: z.enum(['overlap', 'double_booking', 'maintenance', 'other']),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
  })),
  suggestedResolutions: z.array(z.object({
    type: z.enum(['reschedule', 'cancel', 'modify', 'split']),
    description: z.string(),
    impact: z.string(),
    recommended: z.boolean().default(false),
  })),
  status: z.enum(['open', 'resolved', 'ignored']).default('open'),
  resolvedAt: z.date().optional(),
  resolutionNotes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AvailabilityConflict = z.infer<typeof availabilityConflictSchema>;

// Real-time availability update
export const availabilityUpdateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  timeSlot: z.string(), // HH:mm format
  status: z.nativeEnum(AVAILABILITY_STATUS),
  bookingId: z.string().optional(),
  reason: z.string().optional(),
  updatedBy: z.string(),
  timestamp: z.date(),
});

export type AvailabilityUpdate = z.infer<typeof availabilityUpdateSchema>;

// Availability settings
export const availabilitySettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  general: z.object({
    timezone: z.string().default('UTC'),
    dateFormat: z.string().default('MM/DD/YYYY'),
    timeFormat: z.enum(['12h', '24h']).default('12h'),
    workingDays: z.array(z.number().int().min(0).max(6)).default([1, 2, 3, 4, 5]), // Monday to Friday
    workingHours: z.object({
      start: z.string().default('09:00'),
      end: z.string().default('17:00'),
    }).default({}),
  }).default({}),
  booking: z.object({
    advanceBookingLimit: z.number().int().positive().default(365), // days
    sameDayBooking: z.boolean().default(false),
    lastMinuteBooking: z.boolean().default(false),
    lastMinuteThreshold: z.number().int().positive().default(24), // hours
    maxBookingsPerSlot: z.number().int().positive().default(1),
    bufferTime: z.number().int().min(0).default(15), // minutes
    autoConfirm: z.boolean().default(false),
    requireApproval: z.boolean().default(true),
  }).default({}),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
    reminderTime: z.number().int().positive().default(24), // hours before
  }).default({}),
  privacy: z.object({
    showAvailability: z.boolean().default(true),
    showEventDetails: z.boolean().default(false),
    allowBookingRequests: z.boolean().default(true),
    requireContactInfo: z.boolean().default(true),
  }).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AvailabilitySettings = z.infer<typeof availabilitySettingsSchema>;
