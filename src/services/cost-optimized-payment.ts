// Cost-Optimized Payment Service
// This service uses cheaper payment gateways and local payment methods to reduce costs

import { Timestamp } from 'firebase/firestore';
import { AppError, ERROR_CODES, ErrorHandler, ErrorLogger } from '@/lib/errors';
import { ValidationUtils, paymentSchemas } from '@/lib/validation';
import type { BaseEntity } from '@/types/common';

// Payment status types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

// Payment method types with cost-optimized options
export type PaymentMethod = 'card' | 'paypal' | 'stripe' | 'square' | 'bank_transfer' | 'crypto' | 'local_cash' | 'local_check';

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
  description: string;
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
  processedAt?: Timestamp;
  failedAt?: Timestamp;
  refundedAt?: Timestamp;
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
  processedAt?: Timestamp;
  failedAt?: Timestamp;
  refundedAt?: Timestamp;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
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
  costSavings?: number; // Amount saved by using cost-optimized method
}

// Cost-optimized payment service class
export class CostOptimizedPaymentService {
  private paymentMethods: Map<string, PaymentMethodData> = new Map();
  private payments: Map<string, Payment> = new Map();
  private costSavings: number = 0;

  constructor() {
    this.initializePaymentMethods();
  }

  /**
   * Initialize available payment methods
   */
  private initializePaymentMethods(): void {
    // Add local payment methods that have no transaction fees
    this.paymentMethods.set('local_cash', {
      id: 'local_cash',
      userId: 'system',
      type: 'local_cash',
      isDefault: false,
      metadata: {
        description: 'Local cash payment - no fees',
        costSavings: 0.029, // 2.9% savings vs credit card
        requiresInPerson: true
      }
    });

    this.paymentMethods.set('local_check', {
      id: 'local_check',
      userId: 'system',
      type: 'local_check',
      isDefault: false,
      metadata: {
        description: 'Local check payment - minimal fees',
        costSavings: 0.025, // 2.5% savings vs credit card
        requiresInPerson: false
      }
    });

    this.paymentMethods.set('bank_transfer', {
      id: 'bank_transfer',
      userId: 'system',
      type: 'bank_transfer',
      isDefault: false,
      metadata: {
        description: 'Bank transfer - very low fees',
        costSavings: 0.02, // 2% savings vs credit card
        requiresInPerson: false
      }
    });
  }

