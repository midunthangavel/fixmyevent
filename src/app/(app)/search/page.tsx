
import { Suspense } from 'react';
import { SearchPageClient } from './page.client';


interface SearchPageProps {
  searchParams: {
    q?: string;
    location?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    guestCapacity?: string;
    amenities?: string | string[];
    sortBy?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageClient 
        searchParams={searchParams}
      />
    </Suspense>
  );
}
