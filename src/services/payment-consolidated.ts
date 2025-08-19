import { AppError, ERROR_CODES, ErrorHandler, ErrorLogger } from '@/lib/errors';
import { ValidationUtils, paymentSchemas } from '@/lib/validation';
import { paymentsService } from './database';
import type { BaseEntity } from '@/types/common';

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

// Payment method types
export type PaymentMethod = 'card' | 'paypal' | 'stripe' | 'bank_transfer' | 'crypto';

// Payment types
export type PaymentType = 'booking' | 'subscription' | 'one_time' | 'refund';

// Payment interface
export interface Payment extends BaseEntity {
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  type: PaymentType;
  description?: string;
  metadata?: Record<string, any>;
  
  // Payment method details
  paymentMethodId?: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  
  // Transaction details
  transactionId?: string;
  gatewayResponse?: any;
  failureReason?: string;
  
  // Related entities
  bookingId?: string;
  venueId?: string;
  
  // Timestamps
  processedAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
}

// Payment creation data
export interface CreatePaymentData {
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  type: PaymentType;
  description?: string;
  metadata?: Record<string, any>;
  paymentMethodId?: string;
  bookingId?: string;
  venueId?: string;
}

// Payment update data
export interface UpdatePaymentData {
  status?: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: any;
  failureReason?: string;
  processedAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
}

// Payment method interface
export interface PaymentMethodData {
  id: string;
  userId: string;
  type: PaymentMethod;
  isDefault: boolean;
  
  // Card details
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  
  // Billing address
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Metadata
  metadata?: Record<string, any>;
}

// Payment result interface
export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  error?: string;
  requiresAction?: boolean;
  actionUrl?: string;
}

