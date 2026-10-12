const CACHE_NAME = 'healsense-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch((err) => {
      console.log('Cache addAll error:', err);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Network first strategy for API calls, cache first for assets
  if (request.url.includes('/api/') || request.url.includes('bluetooth')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fall back to cached response
          return caches.match(request);
        })
    );
  } else {
    // Cache first strategy for assets
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Cache new responses
          if (response.ok && request.method === 'GET') {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        }).catch(() => {
          // Offline fallback
          console.log('Offline - request failed:', request.url);
          return new Response('Offline - content not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
    );
  }
});

// Background sync for syncing data when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-patient-data') {
    event.waitUntil(syncPatientData());
  }
});

// Periodic background sync - sync sensor data periodically
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-sensor-data') {
    event.waitUntil(updateSensorData());
  }
});

// Helper function to sync patient data
async function syncPatientData() {
  try {
    const response = await fetch('/api/sync-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      })
    });
    console.log('Data sync successful:', response.ok);
    return response.ok;
  } catch (error) {
    console.log('Data sync failed:', error);
    throw error;
  }
}

// Helper function to update sensor data
async function updateSensorData() {
  try {
    const response = await fetch('/api/sensor-data');
    const data = await response.json();

    // Store in cache for app to retrieve
    const cache = await caches.open(CACHE_NAME);
    const cachedData = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put('/api/sensor-data', cachedData);

    console.log('Sensor data updated');
    return true;
  } catch (error) {
    console.log('Sensor update failed:', error);
    throw error;
  }
}

// Message handler for communication with clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker loaded');
