import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, CircularProgress, CircularProgressLabel, IconButton, List, ListItem, Progress, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import MangaService from "../service/mangaService";
import { downloadMangaUsingFile, formatBytes } from "../utils";
import { removeCompletedDownloads } from "../store/mangaDownloaderSlice";
import { DownloadIcon } from "@chakra-ui/icons";

export const DownloadingQueue = ({ dispatch, downloadingQueue }) => {

    return <AccordionItem p={0} border={'none'} className="m-1 rounded-lg shadow-lg hover:rounded-lg">
        <AccordionButton className="rounded-lg ">
            <Box as="span" flex='1' textAlign='left'>
                Files Ready To Download
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4} pt={1}>
            <List spacing={3}>
                {downloadingQueue.map((downloadingItem, index) => <DownloadingItems key={downloadingItem.name} index={index} dispatch={dispatch} downloadingItem={downloadingItem} />)}
            </List>
        </AccordionPanel>
    </AccordionItem>
}


const DownloadingItems = ({ downloadingItem, index, dispatch }) => {

    downloadingItem.folderSize = downloadingItem.folderSize || 0;
    const name = useMemo(() => String(downloadingItem.name.split('split_here')[1] + (downloadingItem.method === 'byChapter' ? (' Chapter: ' + downloadingItem.chapters) : downloadingItem.volumes.length > 1 ? '' : ' Volume: ' + downloadingItem.volumes[0])), [downloadingItem.chapters, downloadingItem.method, downloadingItem.name]);
    const percentCompleted = Math.round((downloadingItem.loaded * 100) / downloadingItem.folderSize);

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
            <CircularProgress value={percentCompleted || 0} color='green.400'>
                <CircularProgressLabel>{percentCompleted || 0}%</CircularProgressLabel>
            </CircularProgress>
            <Box className="flex flex-col gap-1">
                <Text fontSize={16}> {name}</Text>
                <Box className="flex">
                    <Text flexGrow={1}>{formatBytes(downloadingItem.loaded || 0)} / {formatBytes(downloadingItem.folderSize)}</Text>
                    <Text>{formatBytes(downloadingItem.rate || 0) + '/s'}</Text>
                </Box>
            </Box>
            {downloadingItem.loaded === 0 && <IconButton aria-label={'download-button-queue'} background={'none'} size={'sm'} onClick={() => downloadManga(downloadingItem, dispatch, index)} >
                <DownloadIcon fontSize={20} />
            </IconButton>}
        </Box>
        {downloadingItem.loaded > 0 && <>
            <Box my={2} className="block">
                <Progress rounded={'md'} colorScheme='green' size='sm' value={percentCompleted || 0} />
            </Box>
        </>}
    </ListItem>

}