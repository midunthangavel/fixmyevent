/**
 * Centralized Port Configuration for FixMyEvent
 * This file defines all port assignments for different services and functions
 */

const PORT_CONFIG = {
  // Main Application Ports
  APP: {
    NEXT_DEV: 3000,
    NEXT_START: 3001,
    NEXT_BUILD: 3002,
  },

  // Firebase Emulator Ports
  FIREBASE: {
    AUTH: 9099,
    FIRESTORE: 8080,
    STORAGE: 9199,
    UI: 4000,
    FUNCTIONS: 5001,
    HOSTING: 5000,
    PUBSUB: 8085,
    DATACONNECT: 8086,
  },

  // Development Services
  DEVELOPMENT: {
    GENKIT: 11434,
    JEST: 9229,
    PLAYWRIGHT: 9323,
    STORYBOOK: 6006,
    CYPRESS: 3003,
  },

  // Database and External Services
  DATABASE: {
    POSTGRES: 5432,
    MONGODB: 27017,
    REDIS: 6379,
  },

  // Monitoring and Analytics
  MONITORING: {
    PROMETHEUS: 9090,
    GRAFANA: 3000,
    JAEGER: 16686,
    ZIPKIN: 9411,
  },

  // API and Microservices
  API: {
    MAIN_API: 8000,
    AUTH_API: 8001,
    VENUE_API: 8002,
    BOOKING_API: 8003,
    AI_API: 8004,
    PAYMENT_API: 8005,
    NOTIFICATION_API: 8006,
    ANALYTICS_API: 8007,
  },

  // WebSocket and Real-time Services
  WEBSOCKET: {
    MAIN_WS: 8008,
    CHAT_WS: 8009,
    NOTIFICATION_WS: 8010,
    LIVE_EVENTS_WS: 8011,
  },

  // File and Media Services
  MEDIA: {
    FILE_UPLOAD: 8012,
    IMAGE_PROCESSING: 8013,
    VIDEO_STREAMING: 8014,
    AUDIO_PROCESSING: 8015,
  },

  // Testing and Quality Assurance
  TESTING: {
    UNIT_TESTS: 8016,
    INTEGRATION_TESTS: 8017,
    E2E_TESTS: 8018,
    PERFORMANCE_TESTS: 8019,
    LOAD_TESTS: 8020,
  },

  // Development Tools
  TOOLS: {
    ESLINT: 8021,
    PRETTIER: 8022,
    TYPESCRIPT: 8023,
    WEBPACK: 8024,
    VITE: 8025,
  },

  // Documentation and Help
  DOCS: {
    API_DOCS: 8026,
    STORYBOOK_DOCS: 8027,
    COMPONENT_DOCS: 8028,
    USER_GUIDE: 8029,
  },

  // Security and Authentication
  SECURITY: {
    AUTH_SERVICE: 8030,
    JWT_SERVICE: 8031,
    OAUTH_SERVICE: 8032,
    MFA_SERVICE: 8033,
  },

  // Payment and Financial Services
  PAYMENT: {
    STRIPE_WEBHOOK: 8034,
    PAYPAL_WEBHOOK: 8035,
    PAYMENT_PROCESSOR: 8036,
    INVOICE_SERVICE: 8037,
  },

  // Notification Services
  NOTIFICATION: {
    EMAIL_SERVICE: 8038,
    SMS_SERVICE: 8039,
    PUSH_SERVICE: 8040,
    IN_APP_NOTIFICATION: 8041,
  },

  // Analytics and Reporting
  ANALYTICS: {
    USER_ANALYTICS: 8042,
    EVENT_ANALYTICS: 8043,
    PERFORMANCE_ANALYTICS: 8044,
    BUSINESS_ANALYTICS: 8045,
  },

  // AI and Machine Learning
  AI: {
    CHATBOT_SERVICE: 8046,
    RECOMMENDATION_ENGINE: 8047,
    SENTIMENT_ANALYSIS: 8048,
    IMAGE_RECOGNITION: 8049,
    NATURAL_LANGUAGE_PROCESSING: 8050,
  },

  // Integration Services
  INTEGRATION: {
    CALENDAR_SYNC: 8051,
    SOCIAL_MEDIA: 8052,
    CRM_INTEGRATION: 8053,
    EMAIL_MARKETING: 8054,
  },

  // Backup and Recovery
  BACKUP: {
    DATABASE_BACKUP: 8055,
    FILE_BACKUP: 8056,
    CONFIG_BACKUP: 8057,
    DISASTER_RECOVERY: 8058,
  },

  // Health and Monitoring
  HEALTH: {
    HEALTH_CHECK: 8059,
    READINESS_CHECK: 8060,
    LIVENESS_CHECK: 8061,
    METRICS_COLLECTOR: 8062,
  },

  // Cache and Performance
  CACHE: {
    REDIS_CACHE: 8063,
    MEMORY_CACHE: 8064,
    CDN_CACHE: 8065,
    BROWSER_CACHE: 8066,
  },

  // Queue and Job Processing
  QUEUE: {
    TASK_QUEUE: 8067,
    EMAIL_QUEUE: 8068,
    NOTIFICATION_QUEUE: 8069,
    BACKGROUND_JOBS: 8070,
  },

  // Search and Indexing
  SEARCH: {
    ELASTICSEARCH: 8071,
    SOLR: 8072,
    ALGOLIA: 8073,
    FULL_TEXT_SEARCH: 8074,
  },

  // Logging and Debugging
  LOGGING: {
    LOG_AGGREGATOR: 8075,
    LOG_PARSER: 8076,
    LOG_STORAGE: 8077,
    DEBUG_SERVICE: 8078,
  },

  // Configuration Management
  CONFIG: {
    CONFIG_SERVICE: 8079,
    ENV_MANAGER: 8080,
    FEATURE_FLAGS: 8081,
    SETTINGS_MANAGER: 8082,
  },

  // Migration and Deployment
  DEPLOYMENT: {
    MIGRATION_SERVICE: 8083,
    ROLLBACK_SERVICE: 8084,
    DEPLOYMENT_MANAGER: 8085,
    VERSION_CONTROL: 8086,
  },

  // Compliance and Audit
  COMPLIANCE: {
    AUDIT_SERVICE: 8087,
    COMPLIANCE_CHECKER: 8088,
    PRIVACY_SERVICE: 8089,
    SECURITY_SCANNER: 8090,
  },

  // Support and Help
  SUPPORT: {
    HELP_DESK: 8091,
    KNOWLEDGE_BASE: 8092,
    TICKET_SYSTEM: 8093,
    LIVE_CHAT: 8094,
  },

  // Development Environment
  ENVIRONMENT: {
    STAGING: 8095,
    TESTING: 8096,
    DEMO: 8097,
    SANDBOX: 8098,
  },

  // External Integrations
  EXTERNAL: {
    GOOGLE_OAUTH: 8099,
    FACEBOOK_OAUTH: 8100,
    TWITTER_OAUTH: 8101,
    LINKEDIN_OAUTH: 8102,
  },

  // Internal Services
  INTERNAL: {
    INTERNAL_API: 8103,
    ADMIN_PANEL: 8104,
    SYSTEM_MONITOR: 8105,
    MAINTENANCE: 8106,
  },

  // Legacy and Migration
  LEGACY: {
    OLD_API: 8107,
    MIGRATION_TOOL: 8108,
    DATA_CONVERTER: 8109,
    COMPATIBILITY: 8110,
  },

  // Future Services (Reserved)
  FUTURE: {
    RESERVED_1: 8111,
    RESERVED_2: 8112,
    RESERVED_3: 8113,
    RESERVED_4: 8114,
    RESERVED_5: 8115,
  }
};

