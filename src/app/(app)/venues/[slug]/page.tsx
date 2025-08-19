
import { notFound } from 'next/navigation';
import { VenueDetailClient } from '@/components/venue-detail-client';
import { getListingBySlug, type Listing } from '@/services/listings';

// This is a Server Component, it fetches data and passes it to the client component.
export default async function VenueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const venue = await getListingBySlug(resolvedParams.slug) as Listing;

  if (!venue) {
    notFound();
  }

  return <VenueDetailClient venue={venue} />;
}
