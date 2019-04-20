importScripts("/pwa-sample/precache-manifest.ca6bd1f10d164fd2c8e85db73d2746fb.js", "/pwa-sample/workbox-v4.3.0/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/pwa-sample/workbox-v4.3.0"});
// Precache Files with Webpack
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// Cache the fontawesome fonts.
workbox.routing.registerRoute(
    /^https:\/\/netdna\.bootstrapcdn\.com\/font-awesome\/4\.7\.0\//,
    new workbox.strategies.CacheFirst({
        cacheName: 'fontawesome-fonts-stylesheets',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20,
            }),
        ]
    }),
);

// Cache the site images.
workbox.routing.registerRoute(
    /\/img\/*/i,
    new workbox.strategies.CacheFirst({
        cacheName: 'pwa-sample-images',
        plugins: [
            new workbox.expiration.Plugin({
                // Only cache requests for a week
                maxAgeSeconds: 7 * 24 * 60 * 60,
                // Only cache 10 requests.
                maxEntries: 10
            })
        ]
    }),
);

self.addEventListener('message', messageEvent => {
    if (messageEvent.data === 'skipWaiting') return skipWaiting();
});

self.addEventListener('notificationclose', function (e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;

    console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function (event) {
    let url = event.notification.data.url + '?report=view';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener('push', function (e) {
    var options = {
        body: 'This notification was generated from a push, which you have accepted to receive!',
        icon: 'img/report-icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [{
                action: 'explore',
                title: 'Checkout our latest news on ABR',
                icon: 'img/view.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: 'img/close.png'
            },
        ]
    };
    e.waitUntil(self.registration.showNotification('PWA Sample!', options));
});

// workbox.core.skipWaiting();
// workbox.core.clientsClaim();
// Clean Up Old Precaches when workbox has breaking changes during version changes
// workbox.precaching.cleanupOutdatedCaches();
