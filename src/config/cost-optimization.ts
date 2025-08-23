// Cost Optimization Configuration
// This file centralizes all cost-saving settings and strategies

export interface CostOptimizationConfig {
  // AI Service Configuration
  ai: {
    primary: 'local' | 'huggingface' | 'openai' | 'claude';
    fallback: 'local' | 'huggingface' | 'openai' | 'claude';
    enableCaching: boolean;
    maxCacheSize: number;
    cacheTTL: {
      eventIdeas: number; // milliseconds
      venueRecommendations: number;
      naturalLanguage: number;
      moodBoard: number;
      budgetOptimization: number;
    };
    models: {
      local: string;
      openai: string;
      claude: string;
      huggingface: string;
    };
    costLimits: {
      maxMonthlySpend: number;
      maxRequestsPerDay: number;
      enableRateLimiting: boolean;
    };
  };

  // Database Configuration
  database: {
    primary: 'firebase';
    enableCaching: boolean;
    maxCacheSize: number;
    cacheTTL: number;
    enableOfflineMode: boolean;
  };

  // Payment Configuration
  payment: {
    primary: 'stripe' | 'square' | 'paypal';
    fallbacks: string[];
    enableLocalPayments: boolean;
    localPaymentMethods: string[];
    costOptimization: {
      enableAutomaticRouting: boolean;
      amountThresholds: {
        small: number; // Use Square for amounts under this
        medium: number; // Use Stripe for amounts under this
        large: number; // Use bank transfer for amounts over this
      };
      feeComparison: {
        stripe: { percentage: number; fixed: number };
        square: { percentage: number; fixed: number };
        paypal: { percentage: number; fixed: number };
        bankTransfer: { percentage: number; fixed: number };
      };
    };
  };

  // Hosting Configuration
  hosting: {
    primary: 'vercel';
    fallbacks: string[];
    enableImageOptimization: boolean;
    enableCodeSplitting: boolean;
    enableTreeShaking: boolean;
    enableCompression: boolean;
    enableCDN: boolean;
    enableFontOptimization: boolean;
    bundleAnalysis: boolean;
  };

  // Monitoring Configuration
  monitoring: {
    enableCostTracking: boolean;
    enablePerformanceMonitoring: boolean;
    enableErrorTracking: boolean;
    thresholds: {
      maxMonthlyCost: number;
      maxResponseTime: number;
      maxErrorRate: number;
    };
  };
}

// Default cost optimization configuration
export const defaultCostOptimizationConfig: CostOptimizationConfig = {
  ai: {
    primary: 'local',
    fallback: 'huggingface',
    enableCaching: true,
    maxCacheSize: 200,
    cacheTTL: {
      eventIdeas: 1800000, // 30 minutes
      venueRecommendations: 3600000, // 1 hour
      naturalLanguage: 7200000, // 2 hours
      moodBoard: 7200000, // 2 hours
      budgetOptimization: 86400000, // 24 hours
    },
    models: {
      local: 'mistral',
      openai: 'gpt-3.5-turbo', // Cheaper than GPT-4
      claude: 'claude-3-haiku-20240307', // Cheaper than Sonnet
      huggingface: 'mistralai/Mistral-7B-Instruct-v0.2',
    },
    costLimits: {
      maxMonthlySpend: 50, // $50/month max
      maxRequestsPerDay: 1000,
      enableRateLimiting: true,
    },
  },

  database: {
    primary: 'firebase',
    enableCaching: true,
    maxCacheSize: 100,
    cacheTTL: 3600000, // 1 hour
    enableOfflineMode: true,
  },

  payment: {
    primary: 'square',
    fallbacks: ['stripe', 'paypal'],
    enableLocalPayments: true,
    localPaymentMethods: ['local_cash', 'local_check', 'bank_transfer'],
    costOptimization: {
      enableAutomaticRouting: true,
      amountThresholds: {
        small: 1000, // $10 - use Square
        medium: 10000, // $100 - use Stripe
        large: 50000, // $500 - use bank transfer
      },
      feeComparison: {
        stripe: { percentage: 0.029, fixed: 30 },
        square: { percentage: 0.026, fixed: 10 },
        paypal: { percentage: 0.029, fixed: 30 },
        bankTransfer: { percentage: 0, fixed: 3 },
      },
    },
  },

  hosting: {
    primary: 'vercel',
    fallbacks: ['netlify', 'github-pages'],
    enableImageOptimization: true,
    enableCodeSplitting: true,
    enableTreeShaking: true,
    enableCompression: true,
    enableCDN: true,
    enableFontOptimization: true,
    bundleAnalysis: false, // Disable in production to save build time
  },

  monitoring: {
    enableCostTracking: true,
    enablePerformanceMonitoring: true,
    enableErrorTracking: true,
    thresholds: {
      maxMonthlyCost: 100,
      maxResponseTime: 2000, // 2 seconds
      maxErrorRate: 0.01, // 1%
    },
  },
};

