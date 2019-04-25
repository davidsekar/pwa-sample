importScripts("/pwa-sample/precache-manifest.585d4a157b981e55abcf906d8dbcacf9.js", "/pwa-sample/workbox-v4.3.0/workbox-sw.js");
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
                maxEntries: 30,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    }),
);

// Cache the Google fonts.
workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ],
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
                maxEntries: 30
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
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
    var action = event.action;
    if (action === 'close') {
        event.notification.close(); // Android needs explicit close.
    } else {
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
        event.notification.close(); // Android needs explicit close.
    }
});

self.addEventListener('push', function (e) {
    var options = {
        body: 'Checkout our latest news on ABR!',
        icon: 'img/report-icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [{
                action: 'explore',
                title: 'Generated using Push API!',
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
