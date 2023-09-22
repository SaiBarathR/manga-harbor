import { useCallback, useEffect, useState } from "react";


export const useWebWorker = (worker) => {
    const [running, setRunning] = useState(false);
    const [error, setError] = useState();
    const [result, setResult] = useState();

    const startProcessing = useCallback(
        (data) => {
            setRunning(true);
            worker.postMessage(data);
        },
        [worker]
    );

    useEffect(() => {
        const onMessage = (event) => {
            console.log(event);
            setRunning(false);
            setError(event.data.error);
            setResult(event.data.result);
        };
        worker.addEventListener("message", onMessage);
        return () => worker.removeEventListener("message", onMessage);
    }, [worker]);

    return {
        startProcessing,
        running,
        error,
        result,
    };
};