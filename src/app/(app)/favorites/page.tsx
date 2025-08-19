'use client';

import React from 'react';
import { useFavorites } from '@/context/favorites-context';
import { PageWrapper } from '@/components/shared/page-wrapper';
import { BaseVenueCard } from '@/components/shared/BaseVenueCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, HeartOff, Search, Filter, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  const router = useRouter();

  const handleVenuePress = (venueId: string) => {
    // Navigate to venue detail page
    router.push(`/venues/${venueId}`);
  };

  const handleFavorite = (venue: any) => {
    toggleFavorite(venue);
  };

  const handleExploreVenues = () => {
    router.push('/venues');
  };

  const handleSearchVenues = () => {
    router.push('/search');
  };

  if (favorites.length === 0) {
    return (
      <PageWrapper
        icon={Heart}
        title="No Favorites Yet"
        description="Start building your collection of favorite venues and services. Save the ones you love for easy access later."
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={handleExploreVenues}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Explore Venues
            </Button>
            
            <Button 
              onClick={handleSearchVenues}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Filter className="w-4 h-4 mr-2" />
              Search Services
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      icon={Heart}
      title="My Favorites"
      description={`${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} saved`}
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Button 
          onClick={handleExploreVenues}
          variant="outline"
          size="sm"
        >
          <Search className="w-4 h-4 mr-2" />
          Explore More
        </Button>
        
        <Button 
          onClick={handleSearchVenues}
          variant="outline"
          size="sm"
        >
          <Filter className="w-4 h-4 mr-2" />
          Search Services
        </Button>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <div key={favorite.slug} className="group">
            <BaseVenueCard
              venue={{
                id: favorite.slug,
                name: favorite.name,
                description: favorite.description,
                category: favorite.category,
                images: favorite.image ? [favorite.image] : [],
                pricing: {
                  currency: 'USD',
                  minPrice: favorite.priceValue || 0,
                  maxPrice: favorite.priceValue || 0,
                },
                amenities: favorite.amenities || {},
                rating: favorite.rating || 0,
                reviewCount: favorite.reviewCount || 0,
                location: favorite.location || '',
                slug: favorite.slug,
              }}
              variant="default"
              showActions={true}
              isFavorite={true}
              onPress={handleVenuePress}
              onFavorite={() => handleFavorite(favorite)}
              className="h-full"
            />
            
            {/* Quick Actions Overlay */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {favorite.rating && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{favorite.rating}</span>
                    {favorite.reviewCount && (
                      <span className="text-xs">({favorite.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFavorite(favorite)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <HeartOff className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {favorites.length > 0 && (
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">Need More Options?</CardTitle>
              <CardDescription>
                Discover more amazing venues and services to add to your collection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleExploreVenues}
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Explore Venues
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}
