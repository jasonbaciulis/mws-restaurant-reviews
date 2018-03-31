// Code source from YouTube tutorial: https://youtu.be/BfL3pprhnms
// And from Udacity offline-first web app course by Jake Archibald

const cacheName = 'rr-static-v25';
const imagesCache = 'rr-images-v2';

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
	'/favicon/favicon-32x32.png',
];



self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(cacheName).then(function (cache) {
			console.log('Cache opened');
			return cache.addAll(urlsToCache);
		}).catch(error => console.log(`Open cache failed: ${error}`))
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
			);
		})
	);
});

self.addEventListener('fetch', function (event) {
	const requestUrl = new URL(event.request.url);
	// console.log(`Log request url: ${requestUrl.pathname}`);

	if (requestUrl.pathname.startsWith('/img/')) {
		// console.log(`Log img request url: ${requestUrl.pathname.startsWith('/img/')}`);
		event.respondWith(serveImage(event.request));
		return;
	} 
	
	// else if (requestUrl.pathname.startsWith('/maps')) {
	// 	console.log(`Log maps request url: ${requestUrl.pathname.startsWith('/maps')}`);
	// 	event.respondWith(serveGoogleMaps(event));
	// 	return;
	// }

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
	// const storageUrl = request.url.replace(/-\d+px\.(webp$|jpg$)/, '');

	// Check if images are in cache if not then store them 
	return caches.open(imagesCache).then(function (cache) {
		return cache.match(request.url).then(function (response) {
			if (response) return response;

			return fetch(request).then(function (networkResponse) {
				cache.put(request.url, networkResponse.clone());
				return networkResponse;
			});
		});
	});
}

// serveGoogleMaps = (event) => {
// 	caches.open(cacheName).then(function (cache) {
// 		return cache.match(event.request).then(res => {
// 			return res || fetch(requestUrl.href, {
// 				mode: 'no-cors'
// 			}).then(response => {
// 				cache.put(event.request, response.clone());
// 				return response;
// 			}, error => console.error(error));
// 		});
// 	})
// }