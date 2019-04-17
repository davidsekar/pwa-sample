// Precache Files with Webpack
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

 // Cache the fontawesome fonts.
 workbox.routing.registerRoute(
     /^https:\/\/netdna\.bootstrapcdn\.com\/font-awesome\//,
     new workbox.strategies.StaleWhileRevalidate({
         cacheName: 'fontawesome-fonts-stylesheets',
     }),
 );

 // Clean Up Old Precaches when workbox has breaking changes during version changes
 workbox.precaching.cleanupOutdatedCaches();