  /**
   * Create a new payment with cost optimization
   */
  async createPayment(data: CreatePaymentData): Promise<string> {
    try {
      // Validate payment data
      const validatedData = ValidationUtils.validate(paymentSchemas.payment, {
        amount: data.amount,
        currency: data.currency,
        description: data.description || '',
        metadata: data.metadata,
      });

      // Calculate cost savings for this payment method
      const costSavings = this.calculateCostSavings(data.method, data.amount);

      const paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: data.userId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'pending',
        method: data.method,
        type: data.type,
        description: data.description || 'Payment for services',
        metadata: {
          ...validatedData.metadata,
          costSavings,
          recommendedMethod: this.getRecommendedPaymentMethod(data.amount)
        },
        paymentMethodId: data.paymentMethodId,
        bookingId: data.bookingId,
        venueId: data.venueId,
      };

      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.payments.set(paymentId, {
        ...paymentData,
        id: paymentId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Update total cost savings
      this.costSavings += costSavings;

      ErrorLogger.log(new AppError('Payment created', ERROR_CODES.UNKNOWN_ERROR, 200), {
        operation: 'createPayment',
        paymentId,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        costSavings
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

  /**
   * Process payment with cost optimization
   */
  async processPayment(paymentId: string, paymentMethodData: any): Promise<PaymentResult> {
    try {
      const payment = this.payments.get(paymentId);
      if (!payment) {
        throw new AppError('Payment not found', ERROR_CODES.DB_DOCUMENT_NOT_FOUND, 404);
      }

      if (payment.status !== 'pending') {
        throw new AppError('Payment is not in pending status', ERROR_CODES.VALIDATION_INVALID_VALUE, 400);
      }

      // Validate payment method data
      const validatedMethodData = ValidationUtils.validate(paymentSchemas.card, paymentMethodData);

      // Update payment with method details
      await this.updatePayment(paymentId, {
        last4: validatedMethodData.number.slice(-4), // Last 4 digits
        brand: this.detectCardBrand(validatedMethodData.number),
        expiryMonth: validatedMethodData.expiryMonth,
        expiryYear: validatedMethodData.expiryYear,
        status: 'processing',
      });

      // Process payment with cost-optimized gateway
      const result = await this.processWithCostOptimizedGateway(payment, validatedMethodData);
      
      if (result.success) {
        await this.updatePayment(paymentId, {
          status: 'completed',
          transactionId: result.transactionId || '',
          processedAt: Timestamp.now(),
        });
      } else {
        await this.updatePayment(paymentId, {
          status: 'failed',
          failureReason: result.error || '',
          failedAt: Timestamp.now(),
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

  /**
   * Process payment with cost-optimized gateway
   */
  private async processWithCostOptimizedGateway(payment: Payment, _methodData: any): Promise<PaymentResult> {
    // Choose the most cost-effective payment gateway based on amount and method
    const gateway = this.selectOptimalPaymentGateway(payment.amount, payment.method);
    
    try {
      switch (gateway) {
        case 'square':
          return await this.processWithSquare(payment);
        case 'stripe':
          return await this.processWithStripe(payment);
        case 'local':
          return await this.processLocalPayment(payment);
        case 'bank_transfer':
          return await this.processBankTransfer(payment);
        default:
          return await this.processWithStripe(payment); // Fallback
      }
    } catch (error) {
      // If primary gateway fails, try fallback
      try {
        return await this.processWithStripe(payment);
      } catch (fallbackError) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
          success: false,
          error: `Payment processing failed: ${errorMessage}`,
          costSavings: 0
        };
      }
    }
  }

  /**
   * Select optimal payment gateway based on cost
   */
  private selectOptimalPaymentGateway(amount: number, method: PaymentMethod): string {
    if (method === 'local_cash' || method === 'local_check') {
      return 'local';
    }

    if (method === 'bank_transfer') {
      return 'bank_transfer';
    }

    // For card payments, choose based on amount
    if (amount < 1000) { // Under $10
      return 'square'; // Square has lower fees for small amounts
    } else if (amount < 10000) { // Under $100
      return 'stripe'; // Stripe is competitive for medium amounts
    } else {
      return 'stripe'; // Stripe for large amounts
    }
  }

  /**
   * Process payment with Square (lower fees for small amounts)
   */
  private async processWithSquare(payment: Payment): Promise<PaymentResult> {
    // Square has 2.6% + 10¢ per transaction (better than Stripe for small amounts)
    const fees = payment.amount * 0.026 + 10;
    const costSavings = (payment.amount * 0.029 + 30) - fees; // Compared to Stripe

    // Simulate Square payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.05; // 95% success rate
        
        if (isSuccess) {
          resolve({
            success: true,
            paymentId: payment.id,
            transactionId: `sq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            costSavings: Math.round(costSavings)
          });
        } else {
          resolve({
            success: false,
            error: 'Payment was declined by Square',
            costSavings: 0
          });
        }
      }, 1500); // Square is typically faster than Stripe
    });
  }

  /**
   * Process payment with Stripe
   */
  private async processWithStripe(payment: Payment): Promise<PaymentResult> {
    // Stripe has 2.9% + 30¢ per transaction
    const costSavings = 0; // Base comparison

    // Simulate Stripe payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.05; // 95% success rate
        
        if (isSuccess) {
          resolve({
            success: true,
            paymentId: payment.id,
            transactionId: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            costSavings
          });
        } else {
          resolve({
            success: false,
            error: 'Payment was declined by Stripe',
            costSavings: 0
          });
        }
      }, 2000);
    });
  }

  /**
   * Process local payment (cash/check)
   */
  private async processLocalPayment(payment: Payment): Promise<PaymentResult> {
    // Local payments have no transaction fees
    const costSavings = payment.amount * 0.029 + 30; // Full Stripe fee savings

    // Simulate local payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: payment.id,
          transactionId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          costSavings: Math.round(costSavings),
          requiresAction: true,
          actionUrl: '/payment/local-instructions'
        });
      }, 500); // Instant for local payments
    });
  }

  /**
   * Process bank transfer
   */
  private async processBankTransfer(payment: Payment): Promise<PaymentResult> {
    // Bank transfers have very low fees (~$1-5)
    const fees = 3; // Average bank transfer fee
    const costSavings = (payment.amount * 0.029 + 30) - fees;

    // Simulate bank transfer processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: payment.id,
          transactionId: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          costSavings: Math.round(costSavings),
          requiresAction: true,
          actionUrl: '/payment/bank-transfer-instructions'
        });
      }, 1000);
    });
  }

  /**
   * Calculate cost savings for a payment method
   */
  private calculateCostSavings(method: PaymentMethod, amount: number): number {
    const stripeFee = amount * 0.029 + 30; // Stripe standard fee
    
    switch (method) {
      case 'local_cash':
      case 'local_check':
        return Math.round(stripeFee); // 100% savings
      case 'bank_transfer':
        return Math.round(stripeFee - 3); // Bank transfer fee is ~$3
      case 'square':
        const squareFee = amount * 0.026 + 10;
        return Math.round(stripeFee - squareFee);
      case 'paypal':
        return 0; // Same as Stripe
      default:
        return 0; // No savings for other methods
    }
  }

  /**
   * Get recommended payment method for amount
   */
  private getRecommendedPaymentMethod(amount: number): PaymentMethod {
    if (amount < 500) {
      return 'local_cash'; // Best for small amounts
    } else if (amount < 2000) {
      return 'square'; // Best for medium amounts
    } else if (amount < 10000) {
      return 'bank_transfer'; // Best for large amounts
    } else {
      return 'stripe'; // Best for very large amounts
    }
  }

  /**
   * Get payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment | null> {
    try {
      return this.payments.get(paymentId) || null;
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'getPayment',
        paymentId 
      });
      throw appError;
    }
  }

  /**
   * Get payments by user
   */
  async getUserPayments(userId: string, limit = 20): Promise<Payment[]> {
    try {
      const userPayments = Array.from(this.payments.values())
        .filter(payment => payment.userId === userId)
        .sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.toMillis();
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.toMillis();
          return bTime - aTime;
        })
        .slice(0, limit);
      
      return userPayments;
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

  /**
   * Update payment
   */
  async updatePayment(paymentId: string, updateData: UpdatePaymentData): Promise<void> {
    try {
      const payment = this.payments.get(paymentId);
      if (!payment) {
        throw new AppError('Payment not found', ERROR_CODES.DB_DOCUMENT_NOT_FOUND, 404);
      }

      const updatedPayment: Payment = {
        ...payment,
        ...updateData,
        updatedAt: Timestamp.now()
      };

      this.payments.set(paymentId, updatedPayment);
    } catch (error) {
      const appError = ErrorHandler.handle(error);
      ErrorLogger.log(appError, { 
        operation: 'updatePayment',
        paymentId,
        updateData 
      });
      throw appError;
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(paymentId: string, status: PaymentStatus, details?: any): Promise<void> {
    try {
      const updateData: UpdatePaymentData = { status };
      
      if (status === 'completed') {
        updateData.processedAt = Timestamp.now();
        updateData.transactionId = details?.transactionId;
        updateData.gatewayResponse = details?.gatewayResponse;
      } else if (status === 'failed') {
        updateData.failedAt = Timestamp.now();
        updateData.failureReason = details?.failureReason;
        updateData.gatewayResponse = details?.gatewayResponse;
      } else if (status === 'refunded') {
        updateData.refundedAt = Timestamp.now();
        updateData.gatewayResponse = details?.gatewayResponse;
      }

      await this.updatePayment(paymentId, updateData);
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

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<PaymentResult> {
    try {
      const payment = await this.getPayment(paymentId);
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

  /**
   * Process refund with gateway
   */
  private async processRefundWithGateway(payment: Payment, amount: number, reason?: string): Promise<PaymentResult> {
    try {
      // Log refund attempt
      console.log(`Processing refund for payment ${payment.id}, amount: ${amount}, reason: ${reason || 'No reason provided'}`);
      
      // Simulate refund processing with actual parameters
      const refundAmount = amount || payment.amount;
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            costSavings: this.calculateRefundSavings(refundAmount, payment.method)
          });
        }, 1000);
      });
    } catch (error) {
      console.error('Refund processing failed:', error);
      return {
        success: false,
        error: 'Refund processing failed',
        costSavings: 0
      };
    }
  }

  /**
   * Calculate refund savings based on payment method
   */
  private calculateRefundSavings(amount: number, paymentMethod: PaymentMethod): number {
    const savingsRates: Record<string, number> = {
      'local_cash': 0.05,
      'bank_transfer': 0.03,
      'square': 0.02,
      'stripe': 0.025,
      'paypal': 0.029
    };
    
    const rate = savingsRates[paymentMethod] || 0.02;
    return amount * rate;
  }

  /**
   * Cancel payment
   */
  async cancelPayment(paymentId: string): Promise<void> {
    try {
      const payment = await this.getPayment(paymentId);
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

  /**
   * Get payment statistics
   */
  async getPaymentStats(userId?: string): Promise<{
    total: number;
    completed: number;
    failed: number;
    pending: number;
    totalAmount: number;
    averageAmount: number;
    totalCostSavings: number;
    averageCostSavings: number;
  }> {
    try {
      let allPayments = Array.from(this.payments.values());
      
      if (userId) {
        allPayments = allPayments.filter(p => p.userId === userId);
      }

      const stats = {
        total: allPayments.length,
        completed: allPayments.filter(p => p.status === 'completed').length,
        failed: allPayments.filter(p => p.status === 'failed').length,
        pending: allPayments.filter(p => p.status === 'pending').length,
        totalAmount: allPayments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0),
        averageAmount: 0,
        totalCostSavings: this.costSavings,
        averageCostSavings: 0,
      };

      if (stats.completed > 0) {
        stats.averageAmount = stats.totalAmount / stats.completed;
        stats.averageCostSavings = stats.totalCostSavings / stats.completed;
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

  /**
   * Get available payment methods
   */
  getAvailablePaymentMethods(): PaymentMethodData[] {
    return Array.from(this.paymentMethods.values());
  }

  /**
   * Get cost savings summary
   */
  getCostSavingsSummary(): {
    totalSavings: number;
    savingsByMethod: Record<string, number>;
    recommendations: string[];
  } {
    const savingsByMethod: Record<string, number> = {};
    const recommendations: string[] = [];

    // Calculate savings by method
    for (const payment of this.payments.values()) {
      if (payment.status === 'completed') {
        const savings = payment.metadata?.costSavings || 0;
        const method = payment.method;
        savingsByMethod[method] = (savingsByMethod[method] || 0) + savings;
      }
    }

    // Generate recommendations
    if (savingsByMethod['local_cash'] && savingsByMethod['local_cash'] > 0) {
      recommendations.push('Consider more local cash payments for small amounts');
    }
    if (savingsByMethod['bank_transfer'] && savingsByMethod['bank_transfer'] > 0) {
      recommendations.push('Bank transfers are great for large amounts');
    }
    if (savingsByMethod['square'] && savingsByMethod['square'] > 0) {
      recommendations.push('Square is cost-effective for medium amounts');
    }

    return {
      totalSavings: this.costSavings,
      savingsByMethod,
      recommendations
    };
  }

  // Utility methods
  private detectCardBrand(cardNumber: string): string {
    const number = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6/.test(number)) return 'discover';
    
    return 'unknown';
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amount is in cents
  }

  validateCardNumber(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      const digit = digits[i];
      if (digit === undefined) continue;

      if (isEven) {
        const doubled = digit * 2;
        if (doubled > 9) {
          sum += doubled - 9;
        } else {
          sum += doubled;
        }
      } else {
        sum += digit;
      }
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
}

// Export singleton instance
export const costOptimizedPaymentService = new CostOptimizedPaymentService();
