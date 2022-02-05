self.addEventListener("install", function () {
    console.log('install');
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log('activate');

    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {

    console.log(`fetch0: (url: ${event.request.url} dst: ${event.request.destination}, mth: ${event.request.method}, mode: ${event.request.mode})`);

    if ((event.request.destination !== "document" && event.request.destination !== "sharedworker" && event.request.destination !== "worker")
        || event.request.method !== "GET") {
        return;
    }

    if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
        return;
    }

    console.log(`fetch1: (url: ${event.request.url} dst: ${event.request.destination}, mth: ${event.request.method}, mode: ${event.request.mode})`);

    event.respondWith(
        fetch(event.request)
            .then(function (response) {

                console.log(`fetch2: (url: ${event.request.url} dst: ${event.request.destination}, mth: ${event.request.method}, mode: ${event.request.mode}, rsp: ${response.status})`);

                // It seems like we only need to set the headers for index.html
                // If you want to be on the safe side, comment this out
                //if (!response.url.endsWith("/index.html")) return response;

                if (response.status === 0) {
                    return response;
                }

                const newHeaders = new Headers(response.headers);
                newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                const moddedResponse = new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders,
                });

                return moddedResponse;
            })
            .catch(function (e) {
                console.error(e);
            })
    );
});