// Environment-specific configurations
export const getCostOptimizationConfig = (): CostOptimizationConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'development':
      return {
        ...defaultCostOptimizationConfig,
        ai: {
          ...defaultCostOptimizationConfig.ai,
          primary: 'local',
          fallback: 'huggingface',
          costLimits: {
            ...defaultCostOptimizationConfig.ai.costLimits,
            maxMonthlySpend: 10, // Lower limit for development
          },
        },
        database: {
          ...defaultCostOptimizationConfig.database,
          primary: 'firebase',
        },
        hosting: {
          ...defaultCostOptimizationConfig.hosting,
          primary: 'vercel',
        },
      };

    case 'production':
      return {
        ...defaultCostOptimizationConfig,
        ai: {
          ...defaultCostOptimizationConfig.ai,
          primary: 'huggingface', // Use free tier in production
          fallback: 'local',
          costLimits: {
            ...defaultCostOptimizationConfig.ai.costLimits,
            maxMonthlySpend: 25, // Conservative limit for production
          },
        },
        database: {
          ...defaultCostOptimizationConfig.database,
          primary: 'firebase', // Use Firebase
        },
        monitoring: {
          ...defaultCostOptimizationConfig.monitoring,
          enableCostTracking: true,
          thresholds: {
            ...defaultCostOptimizationConfig.monitoring.thresholds,
            maxMonthlyCost: 50, // Strict limit for production
          },
        },
      };

    case 'test':
      return {
        ...defaultCostOptimizationConfig,
        ai: {
          ...defaultCostOptimizationConfig.ai,
          primary: 'local',
          fallback: 'local',
          costLimits: {
            ...defaultCostOptimizationConfig.ai.costLimits,
            maxMonthlySpend: 0, // No cost for testing
          },
        },
        database: {
          ...defaultCostOptimizationConfig.database,
          primary: 'firebase',
          enableCaching: false, // Disable caching for tests
        },
        monitoring: {
          ...defaultCostOptimizationConfig.monitoring,
          enableCostTracking: false,
          enablePerformanceMonitoring: false,
        },
      };

    default:
      return defaultCostOptimizationConfig;
  }
};

// Cost calculation utilities
export class CostCalculator {
  /**
   * Calculate AI service costs
   */
  static calculateAICosts(
    requests: number,
    provider: string,
    _model: string
  ): number {
    const costPerRequest = {
      'local': 0,
      'huggingface': 0.0001,
      'openai': 0.002,
      'claude': 0.0008,
    };

    const cost = costPerRequest[provider as keyof typeof costPerRequest] || 0;
    return requests * cost;
  }

  /**
   * Calculate database costs
   */
  static calculateDatabaseCosts(
    storageGB: number,
    requests: number,
    provider: string
  ): number {
    const costs = {
      firebase: {
        storage: 0.026, // $0.026 per GB
        requests: 0.0000006, // $0.0000006 per document read
      },
    };

    const providerCosts = costs[provider as keyof typeof costs];
    if (!providerCosts) return 0;

    const storageCost = Math.max(0, storageGB - 0.5) * providerCosts.storage;
    const requestCost = Math.max(0, requests - 50000) * providerCosts.requests;

    return storageCost + requestCost;
  }

  /**
   * Calculate hosting costs
   */
  static calculateHostingCosts(
    bandwidthGB: number,
    buildMinutes: number,
    provider: string
  ): number {
    const costs = {
      vercel: {
        bandwidth: 0.15, // $0.15 per GB
        build: 0.002, // $0.002 per minute
      },
      netlify: {
        bandwidth: 0.15, // $0.15 per GB
        build: 0.002, // $0.002 per minute
      },
      'github-pages': {
        bandwidth: 0, // Free
        build: 0, // Free
      },
    };

    const providerCosts = costs[provider as keyof typeof costs];
    if (!providerCosts) return 0;

    const bandwidthCost = Math.max(0, bandwidthGB - 100) * providerCosts.bandwidth;
    const buildCost = Math.max(0, buildMinutes - 300) * providerCosts.build;

    return bandwidthCost + buildCost;
  }

  /**
   * Calculate total monthly costs
   */
  static calculateTotalMonthlyCosts(
    aiRequests: number,
    aiProvider: string,
    _aiModel: string,
    dbStorageGB: number,
    dbRequests: number,
    dbProvider: string,
    hostingBandwidthGB: number,
    hostingBuildMinutes: number,
    hostingProvider: string
  ): number {
    const aiCosts = this.calculateAICosts(aiRequests, aiProvider, _aiModel);
    const dbCosts = this.calculateDatabaseCosts(dbStorageGB, dbRequests, dbProvider);
    const hostingCosts = this.calculateHostingCosts(hostingBandwidthGB, hostingBuildMinutes, hostingProvider);

    return aiCosts + dbCosts + hostingCosts;
  }

  /**
   * Check if costs exceed limits
   */
  static checkCostLimits(
    currentCosts: number,
    limits: CostOptimizationConfig
  ): { exceeded: boolean; warnings: string[] } {
    const warnings: string[] = [];
    let exceeded = false;

    if (currentCosts > limits.monitoring.thresholds.maxMonthlyCost) {
      exceeded = true;
      warnings.push(`Monthly costs ($${currentCosts.toFixed(2)}) exceed limit ($${limits.monitoring.thresholds.maxMonthlyCost})`);
    }

    if (currentCosts > limits.monitoring.thresholds.maxMonthlyCost * 0.8) {
      warnings.push(`Monthly costs are approaching limit (${((currentCosts / limits.monitoring.thresholds.maxMonthlyCost) * 100).toFixed(1)}%)`);
    }

    return { exceeded, warnings };
  }
}

// Export the configuration
export const costOptimizationConfig = getCostOptimizationConfig();
