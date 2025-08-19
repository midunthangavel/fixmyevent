// Cost-Optimized AI Service with multiple fallback strategies
// This service prioritizes free/local AI while maintaining paid options as fallbacks

import { z } from 'zod';

// Enhanced AI Provider Configuration
interface AIProviderConfig {
  primary: 'local' | 'huggingface' | 'openai' | 'claude';
  fallback: 'local' | 'huggingface' | 'openai' | 'claude';
  apiKeys: {
    openai?: string;
    claude?: string;
    huggingface?: string;
  };
  models: {
    local: string;
    openai: string;
    claude: string;
    huggingface: string;
  };
  enableCaching: boolean;
  maxCacheSize: number;
}

// AI Response Cache for cost optimization
class AICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: string, data: any, ttl: number = 3600000) { // 1 hour default
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Cost-Optimized AI Service
export class CostOptimizedAIService {
  private config: AIProviderConfig;
  private cache: AICache;
  private isLocalAIAvailable: boolean = false;

  constructor(config: AIProviderConfig) {
    this.config = config;
    this.cache = new AICache(config.maxCacheSize);
    this.checkLocalAIAvailability();
  }

  /**
   * Generate event ideas with cost optimization
   */
  async generateEventIdeas(preferences: {
    eventType: string;
    budget: number;
    guestCount: number;
    additionalInfo?: string;
    location?: string;
    date?: string;
  }) {
    const cacheKey = `event_ideas_${JSON.stringify(preferences)}`;
    
    // Check cache first
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      // Try primary AI provider
      const response = await this.callAI(this.buildEventIdeasPrompt(preferences), this.config.primary);
      const result = this.parseEventIdeasResponse(response, preferences);
      
      // Cache the result
      if (this.config.enableCaching) {
        this.cache.set(cacheKey, result, 1800000); // 30 minutes
      }
      
      return result;
    } catch (error) {
      console.error('Primary AI failed, trying fallback:', error);
      
      try {
        // Try fallback AI provider
        const response = await this.callAI(this.buildEventIdeasPrompt(preferences), this.config.fallback);
        const result = this.parseEventIdeasResponse(response, preferences);
        
        if (this.config.enableCaching) {
          this.cache.set(cacheKey, result, 1800000);
        }
        
        return result;
      } catch (fallbackError) {
        console.error('All AI providers failed, using fallback data:', fallbackError);
        return this.getFallbackEventIdeas(preferences);
      }
    }
  }

