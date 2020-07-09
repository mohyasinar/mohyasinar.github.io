importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded.`);
} else {
  console.log(`Workbox didn't load.`);
}

workbox.precaching.precacheAndRoute([
  { url : '/index.html', revision: '1'},
  { url : '/nav.html', revision: '1'},
  { url : '/main.js', revision: '1'},
  { url : '/manifest.json', revision: '1'},
  { url : '/pages/team.html', revision: '1'},
  { url : '/pages/standing.html', revision: '1'},
  { url : '/pages/saved.html', revision: '1'},
  { url : '/css/materialize.min.css', revision: '1'},
  { url : '/js/materialize.min.js', revision: '1'},
  { url : '/js/nav.js', revision: '1'},
  { url : '/js/api.js', revision: '1'},
  { url : '/js/database.js', revision: '1'},
  { url : '/js/idb.js', revision: '1'},
  { url : '/js/push.js', revision: '1'},
  { url : '/img/img-not-found.svg', revision: '1'},
  { url : '/img/icons/icon-36x36.png', revision: '1'},
  { url : '/img/icons/icon-48x48.png', revision: '1'},
  { url : '/img/icons/icon-72x72.png', revision: '1'},
  { url : '/img/icons/icon-96x96.png', revision: '1'},
  { url : '/img/icons/icon-144x144.png', revision: '1'},
  { url : '/img/icons/icon-192x192.png', revision: '1'},
  { url : '/img/icons/icon-512x512.png', revision: '1'}
]);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  new RegExp('/\.(?:gif|jpg|jpeg|svg)$/'),
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  new RegExp(' /^https:\/\/fonts\.googleapis\.com/'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

workbox.routing.registerRoute(
  new RegExp(' /^https:\/\/fonts\.gstatic\.com/'),
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push Message no payload';
  }

  let options = {
    body: body,
    icon: '/img/icons/icon-36x36.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Upcoming Match', options)
  );
});