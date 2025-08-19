
import { Suspense } from 'react';
import { SearchPageClient } from './page.client';
import { searchListings } from '@/services/listings';
import type { Listing } from '@/services/listings';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    guestCapacity?: string;
    amenities?: string | string[];
    sortBy?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  let listings: Listing[] = [];
  let hasSearched = false;

  try {
    listings = await searchListings(params);
    hasSearched = !!(params.q || params.location || params.category || params.minPrice || params.maxPrice || params.guestCapacity || (params.amenities && Array.isArray(params.amenities) ? params.amenities.length > 0 : !!params.amenities));
  } catch (error) {
    console.error('Error in search page:', error);
    listings = [];
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient 
        initialListings={listings} 
        hasSearched={hasSearched}
        searchParams={params}
      />
    </Suspense>
  );
}
