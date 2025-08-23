'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Mic, 
  MicOff, 
  X,
  History,
  TrendingUp
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  filters?: Record<string, any>;
}

interface EnhancedSearchProps {
  onSearch: (query: string, filters?: Record<string, any>) => void;
  onVoiceSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function EnhancedSearch({ 
  onSearch, 
  onVoiceSearch, 
  placeholder = "Search venues, locations, or keywords...",
  className = ""
}: EnhancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>('search-history', []);
  const [showHistory, setShowHistory] = useState(false);

  
  const recognitionRef = useRef<any>(null);

  // Popular search suggestions
  const popularSearches = [
    "Wedding venues in New York",
    "Corporate event spaces",
    "Outdoor wedding locations",
    "Budget-friendly venues",
    "Luxury event spaces"
  ];

  // Recent searches (last 5)
  const recentSearches = searchHistory.slice(0, 5);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        if (onVoiceSearch) {
          onVoiceSearch(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onVoiceSearch]);

  const startVoiceSearch = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Add to search history
    const newHistoryItem: SearchHistoryItem = {
      query: searchQuery,
      timestamp: Date.now()
    };
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query !== searchQuery);
      return [newHistoryItem, ...filtered].slice(0, 10); // Keep last 10 searches
    });

    onSearch(searchQuery);
    setShowHistory(false);
  };

  const handleHistoryItemClick = (item: SearchHistoryItem) => {
    setSearchQuery(item.query);
    onSearch(item.query, item.filters);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const removeHistoryItem = (index: number) => {
    setSearchHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowHistory(true)}
            className="pl-10 pr-20"
          />
          
          {/* Voice Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={isListening ? stopVoiceSearch : startVoiceSearch}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
              isListening 
                ? 'text-red-500 animate-pulse' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            disabled={!recognitionRef.current}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>

        <Button onClick={handleSearch} className="px-6">
          Search
        </Button>
      </div>

      {/* Search History & Suggestions Popover */}
      {showHistory && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Recent Searches
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.query}
                      </span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHistoryItem(index);
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => {
                      setSearchQuery(search);
                      onSearch(search);
                      setShowHistory(false);
                    }}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Search Status */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-center">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Listening... Speak now</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}
