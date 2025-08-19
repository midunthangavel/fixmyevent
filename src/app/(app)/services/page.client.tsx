'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Grid3X3, List, Star, MapPin, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VenueCard } from '@/components/venue-card';
import { categories } from '@/types/listing';
import type { Listing } from '@/types/listing';

interface ServicesPageClientProps {
  initialListings: Listing[];
}

export function ServicesPageClient({ initialListings }: ServicesPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<string>('all');

  // Filter and search listings
  const filteredListings = useMemo(() => {
    let filtered = initialListings;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.location?.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(listing => {
        const price = listing.priceValue || 0;
        switch (priceRange) {
          case 'under-1000':
            return price < 1000;
          case '1000-5000':
            return price >= 1000 && price < 5000;
          case '5000-10000':
            return price >= 5000 && price < 10000;
          case 'over-10000':
            return price >= 10000;
          default:
            return true;
        }
      });
    }

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.priceValue || 0) - (b.priceValue || 0);
        case 'price-high':
          return (b.priceValue || 0) - (a.priceValue || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [initialListings, searchQuery, selectedCategory, sortBy, priceRange]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(category => {
      counts[category] = initialListings.filter(listing => listing.category === category).length;
    });
    return counts;
  }, [initialListings]);

  const totalServices = filteredListings.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing <span className="gradient-text">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From stunning venues to professional photographers, find everything you need to make your event perfect.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for services, locations, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Category Overview */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card
                key={category}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedCategory === category ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-2xl mb-2">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="font-semibold mb-1">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryCounts[category]} services
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-card rounded-lg border">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category} ({categoryCounts[category]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                <SelectItem value="over-10000">Over $10,000</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">
              {totalServices} service{totalServices !== 1 ? 's' : ''} found
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </h3>
            {searchQuery && (
              <Badge variant="secondary">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>

          {/* Services Grid/List */}
          {filteredListings.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange('all');
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredListings.map((listing) => (
                <VenueCard
                  key={listing.id}
                  {...listing}
                  isCard={viewMode === 'grid'}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Helper function to get category icons
function getCategoryIcon(category: string) {
  switch (category) {
    case 'Venue':
      return '🏛️';
    case 'Catering':
      return '🍽️';
    case 'Photography':
      return '📸';
    case 'Transport':
      return '🚗';
    case 'Decorations':
      return '🎨';
    case 'Legal':
      return '⚖️';
    case 'Music':
      return '🎵';
    case 'Invitations':
      return '✉️';
    case 'Planner':
      return '📋';
    case 'Event Staff':
      return '👥';
    default:
      return '✨';
  }
}
