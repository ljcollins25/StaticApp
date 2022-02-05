
console.log("Worker started.");
//var myapp = new Worker("app-exe-worker.js");

//myapp.postMessage("hi dedicated one");




onconnect = function (e) {
    var port = e.ports[0];
    console.log("Worker connected.");

    port.onmessage = function (e) {
        var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
        console.log(`Worker Result2: ${workerResult}`);

        //var sab = new SharedArrayBuffer(1024);

        //console.log("Created buffer");

        port.postMessage(workerResult);
    }

}