'use client';

import React from 'react';
import { BaseVenue } from '@/types/shared';
import { cn } from '@/lib/utils';

export interface BaseVenueCardProps {
  venue: BaseVenue;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  onFavorite?: (venueId: string) => void;
  onBook?: (venueId: string) => void;
  onPress?: (venueId: string) => void;
  className?: string;
  isFavorite?: boolean;
}

export function BaseVenueCard({
  venue,
  variant = 'default',
  showActions = true,
  onFavorite,
  onBook,
  onPress,
  className,
  isFavorite = false,
}: BaseVenueCardProps) {
  const handlePress = () => {
    onPress?.(venue.id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(venue.id);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBook?.(venue.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: venue.pricing.currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getAmenitiesList = () => {
    const amenities = Object.entries(venue.amenities)
      .filter(([_, available]) => available)
      .map(([name]) => name)
      .slice(0, 3);
    return amenities;
  };

  const amenitiesList = getAmenitiesList();

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-lg',
        variant === 'featured' && 'ring-2 ring-primary/20',
        className
      )}
      onClick={handlePress}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={venue.images[0] || '/images/placeholder-venue.jpg'}
          alt={venue.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top right corner elements */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          {/* Category Badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground">
            {venue.category}
          </span>
          
          {/* Favorite Button */}
          {showActions && onFavorite && (
            <button
              onClick={handleFavorite}
              className={cn(
                'w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center',
                isFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              )}
            >
              <svg
                className="w-4 h-4"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Guest Favorite Badge */}
        {venue.rating >= 4.5 && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-yellow-900">
              ⭐ Guest Favorite
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">
              {venue.location.city}, {venue.location.state}
            </span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium text-sm">{venue.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({venue.reviewCount} reviews)</span>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{venue.capacity.min}-{venue.capacity.max} guests</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>{formatPrice(venue.pricing.hourly)}/hr</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {amenitiesList.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {amenitiesList.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{formatPrice(venue.pricing.daily)}</span> per day
            </div>
            {onBook && (
              <button
                onClick={handleBook}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Book Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

