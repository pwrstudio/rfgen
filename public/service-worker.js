var cacheName = 'rfgen-cache-' + Date.now()
var filesToCache = [
  '/',
  '/index.html',
  '/bundle.css',
  '/bundle.js',
  '/fonts/HelveticaNeueLTArabic-Bold.woff',
  '/fonts/HelveticaNeueLTArabic-Bold.woff2',
  '/fonts/HelveticaNeueLTArabic-Roman.woff',
  '/fonts/HelveticaNeueLTArabic-Roman.woff2',
  '/fonts/HelveticaNeueLTStd-Bd.woff',
  '/fonts/HelveticaNeueLTStd-Bd.woff2',
  '/fonts/HelveticaNeueLTStd-Roman.woff',
  '/fonts/HelveticaNeueLTStd-Roman.woff2'
]
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache)
    })
  )
})
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (thisCacheName) {
          if (thisCacheName !== cacheName) {
            return caches.delete(thisCacheName)
          }
        })
      )
    })
  )
})
self.addEventListener('fetch', e => {
  e.respondWith(
    (async function () {
      const response = await caches.match(e.request)
      return response || fetch(e.request)
    })()
  )
})
