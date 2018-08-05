navigator.serviceWorker.register('./sw.js').then(function (reg) {
	console.log('ServiceWorker registration successful');

    if (!navigator.serviceWorker.controller) {
        return;
    }

    if (reg.waiting) {
        navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
    }

    if (reg.installing) {
        navigator.serviceWorker.addEventListener('statechange', function () {
            if (navigator.serviceWorker.controller.state == 'installed') {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
            }
        });
    }

    reg.addEventListener('updatefound', function () {
        navigator.serviceWorker.addEventListener('statechange', function () {
            if (navigator.serviceWorker.controller.state == 'installed') {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
            }
        });
    });

}).catch(function (err) {
	console.log(`ServiceWorker registration failed: ${err}`);
});

var refreshing;
navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
})

// Request a one-off sync:
navigator.serviceWorker.ready.then(function (swRegistration) {
    return swRegistration.sync.register('myFirstSync');
});

function onOnline() {
    console.log('Going online');
    DBHelper.submitOfflineReviews();
}

function onOffline() {
    console.log('Going offline');
}

window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
