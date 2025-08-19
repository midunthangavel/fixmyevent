
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const MAX_PRICE = 30000;
const MIN_PRICE = 0;

interface FiltersProps {
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
  onFilterChange: (params: any) => void;
}

export function Filters({ searchParams, onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState({
    location: searchParams.location || '',
    category: searchParams.category || '',
    minPrice: Number(searchParams.minPrice) || MIN_PRICE,
    maxPrice: Number(searchParams.maxPrice) || MAX_PRICE,
    guestCapacity: searchParams.guestCapacity || '',
    amenities: Array.isArray(searchParams.amenities) ? searchParams.amenities : searchParams.amenities ? [searchParams.amenities] : [],
    sortBy: searchParams.sortBy || 'rating_desc'
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.minPrice) || MIN_PRICE,
    Number(searchParams.maxPrice) || MAX_PRICE
  ]);

  useEffect(() => {
    setFilters({
      location: searchParams.location || '',
      category: searchParams.category || '',
      minPrice: Number(searchParams.minPrice) || MIN_PRICE,
      maxPrice: Number(searchParams.maxPrice) || MAX_PRICE,
      guestCapacity: searchParams.guestCapacity || '',
      amenities: Array.isArray(searchParams.amenities) ? searchParams.amenities : searchParams.amenities ? [searchParams.amenities] : [],
      sortBy: searchParams.sortBy || 'rating_desc'
    });
    setPriceRange([
      Number(searchParams.minPrice) || MIN_PRICE,
      Number(searchParams.maxPrice) || MAX_PRICE
    ]);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update price range when min/max price changes
    if (key === 'minPrice' || key === 'maxPrice') {
      setPriceRange([newFilters.minPrice, newFilters.maxPrice]);
    }
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setFilters(prev => ({
      ...prev,
      minPrice: range[0],
      maxPrice: range[1]
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      category: '',
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      guestCapacity: '',
      amenities: [],
      sortBy: 'rating_desc'
    };
    setFilters(clearedFilters);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    onFilterChange(clearedFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== MIN_PRICE && value !== MAX_PRICE && 
    (!Array.isArray(value) || value.length > 0) && value !== 'rating_desc'
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine your search results</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter city or area"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Venue">Venues</SelectItem>
              <SelectItem value="Photography">Photography</SelectItem>
              <SelectItem value="Invitations">Invitations</SelectItem>
              <SelectItem value="Catering">Catering</SelectItem>
              <SelectItem value="Decorations">Decorations</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Planner">Event Planners</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={MAX_PRICE}
              min={MIN_PRICE}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Guest Capacity */}
        <div className="space-y-2">
          <Label htmlFor="guestCapacity">Minimum Guest Capacity</Label>
          <Input
            id="guestCapacity"
            type="number"
            placeholder="e.g., 50"
            value={filters.guestCapacity}
            onChange={(e) => handleFilterChange('guestCapacity', e.target.value)}
          />
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {['Parking', 'Catering', 'AV Equipment', 'WiFi', 'Outdoor Space', 'Kitchen', 'Bridal Suite', 'Accessibility'].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
              <SelectItem value="price_asc">Price (Low to High)</SelectItem>
              <SelectItem value="price_desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.location && (
                <Badge variant="secondary" className="gap-1">
                  Location: {filters.location}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('location', '')} />
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="gap-1">
                  Category: {filters.category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('category', '')} />
                </Badge>
              )}
              {filters.guestCapacity && (
                <Badge variant="secondary" className="gap-1">
                  Min Guests: {filters.guestCapacity}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('guestCapacity', '')} />
                </Badge>
              )}
              {filters.amenities.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  Amenities: {filters.amenities.length}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('amenities', [])} />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Apply Button */}
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