// Helper functions
const getPort = (service, subservice) => {
  if (subservice) {
    return PORT_CONFIG[service]?.[subservice];
  }
  return PORT_CONFIG[service];
};

const getAllPorts = () => PORT_CONFIG;

const getPortByService = (serviceName) => {
  for (const [category, services] of Object.entries(PORT_CONFIG)) {
    if (typeof services === 'object') {
      for (const [service, port] of Object.entries(services)) {
        if (service.toLowerCase() === serviceName.toLowerCase()) {
          return port;
        }
      }
    }
  }
  return null;
};

const validatePorts = () => {
  const usedPorts = new Set();
  const conflicts = [];

  for (const [category, services] of Object.entries(PORT_CONFIG)) {
    if (typeof services === 'object') {
      for (const [service, port] of Object.entries(services)) {
        if (usedPorts.has(port)) {
          conflicts.push({
            category,
            service,
            port,
            conflict: 'Port already in use'
          });
        }
        usedPorts.add(port);
      }
    }
  }

  return {
    isValid: conflicts.length === 0,
    conflicts,
    totalPorts: usedPorts.size
  };
};

// Export the configuration
export default PORT_CONFIG;
export { getPort, getAllPorts, getPortByService, validatePorts };

// CommonJS export for compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORT_CONFIG;
  module.exports.getPort = getPort;
  module.exports.getAllPorts = getAllPorts;
  module.exports.getPortByService = getPortByService;
  module.exports.validatePorts = validatePorts;
}
