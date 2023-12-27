import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Grid,
    GridItem, Heading, IconButton, Image, List, ListItem, Skeleton, Text, Tooltip, useMediaQuery
} from '@chakra-ui/react'
import { useEffect, useMemo, useState, } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMangaById, fetchVolumeList } from '../store/mangaSlice';
import { TagRenderer } from './commonComponents/SearchBar';
import useMangaImage from '../hooks/useMangaImage';
import { MangaStatusColors } from '../config/constants';
import { BellIcon, DownloadIcon, StarIcon } from '@chakra-ui/icons';
import { addNewItemToDownloadQueue, downloadMangaByVolumeOrChapter } from '../store/mangaDownloaderSlice';
import { useParams } from 'react-router-dom';

const RoundedSkeleton = (props) => <Skeleton rounded={'md'} {...props} />

export default function MangaDetails() {

    const mangaDetails = useSelector((state) => state.manga.mangaDetails);
    const loading = useSelector((state) => state.manga.loading);

    const dispatch = useDispatch()
    const { mangaId } = useParams()

    useEffect(() => {
        if (mangaId) {
            dispatch(fetchMangaById(mangaId))
            dispatch(fetchVolumeList(mangaId))
        }
    }, [mangaId, dispatch])

    return <Box className='w-[96%]'>
        <Box className='flex flex-col items-center'>
            <MangaDetailsHeader loading={loading} manga={mangaDetails} dispatch={dispatch} />
            <MangaFeed loading={loading} id={mangaDetails.id || null} title={mangaDetails.title || null} />
        </Box>
    </Box>
}

