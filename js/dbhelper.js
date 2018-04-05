/**
 * Register service worker
 */
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js', {
			scope: '/'
		}).then(function (registration) {
			console.log('ServiceWorker registration successful');
		}, function (err) {
			console.log(`ServiceWorker registration failed: ${err}`);
		});
	});
}

/**
 * Common database helper functions.
 */
class DBHelper {

	/**
	 * Database URL.
	 * Change this to restaurants.json file location on your server.
	 */
	static get DATABASE_URL() {
		const port = 1337 // Change this to your server port
		return `http://localhost:${port}/restaurants`;
	}

	/**
	 * Fetch all restaurants.
	 */
	static fetchRestaurants(callback) {
		self.dbPromise;
		// Check if idb is open and if not then open it
		if (self.dbPromise) {
			console.log(`IndexDB is open`);
		} else {
			console.log(`IndexDB was NOT open. Opening it now.`);
			self.dbPromise = DBHelper.openIndexDB();
		}

		// Get databaseOpen promise
		self.dbPromise.then(function (db) {
			const index = db.transaction('restaurants').objectStore('restaurants');
			// Check if restaurants are on IndexDB, if not fetch from remote server
			index.getAll().then(function (restaurants) {
				if (restaurants.length > 1) {
					callback(null, restaurants);
				} else {
					fetch(DBHelper.DATABASE_URL)
						.then(response => response.json())
						.catch(error => console.log(`Remote server fetch error: ${error}`))
						.then(restaurants => {
							DBHelper.insertData(restaurants);
							callback(null, restaurants);
						})
						.catch(error => callback(error, null));
				}
			})
		})
	}

	/**
	 * Open IndexDB
	 */
	static openIndexDB() {
		// if (!navigator.serviceWorker) {
		// 	return Promise.resolve();
		// }

		return idb.open('restaurant-reviews', 1, function (upgradeDb) {
			const store = upgradeDb.createObjectStore('restaurants', {
				keyPath: 'id'
			});
		})
	}

	/**
	 * Fetch restaurants data from remote server
	 */
	// static fetchRestaurantsFromRemoteServer() {
	// 	return fetch(DBHelper.DATABASE_URL)
	// 		.then(response => {
	// 			return response.json();
	// 		})
	// 		.catch(error => console.log(`Remote server fetch error: ${error}`));
	// }

	/**
	 * Insert data into IndexDB from JSON which is fetched from the remote server
	 */
	static insertData(restaurants) {
		// console.log(`fetched data for idb ${restaurants}`);

		self.dbPromise.then(function (db) {
			const tx = db.transaction('restaurants', 'readwrite');
			const store = tx.objectStore('restaurants');
			restaurants.forEach(function (restaurant) {
				store.put(restaurant);
			});
		})
	}

	/**
	 * Fetch a restaurant by its ID.
	 */
	static fetchRestaurantById(id, callback) {
		// fetch all restaurants with proper error handling.
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const restaurant = restaurants.find(r => r.id == id);
				console.log(restaurant);
				if (restaurant) { // Got the restaurant
					callback(null, restaurant);
				} else { // Restaurant does not exist in the database
					callback('Restaurant does not exist', null);
				}
			}
		});
	}

	/**
	 * Fetch restaurants by a cuisine type with proper error handling.
	 */
	static fetchRestaurantByCuisine(cuisine, callback) {
		// Fetch all restaurants  with proper error handling
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given cuisine type
				const results = restaurants.filter(r => r.cuisine_type == cuisine);
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch restaurants by a neighborhood with proper error handling.
	 */
	static fetchRestaurantByNeighborhood(neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Filter restaurants to have only given neighborhood
				const results = restaurants.filter(r => r.neighborhood == neighborhood);
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
	 */
	static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				let results = restaurants
				if (cuisine != 'all') { // filter by cuisine
					results = results.filter(r => r.cuisine_type == cuisine);
				}
				if (neighborhood != 'all') { // filter by neighborhood
					results = results.filter(r => r.neighborhood == neighborhood);
				}
				callback(null, results);
			}
		});
	}

	/**
	 * Fetch all neighborhoods with proper error handling.
	 */
	static fetchNeighborhoods(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all neighborhoods from all restaurants
				const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
				// Remove duplicates from neighborhoods
				const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
				callback(null, uniqueNeighborhoods);
			}
		});
	}

	/**
	 * Fetch all cuisines with proper error handling.
	 */
	static fetchCuisines(callback) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				// Get all cuisines from all restaurants
				const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
				// Remove duplicates from cuisines
				const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
				callback(null, uniqueCuisines);
			}
		});
	}

	/**
	 * Restaurant page URL.
	 */
	static urlForRestaurant(restaurant) {
		return (`./restaurant.html?id=${restaurant.id}`);
	}

	/**
	 * Restaurant image URL.
	 */
	static imageUrlForRestaurant(restaurant) {
		const image = restaurant.photograph || 'restaurant-placeholder';
		return (`/img/${image}`);
	}

	/**
	 * Map marker for a restaurant.
	 */
	static mapMarkerForRestaurant(restaurant, map) {
		const marker = new google.maps.Marker({
			position: restaurant.latlng,
			title: restaurant.name,
			url: DBHelper.urlForRestaurant(restaurant),
			map: map,
			animation: google.maps.Animation.DROP
		});
		return marker;
	}

}