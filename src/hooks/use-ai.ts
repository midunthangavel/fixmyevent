import { useState } from 'react';

interface EventIdeasRequest {
  eventType: string;
  budget: number;
  guestCount: number;
  additionalInfo?: string;
}

interface MoodBoardRequest {
  prompt: string;
}

interface BudgetSuggestionRequest {
  budget: number;
}

interface VenueSearchRequest {
  location: string;
  eventType: string;
  guestCount: number;
  budget: number;
  date: string;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateEventIdeas = async (request: EventIdeasRequest): Promise<{ theme: string; decoration: string; activity: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/event-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate event ideas');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateMoodBoard = async (request: MoodBoardRequest): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/mood-board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to generate mood board');
      }

      const data = await response.json();
      return data.moodBoard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBudgetSuggestions = async (request: BudgetSuggestionRequest): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/budget-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to get budget suggestions');
      }

      const data = await response.json();
      return data.suggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchVenues = async (request: VenueSearchRequest): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/venue-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to search venues');
      }

      const data = await response.json();
      return data.venues;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    clearError,
    generateEventIdeas,
    generateMoodBoard,
    getBudgetSuggestions,
    searchVenues,
  };
}