  /**
   * Smart venue recommendations with cost optimization
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
    const cacheKey = `venue_recs_${JSON.stringify(criteria)}`;
    
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await this.callAI(this.buildVenueRecommendationsPrompt(criteria), this.config.primary);
      const result = this.parseVenueRecommendationsResponse(response, criteria);
      
      if (this.config.enableCaching) {
        this.cache.set(cacheKey, result, 3600000); // 1 hour for venue data
      }
      
      return result;
    } catch (error) {
      try {
        const response = await this.callAI(this.buildVenueRecommendationsPrompt(criteria), this.config.fallback);
        const result = this.parseVenueRecommendationsResponse(response, criteria);
        
        if (this.config.enableCaching) {
          this.cache.set(cacheKey, result, 3600000);
        }
        
        return result;
      } catch (fallbackError) {
        return this.getFallbackVenueRecommendations(criteria);
      }
    }
  }

  /**
   * Natural language search processing
   */
  async processNaturalLanguageQuery(query: string) {
    const cacheKey = `nlp_${query.toLowerCase().replace(/\s+/g, '_')}`;
    
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
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

      const response = await this.callAI(prompt, this.config.primary);
      const result = this.parseNaturalLanguageResponse(response);
      
      if (this.config.enableCaching) {
        this.cache.set(cacheKey, result, 7200000); // 2 hours for NLP parsing
      }
      
      return result;
    } catch (error) {
      try {
        const response = await this.callAI(prompt, this.config.fallback);
        const result = this.parseNaturalLanguageResponse(response);
        
        if (this.config.enableCaching) {
          this.cache.set(cacheKey, result, 7200000);
        }
        
        return result;
      } catch (fallbackError) {
        return this.parseNaturalLanguageQuery(query);
      }
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
    const cacheKey = `moodboard_${JSON.stringify(eventDetails)}`;
    
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await this.callAI(this.buildMoodBoardPrompt(eventDetails), this.config.primary);
      const result = this.parseMoodBoardResponse(response, eventDetails);
      
      if (this.config.enableCaching) {
        this.cache.set(cacheKey, result, 7200000); // 2 hours for mood boards
      }
      
      return result;
    } catch (error) {
      try {
        const response = await this.callAI(this.buildMoodBoardPrompt(eventDetails), this.config.fallback);
        const result = this.parseMoodBoardResponse(response, eventDetails);
        
        if (this.config.enableCaching) {
          this.cache.set(cacheKey, result, 7200000);
        }
        
        return result;
      } catch (fallbackError) {
        return this.getFallbackMoodBoard(eventDetails);
      }
    }
  }

  /**
   * Budget optimization with AI insights
   */
  async getAIBudgetOptimization(budget: number, eventType: string, guestCount: number, location: string) {
    const cacheKey = `budget_${budget}_${eventType}_${guestCount}_${location}`;
    
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await this.callAI(this.buildBudgetOptimizationPrompt(budget, eventType, guestCount, location), this.config.primary);
      const result = this.parseBudgetResponse(response, budget, eventType, guestCount);
      
      if (this.config.enableCaching) {
        this.cache.set(cacheKey, result, 86400000); // 24 hours for budget data
      }
      
      return result;
    } catch (error) {
      try {
        const response = await this.callAI(this.buildBudgetOptimizationPrompt(budget, eventType, guestCount, location), this.config.fallback);
        const result = this.parseBudgetResponse(response, budget, eventType, guestCount);
        
        if (this.config.enableCaching) {
          this.cache.set(cacheKey, result, 86400000);
        }
        
        return result;
      } catch (fallbackError) {
        return this.getFallbackBudgetSuggestions(budget, eventType, guestCount);
      }
    }
  }

  // Private helper methods
  private async callAI(prompt: string, provider: string): Promise<string> {
    switch (provider) {
      case 'local':
        return this.callLocalAI(prompt);
      case 'huggingface':
        return this.callHuggingFace(prompt);
      case 'openai':
        return this.callOpenAI(prompt);
      case 'claude':
        return this.callClaude(prompt);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  private async callLocalAI(prompt: string): Promise<string> {
    if (!this.isLocalAIAvailable) {
      throw new Error('Local AI not available');
    }

    try {
      // Try Ollama first (most common local AI)
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.models.local,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Local AI error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || '';
    } catch (error) {
      // Try alternative local AI endpoints
      try {
        const response = await fetch('/api/local-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
          throw new Error('Local AI service error');
        }

        const data = await response.json();
        return data.response || '';
      } catch (fallbackError) {
        throw new Error(`Local AI failed: ${error.message}`);
      }
    }
  }

  private async callHuggingFace(prompt: string): Promise<string> {
    if (!this.config.apiKeys.huggingface) {
      throw new Error('Hugging Face API key not configured');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKeys.huggingface}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '';
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.config.apiKeys.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKeys.openai}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.models.openai,
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
    if (!this.config.apiKeys.claude) {
      throw new Error('Claude API key not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKeys.claude,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.models.claude,
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

  // Check if local AI is available
  private async checkLocalAIAvailability(): Promise<void> {
    try {
      const response = await fetch('http://localhost:11434/api/tags', { 
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      this.isLocalAIAvailable = response.ok;
    } catch {
      this.isLocalAIAvailable = false;
    }
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

  // Fallback methods
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

  // Cache management methods
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.cache.size,
      maxSize: this.cache.maxSize
    };
  }
}

// Export configured instances
export const createCostOptimizedAIService = (config: AIProviderConfig) => {
  return new CostOptimizedAIService(config);
};

// Default service with cost-optimized configuration
export const costOptimizedAIService = new CostOptimizedAIService({
  primary: 'local', // Start with free local AI
  fallback: 'huggingface', // Use free Hugging Face as fallback
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    claude: process.env.CLAUDE_API_KEY,
    huggingface: process.env.HUGGINGFACE_API_KEY,
  },
  models: {
    local: 'mistral', // Free local model
    openai: 'gpt-3.5-turbo', // Cheaper than GPT-4
    claude: 'claude-3-haiku-20240307', // Cheaper than Sonnet
    huggingface: 'mistralai/Mistral-7B-Instruct-v0.2',
  },
  enableCaching: true,
  maxCacheSize: 200,
});

// Legacy service for backward compatibility
export const aiService = costOptimizedAIService;
