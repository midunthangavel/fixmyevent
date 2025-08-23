import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Booking, BookingFormValues, BookingStatus } from '@/types/booking';
import type { Listing } from '@/types/listing';

// Collection names
export const COLLECTIONS = {
  BOOKINGS: 'bookings',
  LISTINGS: 'listings',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
} as const;

// Booking service class
export class BookingService {
  private collectionRef = collection(db, COLLECTIONS.BOOKINGS);

  // Create a new booking
  async createBooking(bookingData: Omit<BookingFormValues, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Validate the booking data
      const validatedData = {
        ...bookingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Check if the service is available for the requested date/time
      await this.checkServiceAvailability(bookingData.serviceId, bookingData.bookingDate, bookingData.category);

      // Create the booking
      const docRef = await addDoc(this.collectionRef, validatedData);
      
      // Send notification to service provider
      await this.notifyServiceProvider(bookingData.serviceId, 'New Booking Request', `You have a new booking request for ${bookingData.serviceName}`);

      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  // Get booking by ID
  async getBookingById(bookingId: string): Promise<Booking | null> {
    try {
      const docRef = doc(this.collectionRef, bookingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Booking;
      }
      return null;
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  }

  // Get all bookings for a user
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const q = query(
        this.collectionRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  }

  // Get all bookings for a service provider
  async getServiceProviderBookings(serviceId: string): Promise<Booking[]> {
    try {
      const q = query(
        this.collectionRef,
        where('serviceId', '==', serviceId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
    } catch (error) {
      console.error('Error getting service provider bookings:', error);
      throw error;
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: BookingStatus, notes?: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, bookingId);
      const updateData: Partial<Booking> = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (notes) {
        updateData.notes = notes;
      }

      await updateDoc(docRef, updateData);

      // Get the booking to send appropriate notifications
      const booking = await this.getBookingById(bookingId);
      if (booking) {
        await this.notifyUser(booking.userId, `Booking ${status}`, `Your booking for ${booking.serviceName} has been ${status.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  // Update booking details
  async updateBooking(bookingId: string, updateData: Partial<BookingFormValues>): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, bookingId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, bookingId);
      await updateDoc(docRef, {
        status: 'Cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled by user',
        updatedAt: serverTimestamp(),
      });

      // Get the booking to send notifications
      const booking = await this.getBookingById(bookingId);
      if (booking) {
        await this.notifyServiceProvider(booking.serviceId, 'Booking Cancelled', `A booking for ${booking.serviceName} has been cancelled`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Delete booking (admin only)
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, bookingId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  // Check service availability
  private async checkServiceAvailability(serviceId: string, bookingDate: any, category: string): Promise<void> {
    try {
      // Get the service listing
      const listingRef = doc(db, COLLECTIONS.LISTINGS, serviceId);
      const listingSnap = await getDoc(listingRef);
      
      if (!listingSnap.exists()) {
        throw new Error('Service not found');
      }

      // Check if there are conflicting bookings
      const conflictingBookings = await this.getConflictingBookings(serviceId, bookingDate, category);
      
      if (conflictingBookings.length > 0) {
        throw new Error('Service is not available for the selected date/time');
      }

      // Additional availability checks based on category
      if (category === 'Venue') {
        await this.checkVenueAvailability(serviceId);
      } else if (category === 'Photography') {
        await this.checkPhotographyAvailability(serviceId);
      }
      // Add more category-specific checks as needed
    } catch (error) {
      console.error('Error checking service availability:', error);
      throw error;
    }
  }

  // Get conflicting bookings
  private async getConflictingBookings(serviceId: string, bookingDate: any, category: string): Promise<Booking[]> {
    try {
      const q = query(
        this.collectionRef,
        where('serviceId', '==', serviceId),
        where('status', 'in', ['Pending', 'Confirmed', 'In Progress'])
      );
      
      const querySnapshot = await getDocs(q);
      const conflictingBookings: Booking[] = [];

      querySnapshot.docs.forEach(doc => {
        const booking = doc.data() as Booking;
        
        // Check for date conflicts based on category
        if (this.hasDateConflict(booking, bookingDate, category)) {
          conflictingBookings.push({ id: doc.id, ...booking });
        }
      });

      return conflictingBookings;
    } catch (error) {
      console.error('Error getting conflicting bookings:', error);
      return [];
    }
  }

  // Check if there's a date conflict
  private hasDateConflict(booking: Booking, newBookingDate: any, _category: string): boolean {
    // This is a simplified conflict check - you might want to implement more sophisticated logic
    const existingDate = booking.bookingDate?.toDate?.() || new Date(booking.bookingDate);
    const newDate = newBookingDate?.toDate?.() || new Date(newBookingDate);
    
    // For now, just check if it's the same day
    // You could implement more sophisticated time-based conflict checking
    return existingDate.toDateString() === newDate.toDateString();
  }

  // Check venue-specific availability
  private async checkVenueAvailability(_serviceId: string): Promise<void> {
    // Implement venue-specific availability logic
    // e.g., check capacity, existing bookings, etc.
  }

  // Check photography-specific availability
  private async checkPhotographyAvailability(_serviceId: string): Promise<void> {
    // Implement photography-specific availability logic
    // e.g., check photographer's schedule, equipment availability, etc.
  }

  // Send notification to service provider
  private async notifyServiceProvider(serviceId: string, title: string, message: string): Promise<void> {
    try {
      const listingRef = doc(db, COLLECTIONS.LISTINGS, serviceId);
      const listingSnap = await getDoc(listingRef);
      
      if (listingSnap.exists()) {
        const listingData = listingSnap.data() as Listing;
        if (listingData.ownerId) {
          await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
            userId: listingData.ownerId,
            type: title,
            message,
            timestamp: serverTimestamp(),
            read: false,
            iconName: 'Booking'
          });
        }
      }
    } catch (error) {
      console.error('Error notifying service provider:', error);
    }
  }

  // Send notification to user
  private async notifyUser(userId: string, title: string, message: string): Promise<void> {
    try {
      await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
        userId,
        type: title,
        message,
        timestamp: serverTimestamp(),
        read: false,
        iconName: 'Notification'
      });
    } catch (error) {
      console.error('Error notifying user:', error);
    }
  }

  // Get booking statistics
  async getBookingStats(userId?: string, serviceId?: string): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    revenue: number;
  }> {
    try {
      let q = query(this.collectionRef);
      
      if (userId) {
        q = query(q, where('userId', '==', userId));
      } else if (serviceId) {
        q = query(q, where('serviceId', '==', serviceId));
      }
      
      const querySnapshot = await getDocs(q);
      const stats = {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
      };

      querySnapshot.docs.forEach(doc => {
        const booking = doc.data() as Booking;
        stats.total++;
        stats[booking.status.toLowerCase() as keyof typeof stats]++;
        
        if (booking.status === 'Completed') {
          stats.revenue += booking.totalAmount;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        revenue: 0,
      };
    }
  }

  // Real-time booking updates
  subscribeToUserBookings(userId: string, callback: (bookings: Booking[]) => void) {
    const q = query(
      this.collectionRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      
      callback(bookings);
    });
  }

  // Real-time service provider booking updates
  subscribeToServiceProviderBookings(serviceId: string, callback: (bookings: Booking[]) => void) {
    const q = query(
      this.collectionRef,
      where('serviceId', '==', serviceId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      
      callback(bookings);
    });
  }
}

// Export singleton instance
export const bookingService = new BookingService();
