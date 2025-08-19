import { useState, useCallback } from 'react';
import type { SuggestEventIdeasOutput } from '@/ai/flows/suggest-event-ideas.types';

export interface PlannerState {
  loading: boolean;
  ideas: SuggestEventIdeasOutput | null;
  moodBoardLoading: boolean;
  moodBoardImage: string | null;
}

export function usePlannerState() {
  const [state, setState] = useState<PlannerState>({
    loading: false,
    ideas: null,
    moodBoardLoading: false,
    moodBoardImage: null,
  });
  
  const updateState = useCallback((updates: Partial<PlannerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
  
  const resetState = useCallback(() => {
    setState({
      loading: false,
      ideas: null,
      moodBoardLoading: false,
      moodBoardImage: null,
    });
  }, []);
  
  const setLoading = useCallback((loading: boolean) => {
    updateState({ loading });
  }, [updateState]);
  
  const setIdeas = useCallback((ideas: SuggestEventIdeasOutput | null) => {
    updateState({ ideas });
  }, [updateState]);
  
  const setMoodBoardLoading = useCallback((moodBoardLoading: boolean) => {
    updateState({ moodBoardLoading });
  }, [updateState]);
  
  const setMoodBoardImage = useCallback((moodBoardImage: string | null) => {
    updateState({ moodBoardImage });
  }, [updateState]);
  
  const clearIdeas = useCallback(() => {
    setIdeas(null);
  }, [setIdeas]);
  
  const clearMoodBoard = useCallback(() => {
    setMoodBoardImage(null);
  }, [setMoodBoardImage]);
  
  return {
    state,
    updateState,
    resetState,
    setLoading,
    setIdeas,
    setMoodBoardLoading,
    setMoodBoardImage,
    clearIdeas,
    clearMoodBoard,
  };
}
