import { z } from 'zod';

// Payment method types
export const PAYMENT_METHOD = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
} as const;

export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Payment intent schema
export const paymentIntentSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  paymentMethod: z.nativeEnum(PAYMENT_METHOD),
  status: z.nativeEnum(PAYMENT_STATUS),
  clientSecret: z.string().optional(),
  paymentIntentId: z.string().optional(),
  paypalOrderId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  metadata: z.record(z.string()).optional(),
});

export type PaymentIntent = z.infer<typeof paymentIntentSchema>;

// Stripe payment details
export const stripePaymentSchema = z.object({
  paymentIntentId: z.string(),
  clientSecret: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  status: z.nativeEnum(PAYMENT_STATUS),
  paymentMethodId: z.string().optional(),
  customerId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export type StripePayment = z.infer<typeof stripePaymentSchema>;

// PayPal payment details
export const paypalPaymentSchema = z.object({
  orderId: z.string(),
  captureId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  status: z.nativeEnum(PAYMENT_STATUS),
  payerId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export type PaypalPayment = z.infer<typeof paypalPaymentSchema>;

// Payment form data
export const paymentFormSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  paymentMethod: z.nativeEnum(PAYMENT_METHOD),
  billingDetails: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    address: z.object({
      line1: z.string().min(1, 'Address is required'),
      line2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
      country: z.string().min(1, 'Country is required'),
    }),
  }),
  savePaymentMethod: z.boolean().default(false),
});

export type PaymentFormData = z.infer<typeof paymentFormSchema>;

// Payment method storage
export const savedPaymentMethodSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(PAYMENT_METHOD),
  last4: z.string().optional(),
  brand: z.string().optional(),
  expiryMonth: z.number().optional(),
  expiryYear: z.number().optional(),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
});

export type SavedPaymentMethod = z.infer<typeof savedPaymentMethodSchema>;

// Invoice schema
export const invoiceSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  status: z.nativeEnum(PAYMENT_STATUS),
  dueDate: z.date(),
  paidAt: z.date().optional(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    total: z.number().positive(),
  })),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  total: z.number().positive(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Invoice = z.infer<typeof invoiceSchema>;
