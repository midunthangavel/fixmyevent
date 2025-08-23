'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mic, MicOff, Search, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NaturalLanguageQuery {
  eventType: string;
  location: string;
  guestCount: number;
  budget: number;
  date: string;
  style: string;
}

interface AIEnhancedSearchProps {
  onSearch: (query: NaturalLanguageQuery) => void;
  className?: string;
}

export function AIEnhancedSearch({ onSearch, className = "" }: AIEnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedQuery, setParsedQuery] = useState<NaturalLanguageQuery | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  // Example natural language queries
  const exampleQueries = [
    "Find me a romantic wedding venue for 100 people under $5000 in downtown",
    "I need a corporate meeting space for 20 people next week",
    "Looking for a birthday party venue for 50 guests under $2000",
    "Wedding venue for 150 people with garden views under $8000"
  ];

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Please type your query instead.",
        variant: "destructive"
      });
      return false;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      processNaturalLanguageQuery(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Speech recognition error",
        description: "Please try again or type your query instead.",
        variant: "destructive"
      });
    };

    return true;
  }, [toast]);

  // Start listening
  const startListening = useCallback(() => {
    if (initSpeechRecognition()) {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  }, [initSpeechRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    setIsListening(false);
    recognitionRef.current?.stop();
  }, []);

  // Process natural language query
  const processNaturalLanguageQuery = useCallback(async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/natural-language-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (!response.ok) {
        throw new Error('Failed to process query');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setParsedQuery(result.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error processing natural language query:', error);
      toast({
        title: "Error processing query",
        description: "Please try rephrasing your request or use the structured search instead.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Handle search submission
  const handleSearch = useCallback(() => {
    if (parsedQuery) {
      onSearch(parsedQuery);
      setShowSuggestions(false);
      setQuery('');
      setParsedQuery(null);
    } else if (query.trim()) {
      // Fallback to basic query processing
      processNaturalLanguageQuery(query);
    }
  }, [parsedQuery, onSearch, query, processNaturalLanguageQuery]);

  // Handle example query selection
  const handleExampleQuery = useCallback((example: string) => {
    setQuery(example);
    processNaturalLanguageQuery(example);
  }, [processNaturalLanguageQuery]);

  // Clear current query
  const clearQuery = useCallback(() => {
    setQuery('');
    setParsedQuery(null);
    setShowSuggestions(false);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI-Powered Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Try: 'Find me a romantic wedding venue for 100 people under $5000'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-20"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearQuery}
                  className="absolute right-16 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={handleSearch}
              disabled={isProcessing || (!query.trim() && !parsedQuery)}
              className="min-w-[100px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Example Queries */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleQuery(example)}
                  className="text-xs h-8"
                  disabled={isProcessing}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parsed Query Display */}
      {parsedQuery && showSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Understanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {parsedQuery.eventType}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {parsedQuery.location}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Guest Count</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {parsedQuery.guestCount}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Budget</p>
                <Badge variant="secondary" className="w-full justify-center">
                  ${parsedQuery.budget.toLocaleString()}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Style</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {parsedQuery.style}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <Badge variant="secondary" className="w-full justify-center">
                  {parsedQuery.date || 'Flexible'}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSearch} className="flex-1">
                Search with These Parameters
              </Button>
              <Button variant="outline" onClick={() => setShowSuggestions(false)}>
                Modify Query
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is analyzing your request...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
