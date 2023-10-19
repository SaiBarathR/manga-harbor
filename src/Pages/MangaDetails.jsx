import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Grid, GridItem, Heading, IconButton, List, ListItem, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useMemo, } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMangaById, fetchVolumeList } from '../store/mangaSlice';
import { TagRenderer } from './commonComponents/SearchBar';
import useMangaImage from '../hooks/useMangaImage';
import { MangaStatusColors } from '../config/constants';
import { BellIcon, DownloadIcon, StarIcon } from '@chakra-ui/icons';
import { addNewItemToDownloadQueue, downloadMangaByVolumeOrChapter } from '../store/mangaDownloaderSlice';

export default function MangaDetails() {
    const mangaDetails = useSelector((state) => state.manga.mangaDetails);
    const loading = useSelector((state) => state.manga.loading);

    const dispatch = useDispatch()

    useEffect(() => {
        if (mangaDetails.id) {
            dispatch(fetchMangaById(mangaDetails.id))
            dispatch(fetchVolumeList(mangaDetails.id))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mangaDetails.id])

    return mangaDetails.id && (loading ? <Skeleton className='h-[82vh] w-full'>
    </Skeleton> : <Box className='w-[96%]'>
        <Box className='flex flex-col items-center'>
            <MangaDetailsHeader manga={mangaDetails} dispatch={dispatch} />
            <MangaFeed id={mangaDetails.id} title={mangaDetails.title} />
        </Box>
    </Box>)
}

const MangaDetailsHeader = ({ manga, dispatch }) => {

    const imageData = useMangaImage(manga.image)
    const volumes = useSelector((state) => state.manga.volumes);

    const onClickDownload = async () => {
        const params = {
            name: manga.title,
            volume: volumes.map(item => item.volume === 'none' ? '0' : item.volume),
            chapter: null
        }
        console.log("onClickDownload ~ byManga:", params, volumes)
        dispatch(addNewItemToDownloadQueue(params))
        dispatch(downloadMangaByVolumeOrChapter(manga.id))
    };

    return <Box _dark={{ bg: 'blackAlpha.600' }} bg={'#adcdf7'}
        className="flex w-full p-1 items-center  my-2 mx-8 lg:mx-10 md:p-2 lg:p-4 rounded-md shadow-xl">
        {!imageData ? <Box width={'252px'}> <Skeleton height={'330px'} width={'202px'} /> </Box> :
            // <Image rounded={'lg'} maxW={'10%'} maxH={'10%'} src={imageData} alt='m' display={!imageData && 'none'} />
            <></>
        }
        <Box className="ml-8 self-start flex flex-col">
            <Tooltip label={manga.title} hasArrow arrowSize={10} placement="top" >
                <Heading >{manga.title}</Heading>
            </Tooltip>
            <Text py={2}>
                {manga.attributes && (manga.attributes.description.en || '')}
            </Text>
            <Box className="flex flex-col md:flex-row gap-2 md:gap-2 my-2">
                {manga.status && <TagRenderer sm={'lg'} colorScheme={MangaStatusColors[manga.status]}>{manga.year || 'unknown'} - {manga.status}</TagRenderer>}
                {manga.rating.value && <TagRenderer sm={'lg'} colorScheme={manga.rating.color}><StarIcon boxSize={3} />{manga.rating.value.toFixed(2)}</TagRenderer>}
                {manga.follows && <TagRenderer sm={'lg'} ><BellIcon boxSize={3} />{manga.follows}</TagRenderer>}
                <ButtonGroup rounded={'lg'} isAttached variant='outline' onClick={onClickDownload}>
                    <Button>Download</Button>
                    <IconButton aria-label={'download-icon-manga'} icon={<DownloadIcon />} />
                </ButtonGroup>
            </Box>
        </Box>
    </Box>
}

const MangaFeed = ({ id, title }) => {
    const volumes = useSelector((state) => state.manga.volumes);
    const dispatch = useDispatch()
    const pendingList = useSelector((state) => state.mangaDownloader.preparingZips)
    const currentPendingList = useMemo(() => pendingList.length > 0 ? pendingList.filter((item) => item.name === title) : [], [pendingList, title])
    const method = (currentPendingList.length > 0 && currentPendingList[0].method) ? currentPendingList[0].method : null;

    const onClickDownload = async (vol, chapter = null) => {
        let volume = (vol === 'none') ? 0 : vol;
        const params = !chapter ? id + '/' + volume : id + '/' + volume + '/' + chapter;
        const newObj = { name: title, volume: volume, chapter: chapter };
        console.log('onClickDownload by chap/vol', newObj, params, volumes)
        dispatch(addNewItemToDownloadQueue(newObj))
        dispatch(downloadMangaByVolumeOrChapter(params))
    };

    return <Accordion className=" w-full" allowMultiple>
        <Grid templateColumns='repeat(6, 1fr)' gap={6} px={4} mb={20}>
            {volumes && volumes.length > 0 && volumes.map((volume) => volume.chapters.length > 0 &&
                <VolumeList
                    key={volume.volume}
                    currentPendingList={currentPendingList}
                    title={title}
                    volume={volume}
                    onClickDownload={onClickDownload}
                    method={method}
                />)}
        </Grid>
    </Accordion>
}

const VolumeList = ({ method, currentPendingList, volume, title, onClickDownload }) => {

    const pendingChapterList = useMemo(() => {
        const pendingChapterList = (currentPendingList[0]) ? currentPendingList[0].chapters || [] : []
        if (pendingChapterList.length > 0) {
            return volume.chapters.filter((item) => pendingChapterList.indexOf(item.chapter || '') !== -1)
        }
        return [];
    }, [currentPendingList, volume.chapters])

    const isChaptersDownloading = pendingChapterList.length > 0;
    const disableVolumeDownload = method ? (method === 'byManga' || currentPendingList[0].volumes.includes(volume.volume === 'none' ? '0' : volume.volume) || isChaptersDownloading) : false

    return <GridItem w='100%' rounded={'lg'}  >
        <AccordionItem p={0} border={'1px solid rgba(255, 255, 255, 0.16)'} className="m-1 my-2 rounded-lg shadow-lg hover:rounded-lg">
            <AccordionButton className="rounded-lg">
                <Box as="span" flex='1' textAlign='left'>
                    {volume.volume === 'none' ? 'Un-listed Chapters' : "Volume " + volume.volume}
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} pt={1}>
                <List spacing={3}  >
                    <ListItem>
                        <ButtonGroup rounded={'lg'} isAttached variant='outline' onClick={() => onClickDownload(volume.volume)}>
                            <Button isLoading={disableVolumeDownload} loadingText={`Preparing ${isChaptersDownloading ? 'Chapter' : 'Volume'} as Zip`} >
                                {volume.volume === 'none' ? 'Un-listed Chapters' : "Volume " + volume.volume}
                            </Button>
                            {(!disableVolumeDownload) && <IconButton aria-label={'download-icon-volume'}  >
                                <DownloadIcon />
                            </IconButton>}
                        </ButtonGroup>
                    </ListItem>
                    {(!disableVolumeDownload || isChaptersDownloading) && volume.chapters.length > 0 && volume.chapters.map((chapter, index) => <ChapterList pendingChapterList={pendingChapterList} key={chapter.chapter} method={method} volume={volume} chapter={chapter} onClickDownload={onClickDownload} />)}
                </List>
            </AccordionPanel>
        </AccordionItem>
    </GridItem>
}

const ChapterList = ({ pendingChapterList, chapter, method, volume, onClickDownload }) => {

    const disableChapter = pendingChapterList.filter(item => chapter.chapter === item.chapter).length > 0

    return <ListItem className="flex gap-3 items-center">
        <ButtonGroup rounded={'lg'} isAttached variant='outline' onClick={() => onClickDownload(volume.volume, chapter.chapter)}>
            <Button isLoading={disableChapter} loadingText={`Preparing Chapter ${chapter.chapter} as Zip`}> Chapter {chapter.chapter}</Button>
            {!disableChapter && <IconButton icon={<DownloadIcon />} aria-label={'download-icon-chapter'} />}
        </ButtonGroup>
    </ListItem>
}