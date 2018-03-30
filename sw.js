// Code source from YouTube tutorial: https://youtu.be/BfL3pprhnms
// And from Udacity offline-first web app course by Jake Archibald

const cacheName = 'rr-static-v24';
const imagesCache = 'rr-images';

const allCaches = [
	cacheName,
	imagesCache
]

const urlsToCache = [
	'/index.html',
	'/restaurant.html',
	'/css/normalize.css',
	'/css/styles.css',
	'/js/idb.js',
	'/js/dbhelper.js',
	'/js/main.js',
	'/js/restaurant_info.js',
	// '/img/1-800px.webp',
	// '/img/2-800px.webp',
	// '/img/3-800px.webp',
	// '/img/4-800px.webp',
	// '/img/5-800px.webp',
	// '/img/6-800px.webp',
	// '/img/7-800px.webp',
	// '/img/8-800px.webp',
	// '/img/9-800px.webp',
	// '/img/10-800px.webp',
	// '/img/restaurant-placeholder-800px.webp',
	'/favicon/apple-touch-icon.png',
	'/favicon/favicon-32x32.png',
	'/favicon/favicon-16x16.png',
	'/favicon/safari-pinned-tab.svg'
	// 'http://localhost:1337/restaurants',
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
	console.log('Service Worker activated');

	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.filter(function (thisCacheName) {
					return thisCacheName.startsWith('rr-') && !allCaches.includes(thisCacheName);
				}).map(function (thisCacheName) {
					return caches.delete(thisCacheName);
				})
				// cacheNames.map(function (thisCacheName) {
				// if (thisCacheName !== cacheName) {
				// 	console.log('Service worker: Removing cache files from ', thisCacheName);
				// 	return caches.delete(thisCacheName);
				// }
			);
		})
	);
});

self.addEventListener('fetch', function (event) {
	const requestUrl = new URL(event.request.url);

	if (requestUrl.pathname.startsWith('/img/')) {
		event.respondWith(serveImage(event.request));
		return;
	}

	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				console.log(`Service worker found in cache: ${event.request.url}`);
				return response;
			}
			return fetch(event.request);
		}).catch(function (err) {
			console.log(`Service worker error: ${err}`);
		})
	);
});

serveImage = (request) => {
	// Regex to clean URL ending
	const storageUrl = request.url.replace(/-\d+px\.webp$/, '');
	// const storageUrl = request.url.replace(/-\d+px\.webp$|jpg$/, '');

	// Check if images are in cache if not then store them 
	return caches.open(imagesCache).then(function (cache) {
		return cache.match(storageUrl).then(function (response) {
			if (response) return response;

			return fetch(request).then(function (networkResponse) {
				cache.put(storageUrl, networkResponse.clone());
				return networkResponse;
			});
		});
	});
}

// // Code source from YouTube tutorial: https://youtu.be/BfL3pprhnms

// var cacheName = 'mws-v32';
// var urlsToCache = [
//     '/index.html',
//     '/restaurant.html',
//     '/css/styles.css',
//     '/js/main.js',
//     '/js/dbhelper.js',
//     '/js/restaurant_info.js',
//     '/img/1-800px.webp',
//     '/img/2-800px.webp',
//     '/img/3-800px.webp',
//     '/img/4-800px.webp',
//     '/img/5-800px.webp',
//     '/img/6-800px.webp',
//     '/img/7-800px.webp',
//     '/img/8-800px.webp',
//     '/img/9-800px.webp',
//     '/img/10-800px.webp',
// ];



// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open(cacheName).then(function (cache) {
//             console.log('Opened cache');
//             return cache.addAll(urlsToCache);
//         })
//     );
// });

// self.addEventListener('activate', function (event) {
//     console.log('activated');

//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(cacheNames.map(function (thisCacheName) {
//                     if (thisCacheName !== cacheName) {
//                         console.log('Service worker: Removing cache files from ', thisCacheName);
//                         return caches.delete(thisCacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//             if (response) {
//                 console.log('Service worker found in cache', event.request.url);
//                 return response;
//             }
//             return fetch(event.request);
//         }).catch(function(err) {
//             console.log('Service worker error', err);
//         })
//     );
// });