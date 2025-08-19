import { Suspense } from 'react';
import { ServiceDetailClient } from './page.client';
import { getListingById } from '@/services/listings';

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  
  let listing = null;
  try {
    listing = await getListingById(id);
  } catch (error) {
    console.error('Error fetching service:', error);
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Service Not Found</h1>
          <p className="text-muted-foreground">The service you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceDetailClient listing={listing} />
    </Suspense>
  );
}
