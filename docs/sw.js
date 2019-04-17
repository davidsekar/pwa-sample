importScripts("/pwa-sample/precache-manifest.c58243b23ee0b4413374b82b7c0903cf.js", "/pwa-sample/workbox-v4.3.0/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/pwa-sample/workbox-v4.3.0"});
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
