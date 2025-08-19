import { Suspense } from 'react';
import { EnhancedSearchPageClient } from './enhanced-page.client';
import { searchListings } from '@/services/listings';
import type { Listing } from '@/services/listings';

interface EnhancedSearchPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    guestCapacity?: string;
    amenities?: string | string[];
    sortBy?: string;
    date?: string;
    rating?: string;
    distance?: string;
  }>;
}

export default async function EnhancedSearchPage({ searchParams }: EnhancedSearchPageProps) {
  const params = await searchParams;
  
  let listings: Listing[] = [];
  let hasSearched = false;

  try {
    listings = await searchListings(params);
    hasSearched = !!(params.q || params.location || params.category || params.minPrice || params.maxPrice || params.guestCapacity || (params.amenities && Array.isArray(params.amenities) ? params.amenities.length > 0 : !!params.amenities) || params.date || params.rating || params.distance);
  } catch (error) {
    console.error('Error in enhanced search page:', error);
    listings = [];
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedSearchPageClient 
        initialListings={listings} 
        hasSearched={hasSearched}
        searchParams={params}
      />
    </Suspense>
  );
}
