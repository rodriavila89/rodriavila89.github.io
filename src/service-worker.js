// Set a name for the current cache
var cacheName = 'v13';

// Default files to always cache
var cacheFiles = [
  './css/reset.css',
  './css/otro2.css'
]


self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Installed');

  e.waitUntil(
    caches
    .open(cacheName)
    .then(cache => {
      console.log('Service Worker: Caching Files');
      //cache.addAll(cacheFiles);
    })
    .then(() => self.skipWaiting())
  );

});


self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activated');

  e.waitUntil(

    // Get all the cache keys (cacheName)
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {
        console.log('CACHE ACTUAL: ', thisCacheName);

        // If a cached item is saved under a previous cacheName
        if (thisCacheName !== cacheName) {

          // Delete that cached file
          console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
          return caches.delete(thisCacheName);
        }
      }));
    })
  ); // end e.waitUntil

});


function isMatch(url) {
  let myPattern = [/.*?moment.*/, /.*?swiper.*/, /.*?carousel.*/];

  let checkMatch = false;

  myPattern.map(p => {
    if (url.match(p)) {
      checkMatch = true;
    }
  })

  return checkMatch;

}



// Call Fetch Event
self.addEventListener('fetch', e => {
  const myUrl = e.request.url;
  console.log('Service Worker: Fetching - ', myUrl);

  if (isMatch(myUrl)) {

    e.respondWith(
      fetch(e.request)
      .then(res => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cache
        caches.open(cacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
          console.log('[ServiceWorker] New Data Cached', e.request.url);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
    );

  }
});