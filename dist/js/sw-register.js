var refreshing;function onOnline(){console.log("Going online"),DBHelper.submitOfflineReviews()}function onOffline(){console.log("Going offline")}navigator.serviceWorker.register("./sw.js").then(function(e){console.log("ServiceWorker registration successful"),navigator.serviceWorker.controller&&(e.waiting&&navigator.serviceWorker.controller.postMessage({action:"skipWaiting"}),e.installing&&navigator.serviceWorker.addEventListener("statechange",function(){"installed"==navigator.serviceWorker.controller.state&&navigator.serviceWorker.controller.postMessage({action:"skipWaiting"})}),e.addEventListener("updatefound",function(){navigator.serviceWorker.addEventListener("statechange",function(){"installed"==navigator.serviceWorker.controller.state&&navigator.serviceWorker.controller.postMessage({action:"skipWaiting"})})}))}).catch(function(e){console.log(`ServiceWorker registration failed: ${e}`)}),navigator.serviceWorker.addEventListener("controllerchange",function(){refreshing||(window.location.reload(),refreshing=!0)}),navigator.serviceWorker.ready.then(function(e){return e.sync.register("myFirstSync")}),window.addEventListener("online",onOnline),window.addEventListener("offline",onOffline);