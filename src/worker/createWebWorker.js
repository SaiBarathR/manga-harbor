// // worker.js
// // import api from "./testModule";

// const workercode = () => {
//     // eslint-disable-next-line no-restricted-globals
//     self.onmessage = function (e) {
//         // self.importScripts("./testModule"); // eslint-disable-line no-restricted-globals
//         // eslint-disable-line no-restricted-globals
//         console.log("Message received from main script");
//         setTimeout(() => {
//             var workerResult = "Received from main: " + e.data;
//             console.log("Posting message back to main script");
//             // self.postMessage(api.message()); // eslint-disable-line no-restricted-globals
//             self.postMessage(workerResult); // eslint-disable-line no-restricted-globals
//         }, 3000);
//     };
// };

// let code = workercode.toString();
// code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

// const blob = new Blob([code], { type: "application/javascript" });
// const worker_script = URL.createObjectURL(blob);

// module.exports = worker_script;

// eslint-disable-next-line no-restricted-globals

export const createWebWorker = (worker: any) => {
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")()"]);
    return new Worker(URL.createObjectURL(blob));
};