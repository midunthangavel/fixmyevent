'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Send,
  Palmtree,
  Search,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchWidgetProps {
  title?: string;
  subtitle?: string;
  onSearch?: (query: SearchQuery) => void;
  showSuggestions?: boolean;
  className?: string;
}

interface SearchQuery {
  destination: string;
  dates: string;
  guests: string;
}

export function SearchWidget({ 
  title = "Where to?",
  subtitle = "Find your perfect event venue",
  onSearch,
  showSuggestions = true,
  className 
}: SearchWidgetProps) {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    destination: '',
    dates: '',
    guests: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const suggestions = [
    {
      icon: Send,
      title: "Nearby",
      subtitle: "Find what's around you",
      category: "nearby"
    },
    {
      icon: Palmtree,
      title: "Pocono Mountains, PA",
      subtitle: "Popular lake destination",
      category: "mountain"
    },
    {
      icon: Palmtree,
      title: "Orlando, FL",
      subtitle: "For sights like Walt Disney World Resort",
      category: "city"
    },
    {
      icon: Palmtree,
      title: "Philadelphia, PA",
      subtitle: "For its top-notch dining",
      category: "city"
    }
  ];

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    setSearchQuery(prev => ({
      ...prev,
      destination: suggestion.title
    }));
    setIsExpanded(false);
  };

  const clearAll = () => {
    setSearchQuery({
      destination: '',
      dates: '',
      guests: ''
    });
  };

  return (
    <Card className={cn(
      "border-0 shadow-lg",
      "bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-800/95 dark:to-gray-800/90",
      "backdrop-blur-md",
      className
    )}>
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search Fields */}
        <div className="space-y-4">
          {/* Destination */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search destinations"
              value={searchQuery.destination}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, destination: e.target.value }))}
              onFocus={() => setIsExpanded(true)}
              className="pl-10 pr-4 py-3"
            />
          </div>

          {/* Dates */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Add dates"
              value={searchQuery.dates}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, dates: e.target.value }))}
              className="pl-10 pr-4 py-3"
            />
          </div>

          {/* Guests */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Add guests"
              value={searchQuery.guests}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, guests: e.target.value }))}
              className="pl-10 pr-4 py-3"
            />
          </div>
        </div>

        {/* Suggestions */}
        {showSuggestions && isExpanded && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Suggested destinations</div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150 text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{suggestion.title}</div>
                      <div className="text-xs text-muted-foreground">{suggestion.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            onClick={clearAll}
            className="text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </Button>
          
          <Button 
            onClick={handleSearch}
            className="px-8 py-3"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