// Payment service class
export class PaymentService {
  // Create a new payment
  async createPayment(data: CreatePaymentData): Promise<string> {
    try {
      // Validate payment data
      const validatedData = ValidationUtils.validate(paymentSchemas.payment, {
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        metadata: data.metadata,
      });

      const paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: data.userId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'pending',
        method: data.method,
        type: data.type,
        description: validatedData.description,
        metadata: validatedData.metadata,
        paymentMethodId: data.paymentMethodId,
        bookingId: data.bookingId,
        venueId: data.venueId,
      };

      const paymentId = await paymentsService.create(paymentData);
      
      ErrorLogger.log(new AppError('Payment created', ERROR_CODES.UNKNOWN_ERROR, 200), {
        operation: 'createPayment',
        paymentId,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
      });

      return paymentId;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'createPayment',
        data: { ...data, amount: data.amount, currency: data.currency }
      });
      throw appError;
    }
  }

  // Process payment
  async processPayment(paymentId: string, paymentMethodData: any): Promise<PaymentResult> {
    try {
      const payment = await paymentsService.getById(paymentId);
      if (!payment) {
        throw new AppError('Payment not found', ERROR_CODES.DB_DOCUMENT_NOT_FOUND, 404);
      }

      if (payment.status !== 'pending') {
        throw new AppError('Payment is not in pending status', ERROR_CODES.VALIDATION_INVALID_VALUE, 400);
      }

      // Validate payment method data
      const validatedMethodData = ValidationUtils.validate(paymentSchemas.card, paymentMethodData);

      // Update payment with method details
      await paymentsService.update(paymentId, {
        paymentMethodId: validatedMethodData.number.slice(-4), // Last 4 digits
        last4: validatedMethodData.number.slice(-4),
        brand: this.detectCardBrand(validatedMethodData.number),
        expiryMonth: validatedMethodData.expiryMonth,
        expiryYear: validatedMethodData.expiryYear,
        status: 'processing',
      });

      // Simulate payment processing (replace with actual payment gateway integration)
      const result = await this.processWithGateway(payment, validatedMethodData);
      
      if (result.success) {
        await paymentsService.update(paymentId, {
          status: 'completed',
          transactionId: result.transactionId,
          processedAt: new Date(),
        });
      } else {
        await paymentsService.update(paymentId, {
          status: 'failed',
          failureReason: result.error,
          failedAt: new Date(),
        });
      }

      return result;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'processPayment',
        paymentId,
        paymentMethodData: { ...paymentMethodData, number: '***' }
      });
      throw appError;
    }
  }

  // Get payment by ID
  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      return await paymentsService.getById(paymentId);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getPayment',
        paymentId 
      });
      throw appError;
    }
  }

  // Get payments by user
  async getUserPayments(userId: string, limit = 20): Promise<Payment[]> {
    try {
      const result = await paymentsService.getMany(
        [],
        { limit }
      );
      
      // Filter by user ID (in a real app, this would be a database query)
      return (result.data || []).filter(payment => payment.userId === userId);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getUserPayments',
        userId,
        limit 
      });
      throw appError;
    }
  }

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: PaymentStatus, details?: any): Promise<void> {
    try {
      const updateData: UpdatePaymentData = { status };
      
      if (status === 'completed') {
        updateData.processedAt = new Date();
        updateData.transactionId = details?.transactionId;
        updateData.gatewayResponse = details?.gatewayResponse;
      } else if (status === 'failed') {
        updateData.failedAt = new Date();
        updateData.failureReason = details?.failureReason;
        updateData.gatewayResponse = details?.gatewayResponse;
      } else if (status === 'refunded') {
        updateData.refundedAt = new Date();
        updateData.gatewayResponse = details?.gatewayResponse;
      }

      await paymentsService.update(paymentId, updateData);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'updatePaymentStatus',
        paymentId,
        status,
        details 
      });
      throw appError;
    }
  }

  // Refund payment
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<PaymentResult> {
    try {
      const payment = await paymentsService.getById(paymentId);
      if (!payment) {
        throw new AppError('Payment not found', ERROR_CODES.DB_DOCUMENT_NOT_FOUND, 404);
      }

      if (payment.status !== 'completed') {
        throw new AppError('Payment must be completed to refund', ERROR_CODES.VALIDATION_INVALID_VALUE, 400);
      }

      const refundAmount = amount || payment.amount;

      // Process refund with payment gateway
      const refundResult = await this.processRefundWithGateway(payment, refundAmount, reason);
      
      if (refundResult.success) {
        await this.updatePaymentStatus(paymentId, 'refunded', {
          gatewayResponse: refundResult,
          refundAmount,
          reason,
        });
      }

      return refundResult;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'refundPayment',
        paymentId,
        amount,
        reason 
      });
      throw appError;
    }
  }

  // Cancel payment
  async cancelPayment(paymentId: string): Promise<void> {
    try {
      const payment = await paymentsService.getById(paymentId);
      if (!payment) {
        throw new AppError('Payment not found', ERROR_CODES.DB_DOCUMENT_NOT_FOUND, 404);
      }

      if (payment.status !== 'pending') {
        throw new AppError('Payment cannot be cancelled', ERROR_CODES.VALIDATION_INVALID_VALUE, 400);
      }

      await this.updatePaymentStatus(paymentId, 'cancelled');
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'cancelPayment',
        paymentId 
      });
      throw appError;
    }
  }

  // Get payment statistics
  async getPaymentStats(userId?: string): Promise<{
    total: number;
    completed: number;
    failed: number;
    pending: number;
    totalAmount: number;
    averageAmount: number;
  }> {
    try {
      const payments = await paymentsService.getMany();
      const allPayments = payments.data || [];
      
      let filteredPayments = allPayments;
      if (userId) {
        filteredPayments = allPayments.filter(p => p.userId === userId);
      }

      const stats = {
        total: filteredPayments.length,
        completed: filteredPayments.filter(p => p.status === 'completed').length,
        failed: filteredPayments.filter(p => p.status === 'failed').length,
        pending: filteredPayments.filter(p => p.status === 'pending').length,
        totalAmount: filteredPayments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        averageAmount: 0,
      };

      if (stats.completed > 0) {
        stats.averageAmount = stats.totalAmount / stats.completed;
      }

      return stats;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getPaymentStats',
        userId 
      });
      throw appError;
    }
  }

  // Private methods for payment gateway integration
  private async processWithGateway(payment: Payment, methodData: any): Promise<PaymentResult> {
    // Simulate payment gateway processing
    // Replace this with actual payment gateway integration (Stripe, PayPal, etc.)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const isSuccess = Math.random() > 0.05;
        
        if (isSuccess) {
          resolve({
            success: true,
            paymentId: payment.id,
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          });
        } else {
          resolve({
            success: false,
            error: 'Payment was declined by the bank',
          });
        }
      }, 2000); // Simulate 2-second processing time
    });
  }

  private async processRefundWithGateway(payment: Payment, amount: number, reason?: string): Promise<PaymentResult> {
    // Simulate refund processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });
      }, 1000);
    });
  }

  private detectCardBrand(cardNumber: string): string {
    // Simple card brand detection
    const number = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6/.test(number)) return 'discover';
    
    return 'unknown';
  }

  // Utility methods
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amount is in cents
  }

  validateCardNumber(cardNumber: string): boolean {
    // Luhn algorithm for card validation
    const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
