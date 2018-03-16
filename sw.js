// Code source from YouTube tutorial: https://youtu.be/BfL3pprhnms

var cacheName = 'mws-v7';
var urlsToCache = [
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/dbhelper.js',
    '/js/restaurant_info.js',
    '/img/1-800px.webp',
    '/img/2-800px.webp',
    '/img/3-800px.webp',
    '/img/4-800px.webp',
    '/img/5-800px.webp',
    '/img/6-800px.webp',
    '/img/7-800px.webp',
    '/img/8-800px.webp',
    '/img/9-800px.webp',
    '/img/10-800px.webp',
];



self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', function (event) {
    console.log('activated');

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {
                    if (thisCacheName !== cacheName) {
                        console.log('Service worker: Removing cache files from ', thisCacheName);
                        return caches.delete(thisCacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('Service worker found in cache', event.request.url);
                return response;
            }
            return fetch(event.request);
        }).catch(function(err) {
            console.log('Service worker error', err);
        })
    );
});