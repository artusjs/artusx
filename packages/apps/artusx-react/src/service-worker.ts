import { clientsClaim } from 'workbox-core';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute, Route } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

const SW_VERSION = '1.0.0';

self.addEventListener('install', (_event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Specify allowed cache keys
  // const cacheAllowList = [''];

  // Get all the currently active `Cache` instances.
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          return caches.delete(key);

          // if (!cacheAllowList.includes(key)) {
          // return caches.delete(key);
          // }
        })
      );
    })
  );

  // Reload all window
  self.clients
    .matchAll({
      type: 'window',
    })
    .then((windowClients) => {
      windowClients.forEach((windowClient) => {
        windowClient.navigate(windowClient.url);
      });
    });
});

self.addEventListener('message', (event) => {
  console.log('SW Received Message: ', event);
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('statechange', (event) => {
  console.log('statechange', event?.target);
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin && url.pathname === '/') {
    event.respondWith(new StaleWhileRevalidate().handle({ event, request }));
  }
});

clientsClaim();

// self.__WB_MANIFEST is default injection point
precacheAndRoute([
  {
    url: 'index.html',
    revision: SW_VERSION,
  },
  {
    url: '/favicon.svg',
    revision: SW_VERSION,
  },
]);

// clean old assets
cleanupOutdatedCaches();

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

const imageRoute = new Route(
  ({ request }) => {
    return request.destination === 'image';
  },
  new CacheFirst({
    cacheName: 'images',
  })
);

const scriptsRoute = new Route(
  ({ request }) => {
    return request.destination === 'script';
  },
  new CacheFirst({
    cacheName: 'scripts',
  })
);

const stylesRoute = new Route(
  ({ request }) => {
    return request.destination === 'style';
  },
  new CacheFirst({
    cacheName: 'styles',
  })
);

registerRoute(imageRoute);
registerRoute(stylesRoute);
registerRoute(scriptsRoute);
