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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Save, Bookmark, Filter, MapPin, Users, DollarSign, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useLocalStorage } from '@/hooks/use-local-storage';

const MAX_PRICE = 50000;
const MIN_PRICE = 0;

interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, any>;
  timestamp: number;
}

interface EnhancedFiltersProps {
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
  onFilterChange: (params: any) => void;
  onSaveSearch?: (name: string, filters: Record<string, any>) => void;
}

export function EnhancedFilters({ searchParams, onFilterChange, onSaveSearch }: EnhancedFiltersProps) {
  const [filters, setFilters] = useState({
    location: searchParams.location || '',
    category: searchParams.category || '',
    minPrice: Number(searchParams.minPrice) || MIN_PRICE,
    maxPrice: Number(searchParams.maxPrice) || MAX_PRICE,
    guestCapacity: searchParams.guestCapacity || '',
    amenities: Array.isArray(searchParams.amenities) ? searchParams.amenities : searchParams.amenities ? [searchParams.amenities] : [],
    sortBy: searchParams.sortBy || 'rating_desc',
    date: searchParams.date || '',
    rating: searchParams.rating || '',
    distance: searchParams.distance || ''
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.minPrice) || MIN_PRICE,
    Number(searchParams.maxPrice) || MAX_PRICE
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.date ? new Date(searchParams.date) : undefined
  );

  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('saved-searches', []);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

  // Enhanced amenities with categories
  const amenityCategories = {
    'Essential': ['Parking', 'WiFi', 'Restrooms', 'Kitchen', 'Accessibility'],
    'Entertainment': ['AV Equipment', 'Sound System', 'Projector', 'Dance Floor', 'Stage'],
    'Comfort': ['Air Conditioning', 'Heating', 'Bridal Suite', 'Groom Room', 'Coat Check'],
    'Outdoor': ['Garden', 'Terrace', 'Balcony', 'Outdoor Seating', 'Parking Lot'],
    'Services': ['Catering', 'Bar Service', 'Event Staff', 'Security', 'Valet Parking']
  };

  useEffect(() => {
    setFilters({
      location: searchParams.location || '',
      category: searchParams.category || '',
      minPrice: Number(searchParams.minPrice) || MIN_PRICE,
      maxPrice: Number(searchParams.maxPrice) || MAX_PRICE,
      guestCapacity: searchParams.guestCapacity || '',
      amenities: Array.isArray(searchParams.amenities) ? searchParams.amenities : searchParams.amenities ? [searchParams.amenities] : [],
      sortBy: searchParams.sortBy || 'rating_desc',
      date: searchParams.date || '',
      rating: searchParams.rating || '',
      distance: searchParams.distance || ''
    });
    setPriceRange([
      Number(searchParams.minPrice) || MIN_PRICE,
      Number(searchParams.maxPrice) || MAX_PRICE
    ]);
    setSelectedDate(searchParams.date ? new Date(searchParams.date) : undefined);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    handleFilterChange('date', date ? date.toISOString().split('T')[0] : '');
  };

  const saveCurrentSearch = () => {
    if (!saveSearchName.trim()) return;
    
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName.trim(),
      filters: { ...filters },
      timestamp: Date.now()
    };
    
    setSavedSearches(prev => [newSavedSearch, ...prev].slice(0, 10));
    setSaveSearchName('');
    setShowSaveDialog(false);
    
    if (onSaveSearch) {
      onSaveSearch(newSavedSearch.name, newSavedSearch.filters);
    }
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters({
      location: savedSearch.filters.location || '',
      category: savedSearch.filters.category || '',
      minPrice: savedSearch.filters.minPrice || MIN_PRICE,
      maxPrice: savedSearch.filters.maxPrice || MAX_PRICE,
      guestCapacity: savedSearch.filters.guestCapacity || '',
      amenities: savedSearch.filters.amenities || [],
      sortBy: savedSearch.filters.sortBy || 'rating_desc',
      date: savedSearch.filters.date || '',
      rating: savedSearch.filters.rating || '',
      distance: savedSearch.filters.distance || ''
    });
    setPriceRange([savedSearch.filters.minPrice || MIN_PRICE, savedSearch.filters.maxPrice || MAX_PRICE]);
    setSelectedDate(savedSearch.filters.date ? new Date(savedSearch.filters.date) : undefined);
    onFilterChange(savedSearch.filters);
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      category: '',
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      guestCapacity: '',
      amenities: [],
      sortBy: 'rating_desc',
      date: '',
      rating: '',
      distance: ''
    };
    setFilters(clearedFilters);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedDate(undefined);
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
    <div className="space-y-6">
      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Saved Searches
            </CardTitle>
            <CardDescription>Quick access to your favorite search combinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((savedSearch) => (
                <Badge
                  key={savedSearch.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 group"
                  onClick={() => loadSavedSearch(savedSearch)}
                >
                  <span className="mr-2">{savedSearch.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSavedSearch(savedSearch.id);
                    }}
                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              <CardDescription>Refine your search with detailed criteria</CardDescription>
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                disabled={!hasActiveFilters}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location & Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

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
          </div>

          {/* Date & Guest Capacity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Event Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestCapacity" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guest Capacity
              </Label>
              <Input
                id="guestCapacity"
                type="number"
                placeholder="e.g., 50"
                value={filters.guestCapacity}
                onChange={(e) => handleFilterChange('guestCapacity', e.target.value)}
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Range
            </Label>
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

          {/* Rating & Distance Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Minimum Rating
              </Label>
              <Select value={filters.rating} onValueChange={(value) => handleFilterChange('rating', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Rating</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  <SelectItem value="3.0">3.0+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Max Distance
              </Label>
              <Select value={filters.distance} onValueChange={(value) => handleFilterChange('distance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Distance</SelectItem>
                  <SelectItem value="5">Within 5 miles</SelectItem>
                  <SelectItem value="10">Within 10 miles</SelectItem>
                  <SelectItem value="25">Within 25 miles</SelectItem>
                  <SelectItem value="50">Within 50 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhanced Amenities */}
          <div className="space-y-4">
            <Label>Amenities</Label>
            {Object.entries(amenityCategories).map(([category, amenities]) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenities.map((amenity) => (
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
            ))}
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
                <SelectItem value="distance_asc">Distance (Nearest First)</SelectItem>
                <SelectItem value="date_asc">Date (Earliest First)</SelectItem>
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
                {filters.date && (
                  <Badge variant="secondary" className="gap-1">
                    Date: {filters.date}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('date', '')} />
                  </Badge>
                )}
                {filters.guestCapacity && (
                  <Badge variant="secondary" className="gap-1">
                    Min Guests: {filters.guestCapacity}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('guestCapacity', '')} />
                  </Badge>
                )}
                {filters.rating && (
                  <Badge variant="secondary" className="gap-1">
                    Rating: {filters.rating}+
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('rating', '')} />
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

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <Card>
          <CardHeader>
            <CardTitle>Save Search</CardTitle>
            <CardDescription>Save your current filter combination for quick access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchName">Search Name</Label>
              <Input
                id="searchName"
                placeholder="e.g., Wedding Venues NYC"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && saveCurrentSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveCurrentSearch} disabled={!saveSearchName.trim()}>
                Save Search
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
