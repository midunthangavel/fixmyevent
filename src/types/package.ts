import { z } from 'zod';

// Package type
export const PACKAGE_TYPE = {
  WEDDING: 'wedding',
  CORPORATE: 'corporate',
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  CONFERENCE: 'conference',
  CUSTOM: 'custom',
} as const;

export type PackageType = typeof PACKAGE_TYPE[keyof typeof PACKAGE_TYPE];

// Package status
export const PACKAGE_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type PackageStatus = typeof PACKAGE_STATUS[keyof typeof PACKAGE_STATUS];

// Package item schema
export const packageItemSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  serviceCategory: z.string(),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  isRequired: z.boolean().default(true),
  isCustomizable: z.boolean().default(false),
  customizationOptions: z.array(z.object({
    name: z.string(),
    options: z.array(z.string()),
    defaultValue: z.string().optional(),
    additionalCost: z.number().min(0).default(0),
  })).optional(),
  notes: z.string().optional(),
});

export type PackageItem = z.infer<typeof packageItemSchema>;

// Package schema
export const packageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.nativeEnum(PACKAGE_TYPE),
  status: z.nativeEnum(PACKAGE_STATUS).default('draft'),
  vendorId: z.string(),
  items: z.array(packageItemSchema),
  pricing: z.object({
    originalPrice: z.number().positive(),
    discountedPrice: z.number().positive(),
    discountPercentage: z.number().min(0).max(100),
    currency: z.string().default('USD'),
    paymentTerms: z.enum(['full', 'deposit', 'installments']).default('full'),
    depositAmount: z.number().min(0).default(0),
    installmentCount: z.number().int().positive().default(1),
    installmentAmount: z.number().positive().default(0),
  }),
  availability: z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    maxBookings: z.number().int().positive().optional(),
    currentBookings: z.number().int().min(0).default(0),
    isLimited: z.boolean().default(false),
    validDays: z.array(z.number().int().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]),
    validHours: z.object({
      start: z.string().default('09:00'),
      end: z.string().default('17:00'),
    }).default({}),
  }),
  requirements: z.object({
    minGuestCount: z.number().int().positive().optional(),
    maxGuestCount: z.number().int().positive().optional(),
    advanceBookingDays: z.number().int().positive().default(7),
    cancellationPolicy: z.string().optional(),
    termsAndConditions: z.string().optional(),
  }),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Package = z.infer<typeof packageSchema>;

// Package booking schema
export const packageBookingSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  packageName: z.string(),
  userId: z.string(),
  vendorId: z.string(),
  eventDate: z.date(),
  guestCount: z.number().int().positive(),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).default('pending'),
  items: z.array(z.object({
    serviceId: z.string(),
    serviceName: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive(),
    customizations: z.record(z.string()).optional(),
  })),
  pricing: z.object({
    subtotal: z.number().positive(),
    discount: z.number().min(0),
    tax: z.number().min(0),
    total: z.number().positive(),
    depositPaid: z.number().min(0).default(0),
    remainingAmount: z.number().min(0),
  }),
  paymentStatus: z.enum(['pending', 'partial', 'completed', 'refunded']).default('pending'),
  notes: z.string().optional(),
  specialRequests: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PackageBooking = z.infer<typeof packageBookingSchema>;

// Package template schema
export const packageTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.nativeEnum(PACKAGE_TYPE),
  category: z.string(),
  isPublic: z.boolean().default(false),
  vendorId: z.string().optional(),
  items: z.array(z.object({
    serviceCategory: z.string(),
    serviceName: z.string(),
    description: z.string(),
    estimatedPrice: z.number().positive(),
    isRequired: z.boolean().default(true),
    customizationOptions: z.array(z.string()).optional(),
  })),
  estimatedTotal: z.number().positive(),
  estimatedDuration: z.number().int().positive(), // minutes
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PackageTemplate = z.infer<typeof packageTemplateSchema>;

// Package comparison schema
export const packageComparisonSchema = z.object({
  id: z.string(),
  userId: z.string(),
  packages: z.array(z.object({
    packageId: z.string(),
    packageName: z.string(),
    vendorName: z.string(),
    totalPrice: z.number().positive(),
    itemCount: z.number().int().positive(),
    rating: z.number().min(0).max(5),
    reviewCount: z.number().int().min(0),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    notes: z.string().optional(),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PackageComparison = z.infer<typeof packageComparisonSchema>;

// Package recommendation schema
export const packageRecommendationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  eventType: z.string(),
  eventDate: z.date(),
  guestCount: z.number().int().positive(),
  budget: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    currency: z.string().default('USD'),
  }),
  preferences: z.object({
    location: z.string().optional(),
    style: z.string().optional(),
    theme: z.string().optional(),
    mustHaveServices: z.array(z.string()).default([]),
    optionalServices: z.array(z.string()).default([]),
  }),
  recommendedPackages: z.array(z.object({
    packageId: z.string(),
    packageName: z.string(),
    vendorName: z.string(),
    matchScore: z.number().min(0).max(100),
    totalPrice: z.number().positive(),
    reasoning: z.string(),
  })),
  createdAt: z.date(),
});

export type PackageRecommendation = z.infer<typeof packageRecommendationSchema>;
