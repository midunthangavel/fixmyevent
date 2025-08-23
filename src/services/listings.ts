
import { listingsService } from './database';
import type { Listing as ListingType } from '@/types/listing';
import { getMockListings, getMockListingBySlug } from './mock-data';
import { logServiceError, logServiceInfo, logServiceWarn } from '@/lib/logger';

export type Listing = ListingType;

export interface SearchParams {
  q?: string;
  location?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  guestCapacity?: string;
  amenities?: string | string[];
  sortBy?: string;
}

/**
 * Check if Firebase is properly configured and available
 */
const isFirebaseAvailable = () => {
  return listingsService && typeof listingsService.getAll === 'function';
};

/**
 * Fetches all listings from Firestore or mock data.
 */
export async function getAllListings(): Promise<Listing[]> {
  try {
    if (!isFirebaseAvailable()) {
      logServiceInfo('ListingsService', 'getAll', 'Firebase not available, using mock data');
      return getMockListings();
    }

    const listings = await listingsService.getAll();
    return listings as Listing[];
  } catch (error) {
    logServiceError('ListingsService', 'getAll', error);
    // Fallback to mock data
    logServiceWarn('ListingsService', 'getAll', 'Falling back to mock data due to Firebase error');
    return getMockListings();
  }
}

/**
 * Fetches a single listing by its slug (document ID).
 */
export async function getListingBySlug(slug: string): Promise<Listing | null> {
    try {
        if (!isFirebaseAvailable()) {
          logServiceInfo('ListingsService', 'getById', 'Firebase not available, using mock data', { slug });
          return getMockListingBySlug(slug);
        }

        const listing = await listingsService.getById(slug);
        return listing as Listing | null;
    } catch (error) {
        logServiceError('ListingsService', 'getById', error, { slug });
        // Fallback to mock data
        logServiceWarn('ListingsService', 'getById', 'Falling back to mock data due to Firebase error', { slug });
        return getMockListingBySlug(slug);
    }
}

/**
 * Fetches a single listing by its ID (alias for getListingBySlug for backward compatibility).
 */
export async function getListingById(id: string): Promise<Listing | null> {
    return getListingBySlug(id);
}

/**
 * Fetches a limited number of listings, optionally filtered by category.
 */
export async function getLimitedListings({
  count,
  category,
}: {
  count: number;
  category?: string;
}): Promise<Listing[]> {
  try {
    // Validate inputs
    if (count <= 0) {
      logServiceWarn('ListingsService', 'getLimitedListings', 'count must be positive', { count });
      return [];
    }

    if (!isFirebaseAvailable()) {
      logServiceInfo('ListingsService', 'getLimitedListings', 'Firebase not available, using mock data', { count, category });
      return getMockListings(category, count);
    }

    if (category && category.trim()) {
      const listings = await listingsService.getByCategory(category.trim(), count);
      return listings as Listing[];
    } else {
      const allListings = await listingsService.getAll();
      return (allListings as Listing[]).slice(0, count);
    }
  } catch (error) {
    logServiceError('ListingsService', 'getLimitedListings', error, { count, category });
    // Fallback to mock data
    logServiceWarn('ListingsService', 'getLimitedListings', 'Falling back to mock data due to Firebase error', { count, category });
    return getMockListings(category, count);
  }
}

/**
 * Searches listings based on various criteria.
 */
export async function searchListings(params: SearchParams): Promise<Listing[]> {
  try {
    if (!isFirebaseAvailable()) {
      logServiceInfo('ListingsService', 'searchListings', 'Firebase not available, using mock data for search', { params });
      return getMockListings();
    }

    // Build query based on search parameters
    let query = listingsService.getAll();

    // Apply filters if provided
    if (params.category) {
      query = listingsService.getByCategory(params.category);
    }

    if (params.location) {
      query = listingsService.getByField('location', params.location);
    }

    if (params.minPrice || params.maxPrice) {
      const minPrice = params.minPrice ? parseFloat(params.minPrice) : 0;
      const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : Infinity;
      
      query = listingsService.getByField('price', { min: minPrice, max: maxPrice });
    }

    if (params.guestCapacity) {
      const capacity = parseInt(params.guestCapacity);
      if (!isNaN(capacity)) {
        query = listingsService.getByField('guestCapacity', capacity);
      }
    }

    const results = await query;
    return results as Listing[];
  } catch (error) {
    logServiceError('ListingsService', 'searchListings', error, { params });
    // Fallback to mock search
    logServiceWarn('ListingsService', 'searchListings', 'Falling back to mock search due to Firebase error', { params });
    return getMockListings();
  }
}

/**
 * Creates a new listing.
 */
export async function createListing(listingData: Omit<Listing, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
  try {
    if (!isFirebaseAvailable()) {
      throw new Error('Firebase not available for creating listings');
    }

    const newListingId = await listingsService.create(listingData);
    // Create a new listing object with the returned ID
    const newListing: Listing = {
      ...listingData,
      id: newListingId,
      slug: listingData.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return newListing;
  } catch (error) {
    logServiceError('ListingsService', 'createListing', error, { listingData });
    throw error;
  }
}

/**
 * Updates an existing listing.
 */
export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
  try {
    if (!isFirebaseAvailable()) {
      throw new Error('Firebase not available for updating listings');
    }

    await listingsService.update(id, updates);
    // Get the updated listing
    const updatedListing = await listingsService.getById(id);
    if (!updatedListing) {
      throw new Error('Failed to retrieve updated listing');
    }
    return updatedListing as Listing;
  } catch (error) {
    logServiceError('ListingsService', 'updateListing', error, { id, updates });
    throw error;
  }
}

/**
 * Deletes a listing.
 */
export async function deleteListing(id: string): Promise<void> {
  try {
    if (!isFirebaseAvailable()) {
      throw new Error('Firebase not available for deleting listings');
    }

    await listingsService.delete(id);
  } catch (error) {
    logServiceError('ListingsService', 'deleteListing', error, { id });
    throw error;
  }
}

/**
 * Gets listings by category.
 */
export async function getListingsByCategory(category: string, limit?: number): Promise<Listing[]> {
  try {
    if (!isFirebaseAvailable()) {
      logServiceInfo('ListingsService', 'getListingsByCategory', 'Firebase not available, using mock data', { category, limit });
      return getMockListings(category, limit);
    }

    const listings = await listingsService.getByCategory(category, limit);
    return listings as Listing[];
  } catch (error) {
    logServiceError('ListingsService', 'getListingsByCategory', error, { category, limit });
    // Fallback to mock data
    logServiceWarn('ListingsService', 'getListingsByCategory', 'Falling back to mock data due to Firebase error', { category, limit });
    return getMockListings(category, limit);
  }
}

/**
 * Gets featured listings (e.g., highest rated, most popular).
 */
export async function getFeaturedListings(limit: number = 6): Promise<Listing[]> {
  try {
    if (!isFirebaseAvailable()) {
      logServiceInfo('ListingsService', 'getFeaturedListings', 'Firebase not available, using mock data', { limit });
      return getMockListings(undefined, limit);
    }

    // For now, return limited listings. In a real app, you might want to
    // implement logic to determine which listings are "featured"
    const allListings = await listingsService.getAll();
    return (allListings as Listing[]).slice(0, limit);
  } catch (error) {
    logServiceError('ListingsService', 'getFeaturedListings', error, { limit });
    // Fallback to mock data
    logServiceWarn('ListingsService', 'getFeaturedListings', 'Falling back to mock data due to Firebase error', { limit });
    return getMockListings(undefined, limit);
  }
}
