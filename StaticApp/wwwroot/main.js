if (typeof SharedArrayBuffer === 'undefined') {
    if ("serviceWorker" in navigator) {
        // Register service worker
        navigator.serviceWorker.register("./headers-service-worker.js").then(
            function (registration) {
                console.log("COOP/COEP Service Worker registered", registration.scope);
                // If the registration is active, but it's not controlling the page
                if (registration.active && !navigator.serviceWorker.controller) {
                    window.location.reload();
                }
            },
            function (err) {
                console.log("COOP/COEP Service Worker failed to register", err);
            }
        );
    } else {
        console.warn("Cannot register a service worker");
    }
}

var sab = new SharedArrayBuffer(1024);
console.log("Created shared array buffer");


var appWorker = new Worker("./app-exe-worker.js");

console.log("Created app worker.");

appWorker.onmessage = function (e) {
    console.log('Message received from worker');
    console.log(e.data.message);

    fetch(e.data.url).then(function (response) {
        return response.text();
    }).then(function (data) {

        console.log(data);

        console.log(e.data.sab[0]); // 0;
        Atomics.store(e.data.sab, 0, 123);
        Atomics.notify(e.data.sab, 0, 1);

    }).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });


}

appWorker.postMessage("Hi worker.");