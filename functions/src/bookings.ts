import { onCall, HttpsError } from "firebase-functions/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

const db = getFirestore();

// Create booking function
export const createBooking = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { bookingData } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!bookingData || typeof bookingData !== 'object') {
      throw new HttpsError('invalid-argument', 'Booking data is required');
    }

    // Validate required fields
    const { venueId, startTime, endTime, guestCount, eventType } = bookingData;
    if (!venueId || !startTime || !endTime || !guestCount || !eventType) {
      throw new HttpsError('invalid-argument', 'Venue ID, start time, end time, guest count, and event type are required');
    }

    // Validate time logic
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
      throw new HttpsError('invalid-argument', 'Start time must be in the future');
    }

    if (end <= start) {
      throw new HttpsError('invalid-argument', 'End time must be after start time');
    }

    // Check venue availability
    const venueDoc = await db.collection('venues').doc(venueId).get();
    if (!venueDoc.exists) {
      throw new HttpsError('not-found', 'Venue not found');
    }

    const venue = venueDoc.data();
    if (!venue?.isAvailable) {
      throw new HttpsError('failed-precondition', 'Venue is not available');
    }

    if (guestCount > venue.capacity) {
      throw new HttpsError('invalid-argument', 'Guest count exceeds venue capacity');
    }

    // Check for booking conflicts
    const conflictingBookings = await db.collection('bookings')
      .where('venueId', '==', venueId)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    const hasConflict = conflictingBookings.docs.some(doc => {
      const booking = doc.data();
      const bookingStart = booking.startTime.toDate();
      const bookingEnd = booking.endTime.toDate();
      
      return (start < bookingEnd && end > bookingStart);
    });

    if (hasConflict) {
      throw new HttpsError('failed-precondition', 'Venue is not available for the selected time');
    }

    // Calculate total price
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalPrice = venue.pricePerHour * durationHours;

    // Create booking document
    const booking = {
      ...bookingData,
      userId: uid,
      venueId,
      startTime: start,
      endTime: end,
      totalPrice,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const bookingRef = await db.collection('bookings').add(booking);

    logger.info('Booking created successfully', { bookingId: bookingRef.id, userId: uid, venueId });

    return {
      success: true,
      message: 'Booking created successfully',
      bookingId: bookingRef.id,
      booking: { id: bookingRef.id, ...booking }
    };

  } catch (error) {
    logger.error('Error creating booking:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to create booking');
  }
});

// Get booking function
export const getBooking = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { bookingId } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!bookingId) {
      throw new HttpsError('invalid-argument', 'Booking ID is required');
    }

    // Get booking from Firestore
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();

    if (!bookingDoc.exists) {
      throw new HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data();

    // Check if user owns the booking or owns the venue
    if (booking?.userId !== uid) {
      if (!booking) {
        throw new HttpsError('not-found', 'Booking not found');
      }
      
      const venueDoc = await db.collection('venues').doc(booking.venueId).get();
      const venue = venueDoc.data();
      
      if (venue?.ownerId !== uid) {
        throw new HttpsError('permission-denied', 'Access denied');
      }
    }

    logger.info('Booking retrieved successfully', { bookingId, userId: uid });

    return {
      success: true,
      booking: { id: bookingDoc.id, ...booking }
    };

  } catch (error) {
    logger.error('Error getting booking:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to get booking');
  }
});

// Get user bookings function
export const getUserBookings = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { status, pagination = {} } = request.data;
    const uid = request.auth.uid;
    const { page = 1, limit = 20 } = pagination;

    // Build query
    let query = db.collection('bookings').where('userId', '==', uid);

    if (status) {
      query = query.where('status', '==', status);
    }

    // Apply pagination
    query = query.orderBy('createdAt', 'desc').limit(limit);

    // Execute query
    const bookingsSnapshot = await query.get();
    const bookings: any[] = [];

    bookingsSnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    logger.info('User bookings retrieved successfully', { userId: uid, count: bookings.length });

    return {
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total: bookings.length,
        hasMore: bookings.length === limit
      }
    };

  } catch (error) {
    logger.error('Error getting user bookings:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to get user bookings');
  }
});

// Update booking status function
export const updateBookingStatus = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { bookingId, status } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!bookingId || !status) {
      throw new HttpsError('invalid-argument', 'Booking ID and status are required');
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new HttpsError('invalid-argument', 'Invalid status');
    }

    // Get booking
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    
    if (!bookingDoc.exists) {
      throw new HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data();

    // Check permissions
    if (status === 'confirmed' || status === 'cancelled') {
      // Only venue owner can confirm or cancel
      if (!booking) {
        throw new HttpsError('not-found', 'Booking not found');
      }
      
      const venueDoc = await db.collection('venues').doc(booking.venueId).get();
      const venue = venueDoc.data();
      
      if (venue?.ownerId !== uid) {
        throw new HttpsError('permission-denied', 'Only venue owner can update booking status');
      }
    } else if (status === 'completed') {
      // Both user and venue owner can mark as completed
      if (!booking) {
        throw new HttpsError('not-found', 'Booking not found');
      }
      
      const venueDoc = await db.collection('venues').doc(booking.venueId).get();
      const venue = venueDoc.data();
      
      if (booking.userId !== uid && venue?.ownerId !== uid) {
        throw new HttpsError('permission-denied', 'Access denied');
      }
    }

    // Update booking status
    await db.collection('bookings').doc(bookingId).update({
      status,
      updatedAt: new Date()
    });

    logger.info('Booking status updated successfully', { bookingId, status, userId: uid });

    return {
      success: true,
      message: 'Booking status updated successfully'
    };

  } catch (error) {
    logger.error('Error updating booking status:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to update booking status');
  }
});

// Cancel booking function
export const cancelBooking = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { bookingId } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!bookingId) {
      throw new HttpsError('invalid-argument', 'Booking ID is required');
    }

    // Get booking
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    
    if (!bookingDoc.exists) {
      throw new HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data();

    // Check if user owns the booking
    if (booking?.userId !== uid) {
      throw new HttpsError('permission-denied', 'You can only cancel your own bookings');
    }

    // Check if booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      throw new HttpsError('failed-precondition', 'Booking cannot be cancelled');
    }

    // Check if booking is too close to start time (e.g., within 24 hours)
    const startTime = booking.startTime.toDate();
    const now = new Date();
    const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      throw new HttpsError('failed-precondition', 'Bookings cannot be cancelled within 24 hours of start time');
    }

    // Cancel booking
    await db.collection('bookings').doc(bookingId).update({
      status: 'cancelled',
      updatedAt: new Date()
    });

    logger.info('Booking cancelled successfully', { bookingId, userId: uid });

    return {
      success: true,
      message: 'Booking cancelled successfully'
    };

  } catch (error) {
    logger.error('Error cancelling booking:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to cancel booking');
  }
});

