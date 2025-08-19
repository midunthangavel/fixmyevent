'use client';

import Link from 'next/link';
import { BaseVenueCard, BaseVenueCardProps } from '@/components/shared/BaseVenueCard';
import { BaseVenue } from '@/types/shared';

// Extend the base props for web-specific functionality
export interface VenueCardProps extends Omit<BaseVenueCardProps, 'venue'> {
  name: string;
  slug: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  image?: string;
  hint?: string;
  guestFavorite?: boolean;
  isCard?: boolean;
  imageClassName?: string;
  category?: string;
  guestCapacity?: number;
  amenities?: string[] | Record<string, boolean>;
}

export function VenueCard({
  name,
  slug,
  location,
  rating = 0,
  reviewCount = 0,
  price,
  image,
  hint,
  guestFavorite = false,
  isCard = true,
  imageClassName,
  category,
  guestCapacity,
  amenities,
  ...baseProps
}: VenueCardProps) {
  // Convert legacy props to BaseVenue format
  const venue: BaseVenue = {
    id: slug,
    name,
    slug,
    description: hint || '',
    location: {
      address: location || '',
      city: location?.split(',')[0]?.trim() || '',
      state: location?.split(',')[1]?.trim() || '',
      zipCode: '',
    },
    images: image ? [image] : [],
    category: category || 'Venue',
    capacity: {
      min: guestCapacity || 1,
      max: guestCapacity || 100,
    },
    pricing: {
      hourly: parseFloat(price?.replace(/[^0-9.]/g, '') || '0'),
      daily: parseFloat(price?.replace(/[^0-9.]/g, '') || '0') * 8, // Estimate daily rate
      currency: 'USD',
    },
    rating,
    reviewCount,
    amenities: Array.isArray(amenities) 
      ? amenities.reduce((acc, amenity) => ({ ...acc, [amenity]: true }), {})
      : amenities || {},
    availability: {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      availableHours: { start: '09:00', end: '17:00' },
    },
    owner: {
      id: '',
      name: '',
      email: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handlePress = (venueId: string) => {
    // Navigate to venue detail page
    window.location.href = `/services/${venueId}`;
  };

  const handleFavorite = (venueId: string) => {
    // TODO: Implement favorite functionality
    console.log('Toggle favorite for:', venueId);
  };

  const handleBook = (venueId: string) => {
    // TODO: Implement booking functionality
    console.log('Book venue:', venueId);
  };

  return (
    <Link href={`/services/${slug}`} className="block">
      <BaseVenueCard
        venue={venue}
        onPress={handlePress}
        onFavorite={handleFavorite}
        onBook={handleBook}
        isFavorite={guestFavorite}
        className={imageClassName}
        {...baseProps}
      />
    </Link>
  );
}
