/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// Initialize Firebase Admin
initializeApp();

// Set global options for cost control
setGlobalOptions({ 
  maxInstances: 10,
  timeoutSeconds: 540,
  memory: '256MiB'
});

// Initialize services
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

// Export the services for use in other functions
export { db, auth, storage };

// Main API function
export const api = onRequest(async (request, response) => {
  try {
    // Set CORS headers
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }

    // Route the request based on path
    const path = request.path;
    const method = request.method;

    logger.info(`API Request: ${method} ${path}`, {
      structuredData: true,
      method,
      path,
      timestamp: new Date().toISOString()
    });

    // Basic routing - in a real app, you'd use Express.js or similar
    if (path.startsWith('/api/')) {
      const apiPath = path.replace('/api/', '');
      
      switch (apiPath) {
        case 'health':
          response.json({ status: 'healthy', timestamp: new Date().toISOString() });
          break;
        case 'version':
          response.json({ version: '1.0.0', environment: process.env.NODE_ENV || 'development' });
          break;
        default:
          response.status(404).json({ error: 'API endpoint not found' });
      }
    } else {
      response.status(404).json({ error: 'Route not found' });
    }

  } catch (error) {
    logger.error('API Error:', error);
    response.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Something went wrong'
    });
  }
});

// Health check function
export const healthCheck = onRequest((_request, response) => {
  response.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Export individual function modules
export * from './auth';
export * from './venues';
export * from './bookings';
export * from './ai';
