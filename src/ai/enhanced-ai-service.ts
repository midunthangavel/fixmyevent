// Enhanced AI service with real AI provider integration
// This file should only be imported in API routes or server components

import { z } from 'zod';

// AI Provider Configuration
interface AIProviderConfig {
  provider: 'openai' | 'claude' | 'local';
  apiKey?: string;
  model?: string;
  baseURL?: string;
}

// Enhanced AI Service with real provider integration
export class EnhancedAIService {
  private config: AIProviderConfig;
  private isConfigured: boolean = false;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.isConfigured = !!config.apiKey || config.provider === 'local';
  }

  /**
   * Generate event ideas using real AI
   */
  async generateEventIdeas(preferences: {
    eventType: string;
    budget: number;
    guestCount: number;
    additionalInfo?: string;
    location?: string;
    date?: string;
  }) {
    try {
      if (!this.isConfigured) {
        return this.getFallbackEventIdeas(preferences);
      }

      const prompt = this.buildEventIdeasPrompt(preferences);
      const response = await this.callAI(prompt);
      
      return this.parseEventIdeasResponse(response, preferences);
    } catch (error) {
      // Log error properly and re-throw for proper error handling
      throw new Error(`Failed to generate event ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Smart venue recommendations based on AI analysis
   */
  async getSmartVenueRecommendations(criteria: {
    location: string;
    eventType: string;
    guestCount: number;
    budget: number;
    date: string;
    preferences?: string[];
    style?: string;
  }) {
    try {
      if (!this.isConfigured) {
        return this.getFallbackVenueRecommendations(criteria);
      }

      const prompt = this.buildVenueRecommendationsPrompt(criteria);
      const response = await this.callAI(prompt);
      
      return this.parseVenueRecommendationsResponse(response, criteria);
    } catch (error) {
      // Log error properly and re-throw for proper error handling
      throw new Error(`Failed to get venue recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Natural language search processing
   */
  async processNaturalLanguageQuery(query: string) {
    try {
      if (!this.isConfigured) {
        return this.parseNaturalLanguageQuery(query);
      }

      const prompt = `Parse this natural language venue search query and extract structured data:
      Query: "${query}"
      
      Extract:
      - Event type
      - Location
      - Guest count
      - Budget range
      - Date preferences
      - Style preferences
      - Special requirements
      
      Return as JSON.`;

      const response = await this.callAI(prompt);
      return this.parseNaturalLanguageResponse(response);
    } catch (error) {
      // Log error properly and re-throw for proper error handling
      throw new Error(`Failed to process natural language query: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate personalized mood board
   */
  async generatePersonalizedMoodBoard(eventDetails: {
    eventType: string;
    theme: string;
    colorPalette: string[];
    style: string;
    budget: number;
    guestCount: number;
  }) {
    try {
      if (!this.isConfigured) {
        return this.getFallbackMoodBoard(eventDetails);
      }

      const prompt = this.buildMoodBoardPrompt(eventDetails);
      const response = await this.callAI(prompt);
      
      return this.parseMoodBoardResponse(response, eventDetails);
    } catch (error) {
      // Log error properly and re-throw for proper error handling
      throw new Error(`Failed to generate mood board: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Budget optimization with AI insights
   */
  async getAIBudgetOptimization(budget: number, eventType: string, guestCount: number, location: string) {
    try {
      if (!this.isConfigured) {
        return this.getFallbackBudgetSuggestions(budget, eventType, guestCount);
      }

      const prompt = this.buildBudgetOptimizationPrompt(budget, eventType, guestCount, location);
      const response = await this.callAI(prompt);
      
      return this.parseBudgetResponse(response, budget, eventType, guestCount);
    } catch (error) {
      // Log error properly and re-throw for proper error handling
      throw new Error(`Failed to get budget optimization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods
  private async callAI(prompt: string): Promise<string> {
    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'claude':
        return this.callClaude(prompt);
      case 'local':
        return this.callLocalAI(prompt);
      default:
        throw new Error('Unsupported AI provider');
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async callClaude(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  private async callLocalAI(prompt: string): Promise<string> {
    // For local AI models (e.g., Ollama, local LLM)
    // This would connect to your local AI service
    const response = await fetch('/api/local-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Local AI service error');
    }

    const data = await response.json();
    return data.response || '';
  }

  // Prompt building methods
  private buildEventIdeasPrompt(preferences: any): string {
    return `Generate creative event ideas for a ${preferences.eventType} with ${preferences.guestCount} guests and a budget of $${preferences.budget}.
    
    Location: ${preferences.location || 'Not specified'}
    Date: ${preferences.date || 'Not specified'}
    Additional Info: ${preferences.additionalInfo || 'None'}
    
    Provide:
    1. 3 unique event concepts with names
    2. Detailed descriptions
    3. Estimated costs
    4. Key features
    5. Practical tips
    6. Theme suggestions
    
    Format as structured JSON.`;
  }

  private buildVenueRecommendationsPrompt(criteria: any): string {
    return `Recommend the best venues for a ${criteria.eventType} in ${criteria.location} with ${criteria.guestCount} guests and $${criteria.budget} budget.
    
    Date: ${criteria.date}
    Style: ${criteria.style || 'Not specified'}
    Preferences: ${criteria.preferences?.join(', ') || 'None'}
    
    Provide:
    1. Top 5 venue recommendations
    2. Why each venue is perfect
    3. Pricing breakdown
    4. Availability considerations
    5. Special features
    
    Format as structured JSON.`;
  }

  private buildMoodBoardPrompt(eventDetails: any): string {
    return `Create a detailed mood board description for a ${eventDetails.eventType} with ${eventDetails.theme} theme.
    
    Colors: ${eventDetails.colorPalette.join(', ')}
    Style: ${eventDetails.style}
    Budget: $${eventDetails.budget}
    Guests: ${eventDetails.guestCount}
    
    Include:
    1. Visual elements
    2. Color schemes
    3. Materials and textures
    4. Lighting concepts
    5. Decorative items
    6. Atmosphere description
    
    Format as structured JSON.`;
  }

  private buildBudgetOptimizationPrompt(budget: number, eventType: string, guestCount: number, location: string): string {
    return `Optimize a $${budget} budget for a ${eventType} with ${guestCount} guests in ${location}.
    
    Provide:
    1. Detailed cost breakdown
    2. Money-saving strategies
    3. Priority spending areas
    4. Negotiation tips
    5. Seasonal considerations
    6. Package deal opportunities
    
    Format as structured JSON.`;
  }

  // Fallback methods for when AI is not available
  private getFallbackEventIdeas(preferences: any) {
    return {
      theme: "Elegant Garden & Urban Chic",
      decoration: "Mix of natural elements and modern touches",
      activity: "Live entertainment with interactive elements",
      ideas: [
        {
          name: "Garden Party Extravaganza",
          description: "An elegant outdoor celebration with floral decorations and ambient lighting",
          estimatedCost: preferences.budget * 0.8,
          keyFeatures: ["Outdoor venue", "Floral arrangements", "String lighting", "Live music"],
          tips: ["Book early for outdoor venues", "Have a rain backup plan", "Consider seasonal flowers"]
        },
        {
          name: "Urban Rooftop Soiree",
          description: "A sophisticated city gathering with skyline views and modern amenities",
          estimatedCost: preferences.budget * 0.9,
          keyFeatures: ["Rooftop venue", "City views", "Modern decor", "Cocktail service"],
          tips: ["Check weather forecasts", "Plan for wind considerations", "Book sunset timing"]
        }
      ]
    };
  }

  private getFallbackVenueRecommendations(criteria: any) {
    return {
      recommendations: [
        {
          name: "Grand Ballroom",
          description: "Perfect for large events with elegant atmosphere",
          estimatedCost: criteria.budget * 0.4,
          features: ["Large capacity", "Professional catering", "Parking available"],
          availability: "Check for specific dates"
        }
      ]
    };
  }

  private getFallbackMoodBoard(eventDetails: any) {
    return {
      description: `A beautiful mood board for your ${eventDetails.eventType} featuring ${eventDetails.theme} theme with ${eventDetails.colorPalette.join(', ')} colors in a ${eventDetails.style} style.`,
      elements: ["Elegant decor", "Atmospheric lighting", "Sophisticated materials"]
    };
  }

  private getFallbackBudgetSuggestions(budget: number, eventType: string, guestCount: number) {
    return {
      breakdown: {
        venue: budget * 0.4,
        catering: budget * 0.3,
        entertainment: budget * 0.15,
        decor: budget * 0.1,
        miscellaneous: budget * 0.05
      },
      tips: ["Book off-peak seasons", "Consider buffet-style catering", "DIY some decorations"]
    };
  }

  // Response parsing methods
  private parseEventIdeasResponse(response: string, preferences: any) {
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      return this.getFallbackEventIdeas(preferences);
    }
  }

  private parseVenueRecommendationsResponse(response: string, criteria: any) {
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      return this.getFallbackVenueRecommendations(criteria);
    }
  }

  private parseMoodBoardResponse(response: string, eventDetails: any) {
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      return this.getFallbackMoodBoard(eventDetails);
    }
  }

  private parseBudgetResponse(response: string, budget: number, eventType: string, guestCount: number) {
    try {
      const parsed = JSON.parse(response);
      return parsed;
    } catch {
      return this.getFallbackBudgetSuggestions(budget, eventType, guestCount);
    }
  }

  private parseNaturalLanguageQuery(query: string) {
    // Basic natural language parsing without AI
    const eventTypes = ['wedding', 'birthday', 'corporate', 'party', 'conference', 'meeting'];
    const locations = ['downtown', 'suburban', 'outdoor', 'indoor', 'beach', 'mountain'];
    
    const extracted = {
      eventType: eventTypes.find(type => query.toLowerCase().includes(type)) || 'event',
      location: locations.find(loc => query.toLowerCase().includes(loc)) || 'anywhere',
      guestCount: this.extractNumber(query),
      budget: this.extractBudget(query),
      date: this.extractDate(query),
      style: this.extractStyle(query)
    };

    return extracted;
  }

  private parseNaturalLanguageResponse(response: string) {
    try {
      return JSON.parse(response);
    } catch {
      return { error: 'Failed to parse AI response' };
    }
  }

  // Utility methods
  private extractNumber(text: string): number {
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : 50;
  }

  private extractBudget(text: string): number {
    const match = text.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 5000;
  }

  private extractDate(text: string): string {
    const dateMatch = text.match(/(\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2}|tomorrow|next week|next month)/i);
    return dateMatch ? dateMatch[1] : '';
  }

  private extractStyle(text: string): string {
    const styles = ['elegant', 'casual', 'formal', 'rustic', 'modern', 'vintage', 'romantic'];
    return styles.find(style => text.toLowerCase().includes(style)) || 'elegant';
  }
}

// Export configured instances
export const createAIService = (config: AIProviderConfig) => {
  return new EnhancedAIService(config);
};

// Default service with environment-based configuration
export const aiService = new EnhancedAIService({
  provider: (process.env.AI_PROVIDER as 'openai' | 'claude' | 'local') || 'local',
  apiKey: process.env.AI_API_KEY,
  model: process.env.AI_MODEL,
  baseURL: process.env.AI_BASE_URL,
});
