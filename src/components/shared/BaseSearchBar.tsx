'use client';

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { BaseSearchFilters } from '@/types/shared';

export interface BaseSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string, filters?: BaseSearchFilters) => void;
  onFiltersChange?: (filters: BaseSearchFilters) => void;
  showFilters?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'expanded';
}

export function BaseSearchBar({
  placeholder = 'Search venues, services...',
  onSearch,
  onFiltersChange,
  showFilters = false,
  className,
  size = 'md',
  variant = 'default',
}: BaseSearchBarProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<BaseSearchFilters>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch?.(query, filters);
  }, [query, filters, onSearch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleFiltersChange = useCallback((newFilters: Partial<BaseSearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  }, [filters, onFiltersChange]);

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-14 px-6 text-lg',
  };

  const variantClasses = {
    default: 'bg-background border border-border shadow-sm',
    minimal: 'bg-transparent border-b border-border',
    expanded: 'bg-background border border-border shadow-lg',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Main Search Input */}
      <div className={cn(
        'relative flex items-center rounded-lg transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size]
      )}>
        {/* Search Icon */}
        <svg
          className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="ml-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Search
        </button>

        {/* Filters Toggle */}
        {showFilters && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && isExpanded && (
        <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State"
                value={filters.location || ''}
                onChange={(e) => handleFiltersChange({ location: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Guest Count Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Guests
              </label>
              <input
                type="number"
                placeholder="Number of guests"
                value={filters.guestCount || ''}
                onChange={(e) => handleFiltersChange({ guestCount: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.min || ''}
                  onChange={(e) => handleFiltersChange({
                    priceRange: {
                      min: parseInt(e.target.value) || 0,
                      max: filters.priceRange?.max || 1000
                    }
                  })}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.max || ''}
                  onChange={(e) => handleFiltersChange({
                    priceRange: {
                      min: filters.priceRange?.min || 0,
                      max: parseInt(e.target.value) || 1000
                    }
                  })}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating || ''}
                onChange={(e) => handleFiltersChange({ rating: parseInt(e.target.value) || undefined })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
                <option value="5">5 stars</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-border">
            <button
              onClick={() => {
                setFilters({});
                onFiltersChange?.({});
              }}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

