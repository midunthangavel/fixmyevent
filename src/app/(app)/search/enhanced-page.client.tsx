'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, MapPin, Users, DollarSign, Grid, List, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VenueCard } from '@/components/venue-card';
import { EnhancedSearch } from '@/components/search/enhanced-search';
import { EnhancedFilters } from '@/components/search/enhanced-filters';
import type { Listing } from '@/services/listings';
import { performSearch } from '@/services/listings';

interface EnhancedSearchPageClientProps {
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
    date?: string;
    rating?: string;
    distance?: string;
  };
}

export function EnhancedSearchPageClient({ 
  initialListings, 
  hasSearched, 
  searchParams 
}: EnhancedSearchPageClientProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '');

  useEffect(() => {
    setListings(initialListings);
    setSearchQuery(searchParams.q || '');
  }, [initialListings, searchParams.q]);

  const handleSearch = async (query: string, filters?: Record<string, any>) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchParams = { ...searchParams, q: query, ...filters };
      const results = await performSearch(searchParams);
      setListings(results);
      
      // Update URL with search query
      const params = new URLSearchParams(searchParamsHook.toString());
      params.set('q', query);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v));
            } else {
              params.set(key, value);
            }
          }
        });
      }
      router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newParams: typeof searchParams) => {
    setLoading(true);
    try {
      const results = await performSearch(newParams);
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

  const handleSaveSearch = (name: string, filters: Record<string, any>) => {
    console.log('Saving search:', name, filters);
    // This could trigger a toast notification or save to user preferences
  };

  const handleVoiceSearch = (query: string) => {
    console.log('Voice search query:', query);
    handleSearch(query);
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Enhanced Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Perfect Venue</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Use voice search, advanced filters, and AI-powered recommendations to find the ideal venue for your event.
        </p>
        
        {/* Enhanced Search Component */}
        <EnhancedSearch
          onSearch={handleSearch}
          onVoiceSearch={handleVoiceSearch}
          placeholder="Try saying: 'Find me a wedding venue for 100 people under $5000'"
          className="mb-4"
        />

        {/* Search Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setViewMode('map')}
              className={viewMode === 'map' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            >
              <Map className="h-4 w-4" />
              Map View
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      {showFilters && (
        <div className="mb-6">
          <EnhancedFilters
            searchParams={searchParams}
            onFilterChange={handleFilterChange}
            onSaveSearch={handleSaveSearch}
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
                Use the search bar above to find venues, or try our voice search feature for hands-free searching.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Location Search</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find venues in your preferred area
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">Guest Capacity</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Filter by number of guests
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-medium mb-2">Budget Range</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Set your price range
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hasSearched && listings.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No Results Found</CardTitle>
              <CardDescription>
                Try adjusting your search criteria or filters to find more venues. You can also use voice search for natural language queries.
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
            
            {/* Results Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {listings.map((listing) => (
                <VenueCard key={listing.slug} {...listing} />
              ))}
            </div>

            {/* Map View Placeholder */}
            {viewMode === 'map' && (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Map View Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Interactive map view with venue locations will be available soon.
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
