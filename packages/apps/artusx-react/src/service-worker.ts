import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute, Route } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

const SW_VERSION = '1.0.0';

self.addEventListener('install', (_event) => {
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  console.log('SW Received Message: ', event);
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin && url.pathname === '/') {
    event.respondWith(new StaleWhileRevalidate().handle({ event, request }));
  }
});

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
