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
    provider: 'firebase',
  },

  // Payment Configuration
  payment: {
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    square: {
      applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    },
    paypal: {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    },
  },

  // Hosting Configuration
  hosting: {
    provider: process.env.NEXT_PUBLIC_HOSTING_PROVIDER || 'vercel',
    vercel: {
      token: process.env.VERCEL_TOKEN,
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
    performance: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
  },

  // Cost Optimization Settings
  costOptimization: {
    maxMonthlyAISpend: Number(process.env.NEXT_PUBLIC_MAX_MONTHLY_AI_SPEND) || 25,
    maxMonthlyDBSpend: Number(process.env.NEXT_PUBLIC_MAX_MONTHLY_DB_SPEND) || 10,
    maxMonthlyHostingSpend: Number(process.env.NEXT_PUBLIC_MAX_MONTHLY_HOSTING_SPEND) || 15,
    enableLocalAI: process.env.NEXT_PUBLIC_ENABLE_LOCAL_AI === 'true',
    enableCaching: process.env.NEXT_PUBLIC_ENABLE_CACHING === 'true',
    enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  },

  // Development Settings
  development: {
    nodeEnv: process.env.NODE_ENV || 'development',
    useFirebaseEmulators: process.env.USE_FIREBASE_EMULATORS === 'true',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    functionsUrl: process.env.NEXT_PUBLIC_FUNCTIONS_URL || 'http://localhost:5001',
    firebaseUIUrl: process.env.NEXT_PUBLIC_FIREBASE_UI_URL || 'http://localhost:4000',
    debugMode: process.env.NODE_ENV === 'development',
  },
};

// Environment validation
export const validateEnvironment = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required Firebase fields
  const requiredFirebaseFields = [
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  ];

  requiredFirebaseFields.forEach(field => {
    if (!process.env[field]) {
      errors.push(`Missing required environment variable: ${field}`);
    }
  });

  // Validate AI provider configuration
  const aiProvider = process.env.NEXT_PUBLIC_AI_PROVIDER;
  if (aiProvider && !['local', 'openai', 'claude', 'huggingface'].includes(aiProvider)) {
    errors.push(`Invalid AI provider: ${aiProvider}`);
  }

  // Validate cost optimization values
  const maxAISpend = Number(process.env.NEXT_PUBLIC_MAX_MONTHLY_AI_SPEND);
  if (maxAISpend && (maxAISpend < 0 || maxAISpend > 1000)) {
    errors.push('MAX_MONTHLY_AI_SPEND must be between 0 and 1000');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Export validation result
export const environmentValidation = validateEnvironment();
