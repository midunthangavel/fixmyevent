import { z } from 'zod';

import type { Timestamp } from 'firebase/firestore';

// Base booking schema
const baseBookingSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  serviceImage: z.string().url(),
  serviceLocation: z.string(),
  serviceHint: z.string(),
  category: z.enum(['Venue', 'Decorations', 'Catering', 'Photography', 'Transport', 'Legal', 'Music', 'Invitations', 'Planner', 'Event Staff']),
  status: z.enum(['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected']),
  bookingDate: z.any(), // Firestore Timestamp
  createdAt: z.any().optional(), // Firestore Timestamp
  updatedAt: z.any().optional(), // Firestore Timestamp
  
  // Common fields
  totalAmount: z.number().positive(),
  advanceAmount: z.number().min(0),
  remainingAmount: z.number().min(0),
  notes: z.string().optional(),
  
  // Review
  review: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string(),
    authorName: z.string(),
    avatar: z.string().url().optional(),
    createdAt: z.any().optional(),
  }).optional(),
});

// Venue-specific booking
const venueBookingSchema = baseBookingSchema.extend({
  category: z.literal('Venue'),
  guestCount: z.number().positive(),
  startTime: z.string(),
  endTime: z.string(),
  setupTime: z.string().optional(),
  cleanupTime: z.string().optional(),
  amenities: z.array(z.string()).optional(),
});

// Catering-specific booking
const cateringBookingSchema = baseBookingSchema.extend({
  category: z.literal('Catering'),
  guestCount: z.number().positive(),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Full Day']),
  dietaryRequirements: z.array(z.string()).optional(),
  serviceStyle: z.enum(['Buffet', 'Plated', 'Family Style', 'Food Stations']),
  staffCount: z.number().int().positive().optional(),
});

// Photography-specific booking
const photographyBookingSchema = baseBookingSchema.extend({
  category: z.literal('Photography'),
  packageType: z.string(),
  hoursOfCoverage: z.number().positive(),
  deliveryDate: z.string().optional(),
  photoCount: z.number().int().positive().optional(),
  videoIncluded: z.boolean().optional(),
  droneCoverage: z.boolean().optional(),
});

// Transport-specific booking
const transportBookingSchema = baseBookingSchema.extend({
  category: z.literal('Transport'),
  vehicleType: z.string(),
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
  passengerCount: z.number().int().positive(),
  returnTrip: z.boolean().optional(),
  specialRequirements: z.string().optional(),
});

// Decorations-specific booking
const decorationsBookingSchema = baseBookingSchema.extend({
  category: z.literal('Decorations'),
  theme: z.string(),
  colorScheme: z.string().optional(),
  setupDate: z.string(),
  teardownDate: z.string().optional(),
  fullService: z.boolean(),
  customRequirements: z.string().optional(),
});

// Legal-specific booking
const legalBookingSchema = baseBookingSchema.extend({
  category: z.literal('Legal'),
  serviceType: z.string(),
  consultationDate: z.string().optional(),
  documentType: z.string().optional(),
  urgency: z.enum(['Low', 'Medium', 'High', 'Urgent']),
});

// Music-specific booking
const musicBookingSchema = baseBookingSchema.extend({
  category: z.literal('Music'),
  serviceType: z.enum(['Live Band', 'DJ', 'Solo Artist', 'Karaoke']),
  startTime: z.string(),
  endTime: z.string(),
  equipmentProvided: z.boolean(),
  playlist: z.array(z.string()).optional(),
  specialRequests: z.string().optional(),
});

// Invitations-specific booking
const invitationsBookingSchema = baseBookingSchema.extend({
  category: z.literal('Invitations'),
  quantity: z.number().int().positive(),
  designType: z.string(),
  paperType: z.string().optional(),
  printingMethod: z.string().optional(),
  deliveryDate: z.string(),
  customDesign: z.boolean(),
});

// Planner-specific booking
const plannerBookingSchema = baseBookingSchema.extend({
  category: z.literal('Planner'),
  serviceLevel: z.enum(['Full Service', 'Partial Planning', 'Day-of Coordination', 'Consultation']),
  eventDate: z.string(),
  planningStartDate: z.string().optional(),
  meetingsIncluded: z.number().int().positive().optional(),
  vendorCoordination: z.boolean(),
});

// Event Staff-specific booking
const eventStaffBookingSchema = baseBookingSchema.extend({
  category: z.literal('Event Staff'),
  staffCount: z.number().int().positive(),
  roles: z.array(z.string()),
  startTime: z.string(),
  endTime: z.string(),
  uniformProvided: z.boolean().optional(),
  trainingRequired: z.boolean().optional(),
});

// Union type for all booking schemas
export const bookingSchema = z.discriminatedUnion('category', [
  venueBookingSchema,
  cateringBookingSchema,
  photographyBookingSchema,
  transportBookingSchema,
  decorationsBookingSchema,
  legalBookingSchema,
  musicBookingSchema,
  invitationsBookingSchema,
  plannerBookingSchema,
  eventStaffBookingSchema,
]);

export type Booking = z.infer<typeof baseBookingSchema> & {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // Additional properties based on category
  guestCount?: number;
  startTime?: string;
  endTime?: string;
  packageType?: string;
  vehicleType?: string;
  theme?: string;
  serviceType?: string;
  quantity?: number;
  serviceLevel?: string;
  staffCount?: number;
};

export type BookingFormValues = z.infer<typeof bookingSchema>;

// Booking status enum for easier management
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Payment status enum
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  COMPLETED: 'Completed',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
