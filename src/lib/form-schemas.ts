import { z } from 'zod';

// Base schemas for common fields
export const baseSchemas = {
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be 100 characters or less'),
  
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be 100 characters or less'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be 20 digits or less')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number format'),
  
  address: z.string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must be 200 characters or less'),
  
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be 1000 characters or less'),
  
  guestCapacity: z.number()
    .int('Guest capacity must be a whole number')
    .min(1, 'Guest capacity must be at least 1')
    .max(10000, 'Guest capacity cannot exceed 10,000'),
  
  pricing: z.string()
    .min(5, 'Pricing information must be at least 5 characters')
    .max(200, 'Pricing information must be 200 characters or less'),
  
  costPerPerson: z.number()
    .min(0, 'Cost per person cannot be negative')
    .max(1000, 'Cost per person cannot exceed $1,000'),
  
  advanceAmount: z.number()
    .min(0, 'Advance amount cannot be negative')
    .max(100000, 'Advance amount cannot exceed $100,000'),
  
  staffCount: z.number()
    .int('Staff count must be a whole number')
    .min(0, 'Staff count cannot be negative')
    .max(1000, 'Staff count cannot exceed 1,000'),
  
  specialRequirements: z.string()
    .max(500, 'Special requirements must be 500 characters or less')
    .optional(),
  
  photos: z.array(z.string())
    .min(1, 'At least one photo is required')
    .max(20, 'Maximum 20 photos allowed'),
  
  availability: z.object({
    startDate: z.date(),
    endDate: z.date(),
    timeSlots: z.array(z.string()),
    blackoutDates: z.array(z.date()).optional(),
  }),
  
  amenities: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one amenity must be selected'
    ),
  
  cuisineTypes: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one cuisine type must be selected'
    ),
  
  dietaryOptions: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one dietary option must be selected'
    ),
  
  serviceType: z.enum(['full-service', 'drop-off', 'partial', 'buffet', 'plated', 'family-style']),
  
  menuOptions: z.string()
    .max(500, 'Menu options must be 500 characters or less')
    .optional(),
  
  // Music/Entertainment specific
  musicGenres: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one music genre must be selected'
    ),
  
  // Photography specific
  photographyStyles: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one photography style must be selected'
    ),
  
  // Transportation specific
  transportationTypes: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one transportation type must be selected'
    ),
  
  // Decoration specific
  decorationStyles: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one decoration style must be selected'
    ),
  
  // Legal/Insurance specific
  insuranceTypes: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one insurance type must be selected'
    ),
  
  certifications: z.record(z.string(), z.boolean())
    .refine(
      (data) => Object.values(data).some(Boolean),
      'At least one certification must be selected'
    ),
  
  // Payment and terms
  paymentTerms: z.enum([
    'full-payment-upfront',
    '50-deposit-30-days',
    '25-deposit-14-days',
    'payment-plans',
    'net-30',
    'net-60',
    'custom-terms'
  ]),
  
  cancellationPolicy: z.enum([
    'full-refund-30-days',
    'full-refund-14-days',
    'full-refund-7-days',
    '50-refund-7-days',
    'no-refunds',
    'custom-policy'
  ]),
  
  // Business information
  businessLicense: z.string()
    .min(1, 'Business license is required')
    .max(100, 'Business license must be 100 characters or less'),
  
  taxId: z.string()
    .min(1, 'Tax ID is required')
    .max(50, 'Tax ID must be 50 characters or less'),
  
  insuranceCertificate: z.string()
    .min(1, 'Insurance certificate is required')
    .max(100, 'Insurance certificate must be 100 characters or less'),
};

// Venue form schema
export const venueFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  guestCapacity: baseSchemas.guestCapacity,
  pricing: baseSchemas.pricing,
  amenities: baseSchemas.amenities,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
  availability: baseSchemas.availability,
});

// Catering form schema
export const cateringFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  guestCapacity: baseSchemas.guestCapacity,
  costPerPerson: baseSchemas.costPerPerson,
  advanceAmount: baseSchemas.advanceAmount,
  staffCount: baseSchemas.staffCount,
  serviceType: baseSchemas.serviceType,
  cuisineTypes: baseSchemas.cuisineTypes,
  dietaryOptions: baseSchemas.dietaryOptions,
  description: baseSchemas.description,
  menuOptions: baseSchemas.menuOptions,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
});

// Music/Entertainment form schema
export const musicFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  musicGenres: baseSchemas.musicGenres,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
  availability: baseSchemas.availability,
});

// Photography form schema
export const photographyFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  photographyStyles: baseSchemas.photographyStyles,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
  availability: baseSchemas.availability,
});

// Transportation form schema
export const transportationFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  transportationTypes: baseSchemas.transportationTypes,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
  availability: baseSchemas.availability,
});

// Decoration form schema
export const decorationFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  decorationStyles: baseSchemas.decorationStyles,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
  availability: baseSchemas.availability,
});

// Legal/Insurance form schema
export const legalFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  insuranceTypes: baseSchemas.insuranceTypes,
  certifications: baseSchemas.certifications,
  businessLicense: baseSchemas.businessLicense,
  taxId: baseSchemas.taxId,
  insuranceCertificate: baseSchemas.insuranceCertificate,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
});

// Planner form schema
export const plannerFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
  availability: baseSchemas.availability,
});

// Invitation form schema
export const invitationFormSchema = z.object({
  name: baseSchemas.name,
  email: baseSchemas.email,
  phone: baseSchemas.phone,
  address: baseSchemas.address,
  description: baseSchemas.description,
  specialRequirements: baseSchemas.specialRequirements,
  photos: baseSchemas.photos,
});

// Export all schemas
export const formSchemas = {
  venue: venueFormSchema,
  catering: cateringFormSchema,
  music: musicFormSchema,
  photography: photographyFormSchema,
  transportation: transportationFormSchema,
  decoration: decorationFormSchema,
  legal: legalFormSchema,
  planner: plannerFormSchema,
  invitation: invitationFormSchema,
} as const;

// Type exports
export type VenueFormData = z.infer<typeof venueFormSchema>;
export type CateringFormData = z.infer<typeof cateringFormSchema>;
export type MusicFormData = z.infer<typeof musicFormSchema>;
export type PhotographyFormData = z.infer<typeof photographyFormSchema>;
export type TransportationFormData = z.infer<typeof transportationFormSchema>;
export type DecorationFormData = z.infer<typeof decorationFormSchema>;
export type LegalFormData = z.infer<typeof legalFormSchema>;
export type PlannerFormData = z.infer<typeof plannerFormSchema>;
export type InvitationFormData = z.infer<typeof invitationFormSchema>;

export type FormDataType = 
  | VenueFormData 
  | CateringFormData 
  | MusicFormData 
  | PhotographyFormData 
  | TransportationFormData 
  | DecorationFormData 
  | LegalFormData 
  | PlannerFormData 
  | InvitationFormData;
