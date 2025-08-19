import { Suspense } from 'react';
import { ServicesPageClient } from './page.client';
import { getMockListings } from '@/services/mock-data';

export default async function ServicesPage() {
  const listings = await getMockListings();

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div>Loading...</div>}>
        <ServicesPageClient initialListings={listings} />
      </Suspense>
    </div>
  );
}
