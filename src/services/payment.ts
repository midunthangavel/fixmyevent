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
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  PaymentIntent, 
  StripePayment, 
  PaypalPayment, 
  PaymentFormData,
  SavedPaymentMethod,
  Invoice 
} from '@/types/payment';

// Collection names
export const COLLECTIONS = {
  PAYMENTS: 'payments',
  PAYMENT_INTENTS: 'payment_intents',
  SAVED_PAYMENT_METHODS: 'saved_payment_methods',
  INVOICES: 'invoices',
} as const;

// Payment service class
export class PaymentService {
  private paymentsRef = collection(db, COLLECTIONS.PAYMENTS);
  private paymentIntentsRef = collection(db, COLLECTIONS.PAYMENT_INTENTS);
  private savedMethodsRef = collection(db, COLLECTIONS.SAVED_PAYMENT_METHODS);
  private invoicesRef = collection(db, COLLECTIONS.INVOICES);

  // Create a payment intent
  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>): Promise<PaymentIntent> {
    try {
      const paymentIntent = {
        id: crypto.randomUUID(),
        amount,
        currency,
        paymentMethod: 'stripe', // Default to Stripe
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata,
      };

      await addDoc(this.paymentIntentsRef, {
        ...paymentIntent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Process Stripe payment
  async processStripePayment(
    paymentIntentId: string, 
    amount: number, 
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<StripePayment> {
    try {
      const stripePayment: StripePayment = {
        paymentIntentId,
        clientSecret: `pi_${crypto.randomUUID()}_secret_${crypto.randomUUID()}`, // Mock for demo
        amount,
        currency,
        status: 'processing',
        metadata,
      };

      // In a real implementation, you would:
      // 1. Call Stripe API to create payment intent
      // 2. Handle the response
      // 3. Update the payment status

      // For demo purposes, simulate successful payment
      setTimeout(() => {
        this.updatePaymentStatus(paymentIntentId, 'completed');
      }, 2000);

      await addDoc(this.paymentsRef, {
        ...stripePayment,
        type: 'stripe',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return stripePayment;
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      throw error;
    }
  }

  // Process PayPal payment
  async processPaypalPayment(
    orderId: string, 
    amount: number, 
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<PaypalPayment> {
    try {
      const paypalPayment: PaypalPayment = {
        orderId,
        amount,
        currency,
        status: 'processing',
        metadata,
      };

      // In a real implementation, you would:
      // 1. Call PayPal API to capture payment
      // 2. Handle the response
      // 3. Update the payment status

      // For demo purposes, simulate successful payment
      setTimeout(() => {
        this.updatePaymentStatus(orderId, 'completed');
      }, 2000);

      await addDoc(this.paymentsRef, {
        ...paypalPayment,
        type: 'paypal',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return paypalPayment;
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
    try {
      const q = query(this.paymentsRef, where('paymentIntentId', '==', paymentId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = doc(this.paymentsRef, querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          status,
          updatedAt: serverTimestamp(),
        });
      }

      // Also update payment intents
      const intentQuery = query(this.paymentIntentsRef, where('id', '==', paymentId));
      const intentSnapshot = await getDocs(intentQuery);
      
      if (!intentSnapshot.empty) {
        const intentRef = doc(this.paymentIntentsRef, intentSnapshot.docs[0].id);
        await updateDoc(intentRef, {
          status,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Save payment method
  async savePaymentMethod(
    userId: string, 
    paymentMethod: string, 
    last4?: string, 
    brand?: string,
    expiryMonth?: number,
    expiryYear?: number
  ): Promise<SavedPaymentMethod> {
    try {
      const savedMethod: SavedPaymentMethod = {
        id: crypto.randomUUID(),
        type: paymentMethod as any,
        last4,
        brand,
        expiryMonth,
        expiryYear,
        isDefault: false,
        createdAt: new Date(),
      };

      await addDoc(this.savedMethodsRef, {
        ...savedMethod,
        userId,
        createdAt: serverTimestamp(),
      });

      return savedMethod;
    } catch (error) {
      console.error('Error saving payment method:', error);
      throw error;
    }
  }

  // Get saved payment methods for a user
  async getSavedPaymentMethods(userId: string): Promise<SavedPaymentMethod[]> {
    try {
      const q = query(
        this.savedMethodsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as SavedPaymentMethod[];
    } catch (error) {
      console.error('Error getting saved payment methods:', error);
      return [];
    }
  }

  // Delete saved payment method
  async deleteSavedPaymentMethod(methodId: string): Promise<void> {
    try {
      const q = query(this.savedMethodsRef, where('id', '==', methodId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = doc(this.savedMethodsRef, querySnapshot.docs[0].id);
        await updateDoc(docRef, { isActive: false });
      }
    } catch (error) {
      console.error('Error deleting saved payment method:', error);
      throw error;
    }
  }

  // Create invoice
  async createInvoice(
    bookingId: string,
    amount: number,
    currency: string = 'usd',
    items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>,
    dueDate: Date
  ): Promise<Invoice> {
    try {
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1; // 10% tax for demo
      const total = subtotal + tax;

      const invoice: Invoice = {
        id: crypto.randomUUID(),
        bookingId,
        amount: total,
        currency,
        status: 'pending',
        dueDate,
        items,
        subtotal,
        tax,
        total,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(this.invoicesRef, {
        ...invoice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  // Get invoices for a user
  async getUserInvoices(userId: string): Promise<Invoice[]> {
    try {
      // This would need to be implemented based on your data structure
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error getting user invoices:', error);
      return [];
    }
  }

  // Get payment history for a user
  async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const q = query(
        this.paymentsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  }

  // Refund payment
  async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<void> {
    try {
      // In a real implementation, you would:
      // 1. Call the payment provider's refund API
      // 2. Update the payment status
      // 3. Create a refund record

      await this.updatePaymentStatus(paymentId, 'refunded');
      
      // Add refund record
      await addDoc(this.paymentsRef, {
        type: 'refund',
        originalPaymentId: paymentId,
        amount: amount || 0,
        reason,
        status: 'completed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStats(userId?: string): Promise<{
    totalPayments: number;
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
  }> {
    try {
      let q = query(this.paymentsRef);
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      }
      
      const querySnapshot = await getDocs(q);
      const stats = {
        totalPayments: 0,
        totalAmount: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
      };

      querySnapshot.docs.forEach(doc => {
        const payment = doc.data();
        stats.totalPayments++;
        
        if (payment.status === 'completed') {
          stats.successfulPayments++;
          stats.totalAmount += payment.amount || 0;
        } else if (payment.status === 'failed') {
          stats.failedPayments++;
        } else if (payment.status === 'pending') {
          stats.pendingPayments++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting payment stats:', error);
      return {
        totalPayments: 0,
        totalAmount: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0,
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
