// Run local server: py -m http.server 8000

let restaurants,
	neighborhoods,
	cuisines;
var map;
var markers = [];

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
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
	fetchNeighborhoods();
	fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
	DBHelper.fetchNeighborhoods((error, neighborhoods) => {
		if (error) { // Got an error
			console.error(error);
		} else {
			self.neighborhoods = neighborhoods;
			fillNeighborhoodsHTML();
		}
	});
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
	const select = document.getElementById('neighborhoods-select');
	neighborhoods.forEach(neighborhood => {
		const option = document.createElement('option');
		option.innerHTML = neighborhood;
		option.value = neighborhood;
		select.append(option);
	});
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
	DBHelper.fetchCuisines((error, cuisines) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			self.cuisines = cuisines;
			fillCuisinesHTML();
		}
	});
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
	const select = document.getElementById('cuisines-select');

	cuisines.forEach(cuisine => {
		const option = document.createElement('option');
		option.innerHTML = cuisine;
		option.value = cuisine;
		select.append(option);
	});
}

/**
 * Initialize Google map, called from HTML.
 */
// fetch('https://maps.googleapis.com/maps/api/js?key=AIzaSyAk5v6dqlev1D_TSJCGabEs-cphxeDn7z0&libraries=places', {
// 	method: 'GET',
//     mode: 'cors',
// 	headers: new Headers({
// 		'Access-Control-Allow-Origin': '*'
// 	})
// })
// .then(function(response) {
// 	console.log(response);
// }).catch(error => console.log(error));

window.initMap = () => {
	let loc = {
		lat: 40.722216,
		lng: -73.987501
	};
	self.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		center: loc,
		scrollwheel: false
	});
	updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
	const cSelect = document.getElementById('cuisines-select');
	const nSelect = document.getElementById('neighborhoods-select');

	const cIndex = cSelect.selectedIndex;
	const nIndex = nSelect.selectedIndex;

	const cuisine = cSelect[cIndex].value;
	const neighborhood = nSelect[nIndex].value;

	DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
		if (error) { // Got an error!
			console.error(error);
		} else {
			resetRestaurants(restaurants);
			fillRestaurantsHTML();
		}
	})
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
	// Remove all restaurants
	self.restaurants = [];
	const ul = document.getElementById('restaurants-list');
	ul.innerHTML = '';

	// Remove all map markers
	self.markers.forEach(m => m.setMap(null));
	self.markers = [];
	self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
	const ul = document.getElementById('restaurants-list');
	restaurants.forEach(restaurant => {
		ul.append(createRestaurantHTML(restaurant));
	});
	addMarkersToMap();
}

/**
 * Set srcset for different image formats
 */
setImgSrcset = (imageUrl, ext) => {
	return `${imageUrl}-800px.${ext} 800w,
	${imageUrl}-650px.${ext} 650w,
	${imageUrl}-500px.${ext} 500w,
	${imageUrl}-350px.${ext} 350w,
	${imageUrl}-220px.${ext} 220w`;
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
	const li = document.createElement('li');
	const figure = document.createElement('figure');
	const picture = document.createElement('picture');
	const webpSource = document.createElement('source');
	const image = document.createElement('img');
	const imageUrl = DBHelper.imageUrlForRestaurant(restaurant);

	webpSource.type = 'image/webp'
	webpSource.setAttribute('data-srcset', setImgSrcset(imageUrl, 'webp'));
	webpSource.setAttribute('data-sizes', 'auto');
	
	image.className = 'restaurant-img lazyload blur-up';
	image.alt = `Picture of ${restaurant.name} restaurant`;
	image.src = `data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`;
	image.setAttribute('data-srcset', setImgSrcset(imageUrl, 'jpg'));
	image.setAttribute('data-sizes', 'auto');
	image.setAttribute('data-src', `${imageUrl}.jpg`);

	picture.append(webpSource);
	picture.append(image);

	figure.className = 'restaurant-img-cont';
	figure.append(picture);

	li.append(figure);

	const name = document.createElement('h3');
	name.innerHTML = restaurant.name;
	li.append(name);

	const neighborhood = document.createElement('p');
	neighborhood.innerHTML = restaurant.neighborhood;
	li.append(neighborhood);

	const address = document.createElement('p');
	address.innerHTML = restaurant.address;
	li.append(address);

	const more = document.createElement('a');
	more.innerHTML = 'View Details';
	more.className = 'btn-more';
	more.href = DBHelper.urlForRestaurant(restaurant);
	li.append(more)

	return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
	restaurants.forEach(restaurant => {
		// Add marker to the map
		const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
		google.maps.event.addListener(marker, 'click', () => {
			window.location.href = marker.url
		});
		self.markers.push(marker);
	});
}