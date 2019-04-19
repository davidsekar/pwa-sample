importScripts("/pwa-sample/precache-manifest.cda8133dc46ff0fa59c7d49f5880e5ac.js", "/pwa-sample/workbox-v4.3.0/workbox-sw.js");
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

addEventListener('message', messageEvent => {
    console.log('Debug :' + messageEvent.data);
    if (messageEvent.data === 'skipWaiting') return skipWaiting();
});

// workbox.core.skipWaiting();
// workbox.core.clientsClaim();
// Clean Up Old Precaches when workbox has breaking changes during version changes
// workbox.precaching.cleanupOutdatedCaches();
