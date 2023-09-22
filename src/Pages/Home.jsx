import { Box, Button } from "@chakra-ui/react";
import Header from "./Header"
import React, { useMemo } from "react";
import { createWebWorker } from '../worker/createWebWorker'
import { useWebWorker } from '../worker/useWebWorker'
import simpleWorker from "../worker/simpleWorker";

const Home = () => {

    const workerInstance = useMemo(() => createWebWorker(simpleWorker), []);
    const { error, startProcessing, } = useWebWorker(workerInstance);
    console.log("🚀 ~ file: Home.jsx:12 ~ Home ~ error:", error)

    return (<Box className="max-w-[2560px] w-full">
        <Header />
        <Button onClick={
            () => {
                startProcessing([{ name: "1", img: "https://uploads.mangadex.org/data/781e590f147e501f280020762a764a5e/1-9bbc10bdb272795a6fc1d5fcea07703391654232afb6e51920d666535924cfba.png" },
                { name: "2", img: "https://uploads.mangadex.org/data/c66649ca3e87de8bcb1ed2f7e02b3cda/2-12a2ade33a956d75691048b955e87a12f894f047188c9edd90b6fab203b48310.png" },])
            }} >hi</Button>
    </Box>
    );
}

export default Home;


// const resolveImageUrl = async (url) => {
//     const response = await fetch(url);
//     return response.ok ? await response.blob() : ''
// }

// const handleClick = (list) => {
//     console.log("🚀 ~ file: simpleWorker.js:13 ~ handleClick ~ list:", list)
//     const zip = new JSZip();
//     const imgFolder = zip.folder("images");
//     list.forEach(element => {
//         console.log("🚀 ~ file: simpleWorker.js:19 ~ handleClick ~ element:", element)
//         const imageBlob = resolveImageUrl(element.img);
//         imgFolder.file(element.name + ".png", imageBlob);
//     });

//     zip.generateAsync({ type: "blob" }).then(function (content) {
//         console.log('saving')
//         saveAs(content, "chp1.zip");
//     });
// }

// handleClick([
//     { name: "1", img: "https://uploads.mangadex.org/data/781e590f147e501f280020762a764a5e/1-9bbc10bdb272795a6fc1d5fcea07703391654232afb6e51920d666535924cfba.png" },
//     { name: "2", img: "https://uploads.mangadex.org/data/c66649ca3e87de8bcb1ed2f7e02b3cda/2-12a2ade33a956d75691048b955e87a12f894f047188c9edd90b6fab203b48310.png" },
// ])