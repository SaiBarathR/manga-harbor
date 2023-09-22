import { Box } from "@chakra-ui/react";
import Header from "./Header"
import React from "react";

const Home = () => {

    // const workerInstance = useMemo(() => createWebWorker(simpleWorker), []);
    // const { running, error, result = false, startProcessing, } = useWebWorker(workerInstance);    

    return (<Box className="max-w-[2560px] w-full">
        <Header />
    </Box>
    );
}

export default Home;