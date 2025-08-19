// Enhanced Service Worker for FixMyEvent PWA
// Features: Background sync, offline support, push notifications, advanced caching

const CACHE_NAME = 'fixmyevent-v2';
const STATIC_CACHE = 'fixmyevent-static-v2';
const DYNAMIC_CACHE = 'fixmyevent-dynamic-v2';
const API_CACHE = 'fixmyevent-api-v2';

// SECURE: Remove console logging from production service worker
const logServiceWorker = (message, data = null) => {
  // In production, use proper logging or silent operation
  // In development, you can enable logging if needed
  if (typeof self !== 'undefined' && self.location && self.location.hostname === 'localhost') {
    // Only log in development
    if (data) {
      console.log(`[SW] ${message}`, data);
    } else {
      console.log(`[SW] ${message}`);
    }
  }
};

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/images/icon-192x192.svg',
  '/images/icon-512x512.svg',
  '/images/logo.png'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/venues',
  '/api/search',
  '/api/bookings'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  logServiceWorker('Enhanced Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        logServiceWorker('Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      
      // Cache API endpoints
      caches.open(API_CACHE).then((cache) => {
        logServiceWorker('Caching API endpoints');
        return cache.addAll(API_ENDPOINTS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  logServiceWorker('Enhanced Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            logServiceWorker('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle different types of requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different request types
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      // API requests - try network first, fallback to cache
      event.respondWith(handleAPIRequest(request));
    } else if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/_next/')) {
      // Static assets - cache first, fallback to network
      event.respondWith(handleStaticRequest(request));
    } else {
      // HTML pages - network first, fallback to cache
      event.respondWith(handlePageRequest(request));
    }
  } else if (request.method === 'POST' || request.method === 'PUT') {
    // Handle offline data sync
    event.respondWith(handleOfflineDataSync(request));
  }
});

// Handle API requests with intelligent caching
async function handleAPIRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network request failed');
  } catch (error) {
    logServiceWorker('API request failed, trying cache:', request.url);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline mode', 
        message: 'This data is not available offline' 
      }),
      { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return a placeholder for missing images
    if (request.url.includes('/images/')) {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af">Image</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      return networkResponse;
    }
    throw new Error('Page request failed');
  } catch (error) {
    logServiceWorker('Page request failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/offline.html');
  }
}

// Handle offline data sync
async function handleOfflineDataSync(request) {
  try {
    // Try to send request immediately
    const response = await fetch(request);
    return response;
  } catch (error) {
    logServiceWorker('Request failed, storing for background sync:', request.url);
    
    // Store request for background sync
    const syncData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB for background sync
    await storeSyncRequest(syncData);
    
    // Return immediate response indicating sync will happen
    return new Response(
      JSON.stringify({ 
        message: 'Request queued for sync when online',
        syncId: syncData.timestamp 
      }),
      { 
        status: 202, 
        statusText: 'Accepted',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Background sync event
self.addEventListener('sync', (event) => {
  logServiceWorker('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when back online
async function syncOfflineData() {
  try {
    const syncRequests = await getStoredSyncRequests();
    
    for (const syncRequest of syncRequests) {
      try {
        const response = await fetch(syncRequest.url, {
          method: syncRequest.method,
          headers: syncRequest.headers
        });
        
        if (response.ok) {
          // Remove successful sync request
          await removeSyncRequest(syncRequest.timestamp);
          logServiceWorker('Successfully synced:', syncRequest.url);
        }
      } catch (error) {
        logServiceWorker('Failed to sync request:', syncRequest.url, error);
      }
    }
  } catch (error) {
    logServiceWorker('Background sync failed:', error);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  logServiceWorker('Push notification received:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/images/icon-192x192.svg',
      badge: '/images/badge-72x72.svg',
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      tag: data.tag || 'default'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'FixMyEvent', options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  logServiceWorker('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action) {
    // Handle specific action clicks
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Default click behavior
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification actions
function handleNotificationAction(action, data) {
  switch (action) {
    case 'view-booking':
      clients.openWindow(`/bookings/${data.bookingId}`);
      break;
    case 'view-venue':
      clients.openWindow(`/venues/${data.venueId}`);
      break;
    default:
      clients.openWindow('/');
  }
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  logServiceWorker('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// IndexedDB operations for storing sync requests
async function storeSyncRequest(syncData) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FixMyEventSync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['syncRequests'], 'readwrite');
      const store = transaction.objectStore('syncRequests');
      const addRequest = store.add(syncData);
      
      addRequest.onsuccess = () => resolve(addRequest.result);
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('syncRequests')) {
        db.createObjectStore('syncRequests', { keyPath: 'timestamp' });
      }
    };
  });
}

async function getStoredSyncRequests() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FixMyEventSync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['syncRequests'], 'readonly');
      const store = transaction.objectStore('syncRequests');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('syncRequests')) {
        db.createObjectStore('syncRequests', { keyPath: 'timestamp' });
      }
    };
  });
}

async function removeSyncRequest(timestamp) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FixMyEventSync', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['syncRequests'], 'readwrite');
      const store = transaction.objectStore('syncRequests');
      const deleteRequest = store.delete(timestamp);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('syncRequests')) {
        db.createObjectStore('syncRequests', { keyPath: 'timestamp' });
      }
    };
  });
}
