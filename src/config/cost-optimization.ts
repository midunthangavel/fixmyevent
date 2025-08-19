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
    primary: 'supabase' | 'planetscale' | 'neon' | 'sqlite' | 'firebase';
    fallbacks: string[];
    enableCaching: boolean;
    maxCacheSize: number;
    cacheTTL: number;
    connectionPooling: boolean;
    maxConnections: number;
    enableReadReplicas: boolean;
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
    primary: 'vercel' | 'netlify' | 'firebase' | 'github-pages';
    fallbacks: string[];
    enableCDN: boolean;
    enableCompression: boolean;
    enableCaching: boolean;
    cacheHeaders: {
      static: string;
      dynamic: string;
      api: string;
    };
  };

  // Monitoring Configuration
  monitoring: {
    enablePerformanceMonitoring: boolean;
    enableErrorTracking: boolean;
    enableCostTracking: boolean;
    providers: {
      performance: 'web-vitals' | 'sentry' | 'custom';
      errors: 'sentry' | 'rollbar' | 'custom';
      costs: 'custom';
    };
    thresholds: {
      maxResponseTime: number;
      maxErrorRate: number;
      maxMonthlyCost: number;
    };
  };

  // Caching Strategy
  caching: {
    enableRedis: boolean;
    enableLocalStorage: boolean;
    enableServiceWorker: boolean;
    strategies: {
      static: 'cache-first' | 'stale-while-revalidate' | 'network-first';
      dynamic: 'cache-first' | 'stale-while-revalidate' | 'network-first';
      api: 'cache-first' | 'stale-while-revalidate' | 'network-first';
    };
    maxAge: {
      static: number;
      dynamic: number;
      api: number;
    };
  };

  // Performance Optimization
  performance: {
    enableLazyLoading: boolean;
    enableCodeSplitting: boolean;
    enableTreeShaking: boolean;
    enableMinification: boolean;
    enableCompression: boolean;
    enableImageOptimization: boolean;
    enableFontOptimization: boolean;
    bundleAnalysis: boolean;
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
    primary: 'supabase',
    fallbacks: ['planetscale', 'neon', 'sqlite'],
    enableCaching: true,
    maxCacheSize: 100,
    cacheTTL: 3600000, // 1 hour
    connectionPooling: true,
    maxConnections: 10,
    enableReadReplicas: false,
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
    enableCDN: true,
    enableCompression: true,
    enableCaching: true,
    cacheHeaders: {
      static: 'public, max-age=31536000, immutable', // 1 year
      dynamic: 'public, max-age=3600, s-maxage=86400', // 1 hour, 1 day on CDN
      api: 'public, max-age=300, s-maxage=3600', // 5 minutes, 1 hour on CDN
    },
  },

  monitoring: {
    enablePerformanceMonitoring: true,
    enableErrorTracking: true,
    enableCostTracking: true,
    providers: {
      performance: 'web-vitals',
      errors: 'sentry',
      costs: 'custom',
    },
    thresholds: {
      maxResponseTime: 2000, // 2 seconds
      maxErrorRate: 0.01, // 1%
      maxMonthlyCost: 100, // $100/month
    },
  },

  caching: {
    enableRedis: false, // Start without Redis to save costs
    enableLocalStorage: true,
    enableServiceWorker: true,
    strategies: {
      static: 'cache-first',
      dynamic: 'stale-while-revalidate',
      api: 'stale-while-revalidate',
    },
    maxAge: {
      static: 31536000, // 1 year
      dynamic: 3600, // 1 hour
      api: 300, // 5 minutes
    },
  },

  performance: {
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableTreeShaking: true,
    enableMinification: true,
    enableCompression: true,
    enableImageOptimization: true,
    enableFontOptimization: true,
    bundleAnalysis: false, // Disable in production to save build time
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
          primary: 'sqlite', // Use local database for development
          fallbacks: ['supabase'],
        },
        hosting: {
          ...defaultCostOptimizationConfig.hosting,
          primary: 'localhost',
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
          primary: 'supabase', // Use free tier
          fallbacks: ['planetscale', 'neon'],
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
          enableCaching: false,
        },
        database: {
          ...defaultCostOptimizationConfig.database,
          primary: 'sqlite',
          enableCaching: false,
        },
        payment: {
          ...defaultCostOptimizationConfig.payment,
          enableLocalPayments: true,
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
    model: string
  ): number {
    const costs = {
      openai: {
        'gpt-3.5-turbo': 0.002, // $0.002 per 1K tokens
        'gpt-4': 0.03, // $0.03 per 1K tokens
      },
      claude: {
        'claude-3-haiku-20240307': 0.00025, // $0.00025 per 1K tokens
        'claude-3-sonnet-20240229': 0.003, // $0.003 per 1K tokens
      },
      huggingface: {
        'mistralai/Mistral-7B-Instruct-v0.2': 0, // Free tier
      },
      local: {
        'mistral': 0, // No ongoing costs
      },
    };

    const costPerRequest = costs[provider as keyof typeof costs]?.[model as any] || 0;
    return requests * costPerRequest;
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
      supabase: {
        storage: 0, // Free tier up to 500MB
        requests: 0, // Free tier up to 50K requests
      },
      planetscale: {
        storage: 0, // Free tier up to 1GB
        requests: 0, // Free tier up to 1B reads
      },
      neon: {
        storage: 0, // Free tier up to 3GB
        requests: 0, // Free tier
      },
      sqlite: {
        storage: 0, // No ongoing costs
        requests: 0, // No ongoing costs
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
        bandwidth: 0, // Free tier up to 100GB
        builds: 0, // Free tier up to 100 builds/month
      },
      netlify: {
        bandwidth: 0, // Free tier up to 100GB
        builds: 0, // Free tier up to 300 build minutes
      },
      firebase: {
        bandwidth: 0, // Free tier up to 360MB/day
        builds: 0, // No build costs
      },
      'github-pages': {
        bandwidth: 0, // Completely free
        builds: 0, // Completely free
      },
    };

    const providerCosts = costs[provider as keyof typeof costs];
    if (!providerCosts) return 0;

    const bandwidthCost = Math.max(0, bandwidthGB - 100) * 0.15; // $0.15 per GB over limit
    const buildCost = Math.max(0, buildMinutes - 300) * 0.01; // $0.01 per minute over limit

    return bandwidthCost + buildCost;
  }

  /**
   * Calculate total monthly costs
   */
  static calculateTotalMonthlyCosts(config: CostOptimizationConfig): {
    ai: number;
    database: number;
    hosting: number;
    total: number;
    savings: number;
  } {
    // Estimate usage based on configuration
    const aiCosts = this.calculateAICosts(1000, config.ai.primary, config.ai.models[config.ai.primary]);
    const dbCosts = this.calculateDatabaseCosts(1, 100000, config.database.primary);
    const hostingCosts = this.calculateHostingCosts(50, 200, config.hosting.primary);

    const total = aiCosts + dbCosts + hostingCosts;

    // Calculate savings compared to original setup
    const originalCosts = {
      ai: this.calculateAICosts(1000, 'openai', 'gpt-4'),
      database: this.calculateDatabaseCosts(1, 100000, 'firebase'),
      hosting: this.calculateHostingCosts(50, 200, 'firebase'),
    };

    const originalTotal = originalCosts.ai + originalCosts.database + originalCosts.hosting;
    const savings = originalTotal - total;

    return {
      ai: aiCosts,
      database: dbCosts,
      hosting: hostingCosts,
      total,
      savings,
    };
  }
}

// Export configuration
export const costOptimizationConfig = getCostOptimizationConfig();
