import { onCall, HttpsError } from "firebase-functions/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

const db = getFirestore();

// Create venue function
export const createVenue = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { venueData } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!venueData || typeof venueData !== 'object') {
      throw new HttpsError('invalid-argument', 'Venue data is required');
    }

    // Validate required fields
    const { name, description, location, capacity, pricePerHour } = venueData;
    if (!name || !description || !location || !capacity || !pricePerHour) {
      throw new HttpsError('invalid-argument', 'Name, description, location, capacity, and price are required');
    }

    // Create venue document
    const venue = {
      ...venueData,
      ownerId: uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      rating: 0,
      reviewCount: 0,
      isAvailable: true
    };

    const venueRef = await db.collection('venues').add(venue);

    logger.info('Venue created successfully', { venueId: venueRef.id, ownerId: uid });

    return {
      success: true,
      message: 'Venue created successfully',
      venueId: venueRef.id,
      venue: { id: venueRef.id, ...venue }
    };

  } catch (error) {
    logger.error('Error creating venue:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to create venue');
  }
});

// Get venue function
export const getVenue = onCall(async (request) => {
  try {
    const { venueId } = request.data;

    // Validate input
    if (!venueId) {
      throw new HttpsError('invalid-argument', 'Venue ID is required');
    }

    // Get venue from Firestore
    const venueDoc = await db.collection('venues').doc(venueId).get();

    if (!venueDoc.exists) {
      throw new HttpsError('not-found', 'Venue not found');
    }

    const venue = { id: venueDoc.id, ...venueDoc.data() };

    logger.info('Venue retrieved successfully', { venueId });

    return {
      success: true,
      venue
    };

  } catch (error) {
    logger.error('Error getting venue:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to get venue');
  }
});

// Get venues with filters function
export const getVenues = onCall(async (request) => {
  try {
    const { filters = {}, pagination = {} } = request.data;
    const { page = 1, limit = 20 } = pagination;

    // Build query
    let query = db.collection('venues').where('status', '==', 'active');

    // Apply filters
    if (filters.location) {
      query = query.where('location.city', '==', filters.location);
    }

    if (filters.minCapacity) {
      query = query.where('capacity', '>=', filters.minCapacity);
    }

    if (filters.maxPrice) {
      query = query.where('pricePerHour', '<=', filters.maxPrice);
    }

    if (filters.eventType) {
      query = query.where('eventTypes', 'array-contains', filters.eventType);
    }

    // Apply pagination
    query = query.orderBy('createdAt', 'desc').limit(limit);

    // Execute query
    const venuesSnapshot = await query.get();
    const venues: any[] = [];

    venuesSnapshot.forEach((doc) => {
      venues.push({ id: doc.id, ...doc.data() });
    });

    logger.info('Venues retrieved successfully', { count: venues.length });

    return {
      success: true,
      venues,
      pagination: {
        page,
        limit,
        total: venues.length,
        hasMore: venues.length === limit
      }
    };

  } catch (error) {
    logger.error('Error getting venues:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to get venues');
  }
});

// Update venue function
export const updateVenue = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { venueId, updates } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!venueId || !updates || typeof updates !== 'object') {
      throw new HttpsError('invalid-argument', 'Venue ID and updates are required');
    }

    // Check if user owns the venue
    const venueDoc = await db.collection('venues').doc(venueId).get();
    
    if (!venueDoc.exists) {
      throw new HttpsError('not-found', 'Venue not found');
    }

    const venue = venueDoc.data();
    if (venue?.ownerId !== uid) {
      throw new HttpsError('permission-denied', 'You can only update your own venues');
    }

    // Remove sensitive fields that shouldn't be updated
    const { ownerId: _, createdAt: __, ...safeUpdates } = updates;

    // Add updated timestamp
    safeUpdates.updatedAt = new Date();

    // Update venue
    await db.collection('venues').doc(venueId).update(safeUpdates);

    logger.info('Venue updated successfully', { venueId, ownerId: uid });

    return {
      success: true,
      message: 'Venue updated successfully'
    };

  } catch (error) {
    logger.error('Error updating venue:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to update venue');
  }
});

// Delete venue function
export const deleteVenue = onCall(async (request) => {
  try {
    // Check if user is authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { venueId } = request.data;
    const uid = request.auth.uid;

    // Validate input
    if (!venueId) {
      throw new HttpsError('invalid-argument', 'Venue ID is required');
    }

    // Check if user owns the venue
    const venueDoc = await db.collection('venues').doc(venueId).get();
    
    if (!venueDoc.exists) {
      throw new HttpsError('not-found', 'Venue not found');
    }

    const venue = venueDoc.data();
    if (venue?.ownerId !== uid) {
      throw new HttpsError('permission-denied', 'You can only delete your own venues');
    }

    // Soft delete - mark as inactive
    await db.collection('venues').doc(venueId).update({
      status: 'inactive',
      updatedAt: new Date()
    });

    logger.info('Venue deleted successfully', { venueId, ownerId: uid });

    return {
      success: true,
      message: 'Venue deleted successfully'
    };

  } catch (error) {
    logger.error('Error deleting venue:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to delete venue');
  }
});

// Search venues function
export const searchVenues = onCall(async (request) => {
  try {
    const { query, filters = {} } = request.data;

    // Validate input
    if (!query || typeof query !== 'string') {
      throw new HttpsError('invalid-argument', 'Search query is required');
    }

    // Build base query
    let baseQuery = db.collection('venues').where('status', '==', 'active');

    // Apply filters
    if (filters.location) {
      baseQuery = baseQuery.where('location.city', '==', filters.location);
    }

    if (filters.minCapacity) {
      baseQuery = baseQuery.where('capacity', '>=', filters.minCapacity);
    }

    if (filters.maxPrice) {
      baseQuery = baseQuery.where('pricePerHour', '<=', filters.maxPrice);
    }

    // Execute query
    const venuesSnapshot = await baseQuery.get();
    const venues: any[] = [];

    venuesSnapshot.forEach((doc) => {
      const venue = { id: doc.id, ...doc.data() };
      
      // Simple text search in name, description, and tags
      const searchableText = `${venue.name} ${venue.description} ${venue.tags?.join(' ') || ''}`.toLowerCase();
      
      if (searchableText.includes(query.toLowerCase())) {
        venues.push(venue);
      }
    });

    logger.info('Venue search completed', { query, results: venues.length });

    return {
      success: true,
      venues,
      query,
      total: venues.length
    };

  } catch (error) {
    logger.error('Error searching venues:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to search venues');
  }
});

