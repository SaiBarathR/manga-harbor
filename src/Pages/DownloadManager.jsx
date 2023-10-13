import { Accordion, Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { DownloadingQueue } from "./DownloadingQueue";
import { PreparingForDownloadList } from "./PreparingForDownloadList";

export default function DownloadManager() {

    const dispatch = useDispatch();
    const { preparingZips, itemsToDownload } = useSelector((state) => state.mangaDownloader);

    return <Box className="fixed bottom-5 min-w-[200px] rounded-lg right-8" bg={'#D8E8FE'} _dark={{ bg: '#2C2C2C' }}>
        <Accordion className="max-h-[70vh] overflow-y-auto" allowMultiple={true} defaultIndex={[0]} >
            {preparingZips && preparingZips.length > 0 && <PreparingForDownloadList preparingZips={preparingZips} dispatch={dispatch} />}
            {itemsToDownload && itemsToDownload.length > 0 && <DownloadingQueue downloadingQueue={itemsToDownload} dispatch={dispatch} />}
        </Accordion>
    </Box>
}

