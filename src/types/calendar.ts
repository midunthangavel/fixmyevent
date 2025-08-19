import { z } from 'zod';

// Calendar provider types
export const CALENDAR_PROVIDER = {
  GOOGLE: 'google',
  OUTLOOK: 'outlook',
  APPLE: 'apple',
  LOCAL: 'local',
} as const;

export type CalendarProvider = typeof CALENDAR_PROVIDER[keyof typeof CALENDAR_PROVIDER];

// Calendar event status
export const EVENT_STATUS = {
  TENTATIVE: 'tentative',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];

// Calendar event schema
export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  status: z.nativeEnum(EVENT_STATUS).default('confirmed'),
  provider: z.nativeEnum(CALENDAR_PROVIDER),
  providerEventId: z.string().optional(),
  bookingId: z.string().optional(),
  userId: z.string(),
  calendarId: z.string().optional(),
  attendees: z.array(z.object({
    email: z.string().email(),
    name: z.string().optional(),
    responseStatus: z.enum(['needsAction', 'declined', 'tentative', 'accepted']).default('needsAction'),
  })).optional(),
  reminders: z.array(z.object({
    method: z.enum(['email', 'popup']),
    minutes: z.number().int().positive(),
  })).optional(),
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    interval: z.number().int().positive().default(1),
    endDate: z.date().optional(),
    count: z.number().int().positive().optional(),
    daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
  }).optional(),
  metadata: z.record(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

// Calendar integration schema
export const calendarIntegrationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  provider: z.nativeEnum(CALENDAR_PROVIDER),
  providerAccountId: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.date().optional(),
  calendarIds: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  syncEnabled: z.boolean().default(true),
  lastSyncAt: z.date().optional(),
  settings: z.object({
    autoSync: z.boolean().default(true),
    syncDirection: z.enum(['bidirectional', 'import', 'export']).default('bidirectional'),
    defaultCalendar: z.string().optional(),
    conflictResolution: z.enum(['local', 'remote', 'manual']).default('manual'),
  }).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CalendarIntegration = z.infer<typeof calendarIntegrationSchema>;

// Calendar sync result
export const syncResultSchema = z.object({
  success: z.boolean(),
  eventsCreated: z.number().default(0),
  eventsUpdated: z.number().default(0),
  eventsDeleted: z.number().default(0),
  conflicts: z.array(z.object({
    localEvent: calendarEventSchema,
    remoteEvent: calendarEventSchema,
    conflictType: z.enum(['time', 'location', 'attendees', 'other']),
  })).default([]),
  errors: z.array(z.string()).default([]),
  lastSyncAt: z.date(),
});

export type SyncResult = z.infer<typeof syncResultSchema>;

// Calendar availability slot
export const availabilitySlotSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  isAvailable: z.boolean().default(true),
  bookingId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;

// Calendar settings
export const calendarSettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workingHours: z.object({
    monday: z.object({
      isWorking: z.boolean().default(true),
      startTime: z.string().default('09:00'),
      endTime: z.string().default('17:00'),
    }).default({}),
    tuesday: z.object({
      isWorking: z.boolean().default(true),
      startTime: z.string().default('09:00'),
      endTime: z.string().default('17:00'),
    }).default({}),
    wednesday: z.object({
      isWorking: z.boolean().default(true),
      startTime: z.string().default('09:00'),
      endTime: z.string().default('17:00'),
    }).default({}),
    thursday: z.object({
      isWorking: z.boolean().default(true),
      startTime: z.string().default('09:00'),
      endTime: z.string().default('17:00'),
    }).default({}),
    friday: z.object({
      isWorking: z.boolean().default(true),
      startTime: z.string().default('09:00'),
      endTime: z.string().default('17:00'),
    }).default({}),
    saturday: z.object({
      isWorking: z.boolean().default(false),
      startTime: z.string().default('10:00'),
      endTime: z.string().default('16:00'),
    }).default({}),
    sunday: z.object({
      isWorking: z.boolean().default(false),
      startTime: z.string().default('10:00'),
      endTime: z.string().default('16:00'),
    }).default({}),
  }).default({}),
  timezone: z.string().default('UTC'),
  defaultDuration: z.number().int().positive().default(60), // minutes
  bufferTime: z.number().int().min(0).default(15), // minutes
  advanceBookingLimit: z.number().int().positive().default(365), // days
  sameDayBooking: z.boolean().default(false),
  autoConfirm: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CalendarSettings = z.infer<typeof calendarSettingsSchema>;
