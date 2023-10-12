import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Icon, IconButton, List, ListItem, Progress, Text, } from "@chakra-ui/react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MangaService from "../service/mangaService";
import { removeCompletedDownloads } from "../store/mangaDownloaderSlice";
import { downloadMangaUsingFile, formatBytes } from '../utils'
import { DownloadIcon } from "@chakra-ui/icons";

export default function DownloadManager() {

    const downloadingQueue = useSelector((state) => state.mangaDownloader.itemsToDownload)
    const dispatch = useDispatch();

    return downloadingQueue.length > 0 && <Box className="fixed bottom-5 min-w-[200px] rounded-lg right-8" bg={'#D8E8FE'} _dark={{ bg: '#2C2C2C' }}>
        <Accordion className="max-h-[70vh] overflow-y-auto" allowToggle defaultIndex={[0]} >
            <AccordionItem p={0} border={'none'} className="m-1 rounded-lg shadow-lg hover:rounded-lg">
                <AccordionButton className="rounded-lg ">
                    <Box as="span" flex='1' textAlign='left'>
                        Files Prepared To Download
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} pt={1}>
                    <List spacing={3}>
                        {downloadingQueue.map((downloadingItem, index) => <DownloadingItems key={downloadingItem.name} index={index} dispatch={dispatch} downloadingItem={downloadingItem} />)}
                    </List>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    </Box>
}


const DownloadingItems = ({ downloadingItem, index, dispatch }) => {

    const name = useMemo(() => downloadingItem.name.split('split_here')[1] + (downloadingItem.method === 'byChapter' ? (' Chapter: ' + downloadingItem.chapters) : downloadingItem.volumes.length > 1 ? '' : ' Volume: ' + downloadingItem.volumes[0]), [downloadingItem.chapters, downloadingItem.method, downloadingItem.name]);
    var percentCompleted = Math.round((downloadingItem.loaded * 100) / downloadingItem.folderSize);

    const downloadManga = async (downloadingItem, dispatch, index) => {
        try {
            const { file, fileName } = await MangaService.download('download', downloadingItem, index, dispatch);
            console.log('Prepared for downloading file: ', fileName)
            downloadMangaUsingFile(file, fileName)
            dispatch(removeCompletedDownloads(downloadingItem))
        }
        catch (e) {
            console.log(e)
        }
    }


    return downloadingItem && <ListItem className="p-4 rounded-lg shadow-xl" background={'#000000'}>
        <Box className="flex gap-3 items-center">
            <Text fontSize={16}> {name}</Text>
            {downloadingItem.loaded === 0 && <IconButton background={'none'} size={'sm'} onClick={() => downloadManga(downloadingItem, dispatch, index)}>
                <DownloadIcon fontSize={20} />
            </IconButton>}
        </Box>
        {downloadingItem.loaded > 0 && <>
            <Box className="flex gap-3 my-3">
                <Text flexGrow={1}>{formatBytes(downloadingItem.loaded || 0)} / {formatBytes(downloadingItem.folderSize)}</Text>
                <Text>{formatBytes(downloadingItem.rate || 0) + '/s'}</Text>
            </Box>
            <Box my={2}>
                <Progress rounded={'md'} colorScheme='green' size='sm' value={percentCompleted || 0} />
            </Box>
        </>}
    </ListItem>

}