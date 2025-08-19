// Standardized environment variable configuration
export const environment = {
  // Firebase Configuration (consistent with firebase.ts)
  firebase: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },

  // AI Service Configuration (standardized naming)
  ai: {
    provider: process.env.NEXT_PUBLIC_AI_PROVIDER || 'local',
    openai: {
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
      baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
    },
    claude: {
      apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
      model: process.env.NEXT_PUBLIC_CLAUDE_MODEL || 'claude-3-haiku-20240307',
      baseURL: process.env.NEXT_PUBLIC_CLAUDE_BASE_URL,
    },
    huggingface: {
      apiKey: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
      model: process.env.NEXT_PUBLIC_HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2',
      baseURL: process.env.NEXT_PUBLIC_HUGGINGFACE_BASE_URL,
    },
    local: {
      baseURL: process.env.NEXT_PUBLIC_LOCAL_AI_BASE_URL || 'http://localhost:11434',
      model: process.env.NEXT_PUBLIC_LOCAL_AI_MODEL || 'mistral',
    },
  },

  // Database Configuration
  database: {
    provider: process.env.NEXT_PUBLIC_DATABASE_PROVIDER || 'firebase',
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    planetscale: {
      url: process.env.NEXT_PUBLIC_PLANETSCALE_DATABASE_URL,
    },
    neon: {
      url: process.env.NEXT_PUBLIC_NEON_DATABASE_URL,
    },
  },

  // Payment Configuration
  payment: {
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY, // Server-side only
    },
    square: {
      accessToken: process.env.SQUARE_ACCESS_TOKEN, // Server-side only
      applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    },
    paypal: {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      secret: process.env.PAYPAL_SECRET, // Server-side only
    },
  },

  // Hosting Configuration
  hosting: {
    provider: process.env.NEXT_PUBLIC_HOSTING_PROVIDER || 'vercel',
    vercel: {
      token: process.env.VERCEL_TOKEN, // Server-side only
    },
  },

  // Monitoring Configuration
  monitoring: {
    sentry: {
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
    analytics: {
      id: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    },
  },

  // Cost Optimization Settings
  costOptimization: {
    maxMonthlyAISpend: parseInt(process.env.NEXT_PUBLIC_MAX_MONTHLY_AI_SPEND || '25'),
    maxMonthlyDBSpend: parseInt(process.env.NEXT_PUBLIC_MAX_MONTHLY_DB_SPEND || '10'),
    maxMonthlyHostingSpend: parseInt(process.env.NEXT_PUBLIC_MAX_MONTHLY_HOSTING_SPEND || '15'),
    enableLocalAI: process.env.NEXT_PUBLIC_ENABLE_LOCAL_AI === 'true',
    enableLocalDatabase: process.env.NEXT_PUBLIC_ENABLE_LOCAL_DATABASE === 'true',
    enableCaching: process.env.NEXT_PUBLIC_ENABLE_CACHING !== 'false',
    enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE !== 'false',
  },
};

// Validation function for required environment variables
export function validateEnvironment(): void {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  ];

  const missingVars = requiredVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate AI configuration based on provider
  const aiProvider = process.env.NEXT_PUBLIC_AI_PROVIDER;
  if (aiProvider && aiProvider !== 'local') {
    const requiredAIKeys = {
      'openai': ['NEXT_PUBLIC_OPENAI_API_KEY'],
      'claude': ['NEXT_PUBLIC_CLAUDE_API_KEY'],
      'huggingface': ['NEXT_PUBLIC_HUGGINGFACE_API_KEY'],
    };
    
    const requiredKeys = requiredAIKeys[aiProvider as keyof typeof requiredAIKeys];
    if (requiredKeys) {
      const missingAIKeys = requiredKeys.filter(key => !process.env[key]);
      if (missingAIKeys.length > 0) {
        throw new Error(`Missing required AI environment variables for ${aiProvider}: ${missingAIKeys.join(', ')}`);
      }
    }
  }

  // Validate database configuration
  const dbProvider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;
  if (dbProvider && dbProvider !== 'firebase') {
    const requiredDBKeys = {
      'supabase': ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      'planetscale': ['NEXT_PUBLIC_PLANETSCALE_DATABASE_URL'],
      'neon': ['NEXT_PUBLIC_NEON_DATABASE_URL'],
    };
    
    const requiredKeys = requiredDBKeys[dbProvider as keyof typeof requiredDBKeys];
    if (requiredKeys) {
      const missingDBKeys = requiredKeys.filter(key => !process.env[key]);
      if (missingDBKeys.length > 0) {
        throw new Error(`Missing required database environment variables for ${dbProvider}: ${missingDBKeys.join(', ')}`);
      }
    }
  }

  // Validate payment configuration
  const hasStripe = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const hasSquare = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const hasPayPal = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (hasStripe && !process.env.STRIPE_SECRET_KEY) {
    console.warn('Warning: STRIPE_SECRET_KEY is missing (required for server-side operations)');
  }
  if (hasSquare && !process.env.SQUARE_ACCESS_TOKEN) {
    console.warn('Warning: SQUARE_ACCESS_TOKEN is missing (required for server-side operations)');
  }
  if (hasPayPal && !process.env.PAYPAL_SECRET) {
    console.warn('Warning: PAYPAL_SECRET is missing (required for server-side operations)');
  }
}

// Export individual configurations for backward compatibility
export const aiConfig = environment.ai;
export const firebaseConfig = environment.firebase;
export const databaseConfig = environment.database;
export const paymentConfig = environment.payment;
export const hostingConfig = environment.hosting;
export const monitoringConfig = environment.monitoring;
export const costOptimizationConfig = environment.costOptimization;
