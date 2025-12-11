import { Accordion } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { DownloadingQueue } from "./DownloadingQueue";
import { PreparingForDownloadList } from "./PreparingForDownloadList";

export default function DownloadManager() {

    const dispatch = useDispatch();
    const { preparingZips, itemsToDownload } = useSelector((state) => state.mangaDownloader);

    return <div className="fixed bottom-5 right-8 min-w-[320px] rounded-xl bold-card z-50 overflow-hidden shadow-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border">
        <Accordion className="max-h-[70vh] overflow-y-auto custom-scrollbar" allowMultiple={true} defaultIndex={[0]} >
            {preparingZips && preparingZips.length > 0 && <PreparingForDownloadList preparingZips={preparingZips} dispatch={dispatch} />}
            {itemsToDownload && itemsToDownload.length > 0 && <DownloadingQueue downloadingQueue={itemsToDownload} dispatch={dispatch} />}
        </Accordion>
    </div>
}

