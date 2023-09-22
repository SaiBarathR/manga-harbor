/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-anonymous-default-export */

const simpleWorker = () => {
    self.addEventListener("message", (e) => {
        try {
            console.time("Worker run");
            console.log("in worker", e)
            console.timeEnd("Worker run");
            return postMessage("sent to js thread");
        } catch (error) {
            return postMessage({ error });
        }
    });
};

export default simpleWorker;