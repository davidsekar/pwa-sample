 // Cache the fontawesome fonts.
 workbox.routing.registerRoute(
     /^https:\/\/netdna\.bootstrapcdn\.com\/font-awesome\//,
     new workbox.strategies.StaleWhileRevalidate({
         cacheName: 'fontawesome-fonts-stylesheets',
     }),
 );