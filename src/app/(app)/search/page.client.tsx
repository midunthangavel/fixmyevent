
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VenueCard } from '@/components/venue-card';
import { Filters } from '@/components/search/filters';
import type { Listing } from '@/services/listings';
import { searchListings } from '@/services/listings';

interface SearchPageClientProps {
  initialListings: Listing[];
  hasSearched: boolean;
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

export function SearchPageClient({ initialListings, hasSearched, searchParams }: SearchPageClientProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '');

  useEffect(() => {
    setListings(initialListings);
    setSearchQuery(searchParams.q || '');
  }, [initialListings, searchParams.q]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchListings({ ...searchParams, q: searchQuery });
      setListings(results);
      
      // Update URL with search query
      const params = new URLSearchParams(searchParamsHook.toString());
      params.set('q', searchQuery);
      router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = async (newParams: typeof searchParams) => {
    setLoading(true);
    try {
      const results = await searchListings(newParams);
      setListings(results);
      
      // Update URL with new params
      const params = new URLSearchParams();
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.set(key, value);
          }
        }
      });
      router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Venue</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search venues, locations, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading} className="flex-1 sm:flex-none">
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-none"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <Filters
            searchParams={searchParams}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-6">
        {!hasSearched && !searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle>Start Your Search</CardTitle>
              <CardDescription>
                Enter a location, venue type, or keyword to find the perfect venue for your event.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {hasSearched && listings.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No Results Found</CardTitle>
              <CardDescription>
                Try adjusting your search criteria or filters to find more venues.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {listings.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {listings.length} venue{listings.length !== 1 ? 's' : ''} found
              </h2>
              {searchParams.sortBy && (
                <Badge variant="secondary">
                  Sorted by {searchParams.sortBy.replace('_', ' ')}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {listings.map((listing) => (
                <VenueCard key={listing.slug} {...listing} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
