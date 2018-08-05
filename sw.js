// Code source from YouTube tutorial: https://youtu.be/BfL3pprhnms
// And from Udacity offline-first web app course by Jake Archibald

let staticCache = 'restaurant-v2';
let imagesCache = 'restaurant-images-v2';

const allCaches = [
	staticCache,
	imagesCache
];

const urlsToCache = [
	'/',
	'/dist/index.html',
	'/dist/restaurant.html',
	'/dist/css/normalize.css',
	'/dist/css/styles.css',
	'/dist/js/idb.js',
	'/dist/js/dbhelper.js',
	'/dist/js/lazysizes.min.js',
	'/dist/js/main.js',
	'/dist/js/restaurant_info.js',
	'/favicon/favicon-32x32.png',
	'/favicon/favicon-16x16.png',
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCache).then(function(cache) {
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
					return thisCacheName.startsWith('restaurant-') && !allCaches.includes(thisCacheName);
				}).map(function (thisCacheName) {
					return caches.delete(thisCacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	const requestUrl = new URL(event.request.url);
	// console.log(`Log request url: ${requestUrl.pathname}`);
	if (requestUrl.pathname.startsWith('/img/')) {
		// console.log(`Log img request url: ${requestUrl.pathname.startsWith('/img/')}`);
		event.respondWith(serveImage(event.request));
		return;
	}

	event.respondWith(
		caches.match(event.request).then(response => {
			if (response) {
				console.log(`Service worker found in cache: ${event.request.url}`);
				return response;
			}
			// console.log('Network request for ', event.request.url);
			return fetch(event.request).then(networkResponse => {
				if (networkResponse.status === 404) {
					// console.log(networkResponse.status);
					return;
				}
				return caches.open(staticCache).then(cache => {
					cache.put(event.request.url, networkResponse.clone());
					// console.log('Fetched and cached', event.request.url);
					return networkResponse;
				})
			})
		}).catch(error => {
			console.log('Error:', error);
			return;
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

self.addEventListener('message', (event) => {
    console.log(event);

    // var messages = JSON.parse(event.data);
    if (event.data.action === 'skipWaiting') {
       self.skipWaiting();
    }
});

self.addEventListener('sync', function (event) {
	if (event.tag == 'myFirstSync') {
		const DBOpenRequest = indexedDB.open('restaurants', 1);
		DBOpenRequest.onsuccess = function (e) {
			db = DBOpenRequest.result;
			let tx = db.transaction('offline-reviews', 'readwrite');
			let store = tx.objectStore('offline-reviews');
			// 1. Get submitted reviews while offline
			let request = store.getAll();
			request.onsuccess = function () {
				// 2. POST offline reviews to network
				for (let i = 0; i < request.result.length; i++) {
					fetch(`http://localhost:1337/reviews/`, {
						body: JSON.stringify(request.result[i]),
						cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
						credentials: 'same-origin', // include, same-origin, *omit
						headers: {
							'content-type': 'application/json'
						},
						method: 'POST',
						mode: 'cors', // no-cors, cors, *same-origin
						redirect: 'follow', // *manual, follow, error
						referrer: 'no-referrer', // *client, no-referrer
					})
					.then(response => {
						return response.json();
					})
					.then(data => {
						let tx = db.transaction('all-reviews', 'readwrite');
						let store = tx.objectStore('all-reviews');
						let request = store.add(data);
						request.onsuccess = function (data) {
							//TODO: add data (= one review) to view
							let tx = db.transaction('offline-reviews', 'readwrite');
							let store = tx.objectStore('offline-reviews');
							let request = store.clear();
							request.onsuccess = function () {
								console.log('this runs but empty');
							 };
							request.onerror = function (error) {
								console.log('Unable to clear offline-reviews objectStore', error);
							}
						};
						request.onerror = function (error) {
							console.log('Unable to add objectStore to IDB', error);
						}
					})
					.catch(error => {
						console.log('Unable to make a POST fetch', error);
					})
				}
			}
			request.onerror = function (e) {
				console.log(e);
			}
		}
		DBOpenRequest.onerror = function (e) {
			console.log(e);
		}
	}
});
