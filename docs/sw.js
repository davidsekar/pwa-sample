importScripts("/pwa-sample/precache-manifest.81d99aacf6ce13d8dd22548eedc810da.js", "/pwa-sample/workbox-v4.3.0/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/pwa-sample/workbox-v4.3.0"});
// Precache Files with Webpack
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// Cache the fontawesome fonts.
workbox.routing.registerRoute(
    /^https:\/\/netdna\.bootstrapcdn\.com\/font-awesome\/4\.7\.0\//,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'fontawesome-fonts-stylesheets',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 20,
            }),
        ]
    }),
);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// Clean Up Old Precaches when workbox has breaking changes during version changes
workbox.precaching.cleanupOutdatedCaches();
