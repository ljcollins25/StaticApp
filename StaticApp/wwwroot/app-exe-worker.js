console.log('Running exe worker');

var sab = new SharedArrayBuffer(1024);
const sab32 = new Int32Array(sab);

console.log("Created buffer");

onmessage = function (e) {
    console.log(`Worker: Message received from main script [${e.data}]`);

    console.log(`Sending request and waiting`);

    postMessage({ message: "from app-exe-worker", sab: sab32, url: "./data.txt" });

    Atomics.wait(sab32, 0, 0);
    console.log(sab32[0]); // 123

}