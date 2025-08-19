
'use server';
/**
 * @fileOverview An AI agent for generating mood board images.
 * 
 * - generateMoodBoard: A function that generates an image based on a text prompt.
 */

import { GenerateMoodBoardInput, GenerateMoodBoardOutput } from './generate-mood-board.types';

// This function now works with the AI service through API routes
export async function generateMoodBoard(input: GenerateMoodBoardInput): Promise<GenerateMoodBoardOutput> {
  // For now, return a mock response
  // In production, this would call the AI service through the API
  return `https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80&prompt=${encodeURIComponent(input.prompt)}`;
}
