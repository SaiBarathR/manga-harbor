/* eslint-disable no-restricted-globals */
/* eslint-disable import/no-anonymous-default-export */

import JSZip from "jszip";

const simpleWorker = () => {

    const resolveImageUrl = async (url) => {
        const response = await fetch(url);
        return response.ok ? await response.blob() : ''
    }

    const handleClick = (list) => {
        console.log("🚀 ~ file: simpleWorker.js:13 ~ handleClick ~ list:", list)

        // eslint-disable-next-line no-restricted-globals        
        const zip = new JSZip();
        const imgFolder = zip.folder("images");
        list.forEach(element => {
            console.log("🚀 ~ file: simpleWorker.js:19 ~ handleClick ~ element:", element)
            const imageBlob = resolveImageUrl(element.img);
            imgFolder.file(element.name + ".png", imageBlob);
        });

        zip.generateAsync({ type: "blob" }).then(function (content) {
            console.log('saving')
            // saveAs(content, "chp1.zip");
        });
    }

    // eslint-disable-next-line no-restricted-globals
    self.addEventListener("message", (e) => {
        try {
            console.time("Worker run");
            console.log("in workerrrrrrrrrrrrr", e.data)
            handleClick(e.data)
            console.timeEnd("Worker run");
            return postMessage("sent to js thread");
        } catch (error) {
            return postMessage({ error });
        }
    });
};

export default simpleWorker