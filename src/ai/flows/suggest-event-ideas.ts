// Event Ideas Flow Definition
// This file defines the structure for event idea generation
// The actual AI processing happens in the API routes

export interface EventIdeaPreferences {
  eventType: string;
  budget: number;
  guestCount: number;
  location: string;
  theme?: string;
  season?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  formality?: 'casual' | 'semi-formal' | 'formal' | 'black-tie';
}

export interface EventIdea {
  name: string;
  description: string;
  estimatedCost: number;
  keyFeatures: string[];
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeToPlan: string;
  uniqueAspects: string[];
}

export interface EventIdeasResponse {
  ideas: EventIdea[];
  totalCost: number;
  recommendations: string[];
  nextSteps: string[];
}

// Flow configuration
export const eventIdeasFlow = {
  name: 'event-ideas-generator',
  description: 'Generate creative event ideas based on user preferences',
  inputSchema: {
    type: 'object',
    properties: {
      eventType: { type: 'string', description: 'Type of event (wedding, birthday, corporate, etc.)' },
      budget: { type: 'number', description: 'Total budget in dollars' },
      guestCount: { type: 'number', description: 'Number of guests' },
      location: { type: 'string', description: 'Event location or city' },
      theme: { type: 'string', description: 'Preferred theme or style' },
      season: { type: 'string', description: 'Season for the event' },
      timeOfDay: { type: 'string', enum: ['morning', 'afternoon', 'evening', 'night'] },
      formality: { type: 'string', enum: ['casual', 'semi-formal', 'formal', 'black-tie'] },
    },
    required: ['eventType', 'budget', 'guestCount', 'location'],
  },
  outputSchema: {
    type: 'object',
    properties: {
      ideas: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            estimatedCost: { type: 'number' },
            keyFeatures: { type: 'array', items: { type: 'string' } },
            tips: { type: 'array', items: { type: 'string' } },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            timeToPlan: { type: 'string' },
            uniqueAspects: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      totalCost: { type: 'number' },
      recommendations: { type: 'array', items: { type: 'string' } },
      nextSteps: { type: 'array', items: { type: 'string' } },
    },
  },
};

// Helper functions for processing event ideas
export function processEventIdeas(rawIdeas: any[]): EventIdea[] {
  return rawIdeas.map((idea, index) => ({
    name: idea.name || `Event Idea ${index + 1}`,
    description: idea.description || 'A creative event concept',
    estimatedCost: idea.estimatedCost || 0,
    keyFeatures: Array.isArray(idea.keyFeatures) ? idea.keyFeatures : [],
    tips: Array.isArray(idea.tips) ? idea.tips : [],
    difficulty: idea.difficulty || 'medium',
    timeToPlan: idea.timeToPlan || '2-4 weeks',
    uniqueAspects: Array.isArray(idea.uniqueAspects) ? idea.uniqueAspects : [],
  }));
}

export function calculateTotalCost(ideas: EventIdea[]): number {
  return ideas.reduce((total, idea) => total + idea.estimatedCost, 0);
}

export function generateRecommendations(preferences: EventIdeaPreferences, ideas: EventIdea[]): string[] {
  const recommendations: string[] = [];
  
  if (preferences.budget < 1000) {
    recommendations.push('Consider DIY elements to stay within budget');
  }
  
  if (preferences.guestCount > 100) {
    recommendations.push('Large guest lists work well with buffet-style catering');
  }
  
  if (preferences.theme) {
    recommendations.push(`Embrace the ${preferences.theme} theme throughout all event elements`);
  }
  
  return recommendations;
}