const MangaDetailsHeader = ({ manga = {}, loading = false, dispatch }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const imageData = useMangaImage(manga.image)
    const volumes = useSelector((state) => state.manga.volumes);
    const pendingList = useSelector((state) => state.mangaDownloader.preparingZips)
    const downloadLimit = useSelector((state) => state.mangaDownloader.downloadLimit)
    const currentPendingList = useMemo(() => pendingList.length > 0 ? pendingList.filter((item) => item.name === manga.title) : [], [pendingList, manga.title])
    const method = (currentPendingList.length > 0 && currentPendingList[0].method) ? currentPendingList[0].method : null;
    const isDownloadLimitReached = (downloadLimit <= pendingList.length)
    const disableMangaDownload = method || isDownloadLimitReached
    const toggleLines = () => setIsExpanded(!isExpanded);
    const [isMobile] = useMediaQuery("(max-width: 500px)")

    const onClickDownload = async () => {
        const params = {
            name: manga.title,
            volume: volumes.map(item => item.volume === 'none' ? '0' : item.volume),
            chapter: null,
            method: 'byManga'
        }
        console.log("onClickDownload ~ byManga:", params, volumes)
        dispatch(addNewItemToDownloadQueue(params))
        dispatch(downloadMangaByVolumeOrChapter(manga.id))
    };

    return <Box _dark={{ bg: 'blackAlpha.600' }} bg={'#adcdf7'} className="flex overflow-auto flex-col gap-2 md:flex-row w-full p-2 items-center animate-appear my-4 md:my-2 mx-8 lg:mx-10 md:p-4 lg:p-4 rounded-md shadow-xl">
        {(!imageData || loading) ? <RoundedSkeleton minW={'202px'} minH={'330px'} maxW={'10%'} maxH={'10%'} /> :
            <Image rounded={'lg'} maxW={'10%'} maxH={'10%'} src={imageData} alt='m' display={!imageData && 'none'} minW={'202px'} minH={'330px'} objectFit='contain' className='animate-appear' />
        }
        <Box className="md:ml-8 gap-3 self-start flex flex-col items-center w-full md:items-start">
            {loading ? <RoundedSkeleton m={1} ml={0} height={'56px'} width={'202px'} /> : manga.title && <Tooltip label={manga.title} hasArrow arrowSize={10} placement="top" >
                <Heading className='animate-appear' >{manga.title}</Heading>
            </Tooltip>}
            {loading ? <RoundedSkeleton height={'112px'} width={'100%'} /> : manga.attributes &&
                <>
                    <Text mt={2} className={'animate-appear ' + (isExpanded ? 'text-justify' : 'text-justify line-clamp-3')}>
                        {manga.attributes.description.en || ''}
                    </Text>
                    <Button className='animate-appear' mb={2} onClick={toggleLines} variant='link' colorScheme='blue' size='sm' >
                        {isExpanded ? 'Read Less' : 'Read More'}
                    </Button>
                </>
            }
            <Box className={(isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-2 gap-2 ') + ' lg:flex md:gap-4 my-2'}>
                {loading ? <RoundedSkeleton height={'40px'} width={'100px'} /> : manga.status && <TagRenderer sm={'lg'} colorScheme={MangaStatusColors[manga.status]}>{manga.year || 'unknown'} - {manga.status}</TagRenderer>}
                {loading ? <RoundedSkeleton height={'40px'} width={'72px'} /> : manga.rating && <TagRenderer sm={'lg'} colorScheme={manga.rating.color}><StarIcon boxSize={3} />{manga.rating.value.toFixed(2)}</TagRenderer>}
                {loading ? <RoundedSkeleton height={'40px'} width={'84px'} /> : manga.follows && <TagRenderer sm={'lg'} ><BellIcon boxSize={3} />{manga.follows}</TagRenderer>}
                {loading ? <RoundedSkeleton height={'40px'} width={'120px'} /> : (
                    (isDownloadLimitReached && manga.id) ?
                        <TagRenderer sm={'lg'} colorScheme={'red'}>
                            {`Max of ${downloadLimit} downloads reached`}
                        </TagRenderer>
                        :
                        manga.id && <ButtonGroup className='animate-appear' rounded={'lg'} isAttached variant='outline' onClick={onClickDownload}>
                            <Button isLoading={disableMangaDownload} loadingText='Preparing Zips'>Download</Button>
                            {!disableMangaDownload && <IconButton aria-label={'download-icon-manga'} icon={<DownloadIcon />} />}
                        </ButtonGroup>)
                }
            </Box>
        </Box>
    </Box>
}

const MangaFeed = ({ id, title, loading }) => {
    const volumes = useSelector((state) => state.manga.volumes);
    const dispatch = useDispatch()
    const pendingList = useSelector((state) => state.mangaDownloader.preparingZips)
    const currentPendingList = useMemo(() => pendingList.length > 0 ? pendingList.filter((item) => item.name === title) : [], [pendingList, title])
    const method = (currentPendingList.length > 0 && currentPendingList[0].method) ? currentPendingList[0].method : null;

    const onClickDownload = async (vol, chapter = null) => {
        let volume = (vol === 'none') ? '0' : vol.toString();
        const params = !chapter ? id + '/' + volume : id + '/' + volume + '/' + chapter;
        const newObj = { name: title, volume: volume, chapter: chapter, method: chapter ? 'byChapter' : 'byVolume' };
        console.log('onClickDownload by chap/vol', newObj, params, volumes)
        dispatch(addNewItemToDownloadQueue(newObj))
        dispatch(downloadMangaByVolumeOrChapter(params))
    };

    return loading ? <Button variant={'outline'} isLoading={true} loadingText='Loading Volumes' className='my-4 md:my-12' /> :
        <Accordion className=" w-full" allowMultiple>
            <Grid gap={6} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} className='animate-appear'>
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

    return <GridItem colSpan={1} className="w-full">
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
                            <Button
                                isLoading={disableVolumeDownload}
                                loadingText={disableVolumeDownload ? `Preparing ${isChaptersDownloading ? 'Chapter' : 'Volume'} as Zip` : ''}
                            >
                                {volume.volume === 'none' ? 'Un-listed Chapters' : "Volume " + volume.volume}
                            </Button>
                            {(!disableVolumeDownload) && <IconButton aria-label={'download-icon-volume'}  >
                                <DownloadIcon />
                            </IconButton>}
                        </ButtonGroup>
                    </ListItem>
                    {(!disableVolumeDownload || isChaptersDownloading) && volume.chapters.length > 0 && volume.chapters.map((chapter, index) =>
                        <ChapterList
                            pendingChapterList={pendingChapterList}
                            key={chapter.chapter}
                            method={method}
                            volume={volume}
                            chapter={chapter}
                            onClickDownload={onClickDownload} />
                    )}
                </List>
            </AccordionPanel>
        </AccordionItem>
    </GridItem>
}

const ChapterList = ({ pendingChapterList, chapter, method, volume, onClickDownload }) => {

    const disableChapter = pendingChapterList.filter(item => chapter.chapter === item.chapter).length > 0

    return <ListItem className="flex gap-3 items-center">
        <ButtonGroup rounded={'lg'} isAttached variant='outline' onClick={() => onClickDownload(volume.volume, chapter.chapter)}>
            <Button
                isLoading={disableChapter}
                loadingText={disableChapter ? `Preparing Chapter ${chapter.chapter} as Zip` : ''}
            >
                Chapter {chapter.chapter}
            </Button>
            {!disableChapter && <IconButton icon={<DownloadIcon />} aria-label={'download-icon-chapter'} />}
        </ButtonGroup>
    </ListItem>
}