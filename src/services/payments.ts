import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
 
  query, 
  where, 
  orderBy, 
  serverTimestamp,

} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  PaymentFormData, 
  Invoice,
  PaymentStatus,
  Payment,
  InstallmentPlan,
  Escrow
} from '@/types/payment';
import { PAYMENT_STATUS, PAYMENT_METHOD } from '@/types/payment';
import type { Booking } from '@/types/booking';

// Collection names
export const COLLECTIONS = {
  PAYMENTS: 'payments',
  INSTALLMENT_PLANS: 'installment_plans',
  ESCROW: 'escrow',
  INVOICES: 'invoices',
  BOOKINGS: 'bookings',
} as const;

// Payment service class
export class PaymentService {
  private paymentsRef = collection(db, COLLECTIONS.PAYMENTS);
  private installmentPlansRef = collection(db, COLLECTIONS.INSTALLMENT_PLANS);
  private escrowRef = collection(db, COLLECTIONS.ESCROW);
  private invoicesRef = collection(db, COLLECTIONS.INVOICES);

  // Create a new payment
  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const validatedData = {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.paymentsRef, validatedData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Get payment by ID
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    try {
      const docRef = doc(this.paymentsRef, paymentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Payment;
      }
      return null;
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }

  // Get payments for a booking
  async getPaymentsForBooking(bookingId: string): Promise<Payment[]> {
    try {
      const q = query(
        this.paymentsRef,
        where('bookingId', '==', bookingId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
    } catch (error) {
      console.error('Error getting payments for booking:', error);
      throw error;
    }
  }

  // Get payments for a user
  async getUserPayments(userId: string): Promise<Payment[]> {
    try {
      const q = query(
        this.paymentsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: PaymentStatus, metadata?: any): Promise<void> {
    try {
      const docRef = doc(this.paymentsRef, paymentId);
      const updateData: Partial<Payment> = {
        status,
        updatedAt: new Date(),
      };

      if (status === 'completed') {
        updateData.metadata = { ...updateData.metadata, processedAt: new Date().toISOString() };
      }

      if (metadata) {
        updateData.metadata = { ...updateData.metadata, ...metadata };
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Process payment with Stripe
  async processPayment(paymentData: PaymentFormData, bookingId: string, userId: string, serviceProviderId: string): Promise<Payment> {
    try {
      // Create payment intent with Stripe (this would be implemented with actual Stripe API)
      const stripePaymentIntent = await this.createStripePaymentIntent(paymentData);
      
      // Create payment record
      const payment = {
        bookingId,
        userId,
        serviceProviderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        paymentType: 'advance' as const,
        status: PAYMENT_STATUS.PENDING,
        stripePaymentIntentId: stripePaymentIntent.id,
        description: `Payment for booking ${bookingId}`,
        metadata: {
          stripeClientSecret: stripePaymentIntent.clientSecret,
          billingAddress: JSON.stringify(paymentData.billingDetails.address)
        }
      };

      const paymentId = await this.createPayment(payment);
      const createdPayment = await this.getPaymentById(paymentId);
      
      if (!createdPayment) {
        throw new Error('Failed to create payment record');
      }

      return createdPayment;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Create Stripe payment intent (mock implementation)
  private async createStripePaymentIntent(paymentData: PaymentFormData): Promise<any> {
    // In production, this would call Stripe API
    // For now, return mock data
    return {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      clientSecret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      status: 'requires_payment_method',
      amount: paymentData.amount,
      currency: paymentData.currency,
    };
  }

  // Confirm payment
  async confirmPayment(paymentId: string, stripePaymentMethodId: string): Promise<void> {
    try {
      // In production, this would confirm the payment with Stripe
      // For now, just update the status
      await this.updatePaymentStatus(paymentId, 'completed', {
        stripePaymentMethodId,
        confirmedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Create installment plan
  async createInstallmentPlan(planData: Omit<InstallmentPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const validatedData = {
        ...planData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.installmentPlansRef, validatedData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating installment plan:', error);
      throw error;
    }
  }

  // Get installment plan for a booking
  async getInstallmentPlanForBooking(bookingId: string): Promise<InstallmentPlan | null> {
    try {
      const q = query(
        this.installmentPlansRef,
        where('bookingId', '==', bookingId)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      if (doc) {
        return { 
          id: doc.id, 
          createdAt: new Date(),
          updatedAt: new Date(),
          bookingId: '',
          totalAmount: 0,
          installments: []
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting installment plan:', error);
      throw error;
    }
  }

  // Process installment payment
  async processInstallmentPayment(planId: string, installmentNumber: number, amount: number): Promise<string> {
    try {
      const planRef = doc(this.installmentPlansRef, planId);
      const planSnap = await getDoc(planRef);
      
      if (!planSnap.exists()) {
        throw new Error('Installment plan not found');
      }

      const plan = planSnap.data() as InstallmentPlan;
      
      // Create payment for this installment
      const payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> = {
        bookingId: plan.bookingId,
        userId: '', // This would come from the booking
        serviceProviderId: '', // This would come from the booking
        amount,
        currency: 'USD',
        paymentMethod: PAYMENT_METHOD.STRIPE,
        paymentType: 'installment',
        status: 'pending',
        description: `Installment ${installmentNumber} of ${plan.installments.length} for booking ${plan.bookingId}`,
        metadata: {
          installmentNumber: installmentNumber.toString(),
          totalInstallments: plan.installments.length.toString(),
        }
      };

      return await this.createPayment(payment);
    } catch (error) {
      console.error('Error processing installment payment:', error);
      throw error;
    }
  }

  // Create escrow
  async createEscrow(escrowData: Omit<Escrow, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const validatedData = {
        ...escrowData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.escrowRef, validatedData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  }

  // Fund escrow
  async fundEscrow(escrowId: string): Promise<void> {
    try {
      const docRef = doc(this.escrowRef, escrowId);
      await updateDoc(docRef, {
        status: 'funded',
        fundedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error funding escrow:', error);
      throw error;
    }
  }

  // Release escrow
  async releaseEscrow(escrowId: string): Promise<void> {
    try {
      const docRef = doc(this.escrowRef, escrowId);
      await updateDoc(docRef, {
        status: 'released',
        releasedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  }

  // Create invoice
  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const validatedData = {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(this.invoicesRef, validatedData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Get invoices for a booking
  async getInvoicesForBooking(bookingId: string): Promise<Invoice[]> {
    try {
      const q = query(
        this.invoicesRef,
        where('bookingId', '==', bookingId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];
    } catch (error) {
      console.error('Error getting invoices for booking:', error);
      throw error;
    }
  }

  // Mark invoice as paid
  async markInvoiceAsPaid(invoiceId: string): Promise<void> {
    try {
      const docRef = doc(this.invoicesRef, invoiceId);
      await updateDoc(docRef, {
        status: 'paid',
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(paymentId: string, amount: number, reason: string): Promise<void> {
    try {
      // In production, this would process the refund with Stripe
      // For now, just update the payment record
      const docRef = doc(this.paymentsRef, paymentId);
      await updateDoc(docRef, {
        status: amount === 0 ? 'refunded' : 'partially_refunded',
        refundAmount: amount,
        refundReason: reason,
        refundedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStats(userId?: string, serviceProviderId?: string): Promise<{
    totalPayments: number;
    totalAmount: number;
    completedPayments: number;
    completedAmount: number;
    pendingPayments: number;
    pendingAmount: number;
    failedPayments: number;
    failedAmount: number;
  }> {
    try {
      let q = query(this.paymentsRef);
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      } else if (serviceProviderId) {
        q = query(q, where('serviceProviderId', '==', serviceProviderId));
      }
      
      const querySnapshot = await getDocs(q);
      const stats = {
        totalPayments: 0,
        totalAmount: 0,
        completedPayments: 0,
        completedAmount: 0,
        pendingPayments: 0,
        pendingAmount: 0,
        failedPayments: 0,
        failedAmount: 0,
      };

      querySnapshot.docs.forEach(doc => {
        const payment = doc.data() as Payment;
        stats.totalPayments++;
        stats.totalAmount += payment.amount;
        
        switch (payment.status) {
          case 'completed':
            stats.completedPayments++;
            stats.completedAmount += payment.amount;
            break;
          case 'pending':
            stats.pendingPayments++;
            stats.pendingAmount += payment.amount;
            break;
          case 'failed':
            stats.failedPayments++;
            stats.failedAmount += payment.amount;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting payment stats:', error);
      return {
        totalPayments: 0,
        totalAmount: 0,
        completedPayments: 0,
        completedAmount: 0,
        pendingPayments: 0,
        pendingAmount: 0,
        failedPayments: 0,
        failedAmount: 0,
      };
    }
  }

  // Generate invoice number
  private generateInvoiceNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `INV-${timestamp}-${random}`;
  }

  // Create invoice from booking
  async createInvoiceFromBooking(booking: Booking, items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>): Promise<string> {
    try {
      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      const invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
        bookingId: booking.id!,
        invoiceNumber: this.generateInvoiceNumber(),
        amount: subtotal,
        tax,
        totalAmount: total,
        currency: 'USD',
        status: PAYMENT_STATUS.PENDING,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        items: items.map(item => ({
          ...item,
          total: item.quantity * item.unitPrice,
        })),
        subtotal,
        total,
        notes: `Invoice for ${booking.serviceName}`,
      };

      return await this.createInvoice(invoice);
    } catch (error) {
      console.error('Error creating invoice from booking:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
