import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, CircularProgress, Grid, GridItem, Heading, IconButton, Image, List, ListItem, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import React, { useEffect, } from 'react'
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
            <ToolbarItems id={mangaDetails.id} title={mangaDetails.title} />
        </Box>
    </Box>)
}

const MangaDetailsHeader = ({ manga, dispatch }) => {

    const imageData = useMangaImage(manga.image)

    const onClickDownload = async () => {
        // dispatch(addVolumeToDownloadQueue(params))
        dispatch(downloadMangaByVolumeOrChapter(manga.id))
    };

    return <Box _dark={{ bg: 'blackAlpha.600' }} bg={'#adcdf7'}
        className="flex w-full p-1 items-center  my-2 mx-8 lg:mx-10 md:p-2 lg:p-4 rounded-md shadow-xl">
        {!imageData ? <Box width={'252px'}> <Skeleton height={'330px'} width={'202px'} /> </Box> :
            <Image rounded={'lg'} maxW={'10%'} maxH={'10%'} src={imageData} alt='m' display={!imageData && 'none'} />
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
                    <IconButton icon={<DownloadIcon />} />
                </ButtonGroup>
            </Box>
        </Box>
    </Box>
}

const ToolbarItems = ({ id, title }) => {
    const volumes = useSelector((state) => state.manga.volumes);
    const dispatch = useDispatch()

    const onClickDownload = async (vol, chapter = null) => {
        let volume = (vol === 'none') ? 0 : vol;
        const params = !chapter ? id + '/' + volume : id + '/' + volume + '/' + chapter;
        dispatch(addNewItemToDownloadQueue({ name: title, volume: volume, chapter: chapter }))
        dispatch(downloadMangaByVolumeOrChapter(params))
    };

    return <Accordion className=" w-full" allowMultiple>
        <Grid templateColumns='repeat(6, 1fr)' gap={6} px={4} mb={20}>
            {volumes && volumes.length > 0 && volumes.map((volume) => volume.chapters.length > 0 && <GridItem w='100%' rounded={'lg'} key={volume.volume} >
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
                                    <Button> Preparing Volume {volume.volume}</Button>
                                    <IconButton  >
                                        <DownloadIcon />
                                    </IconButton>
                                </ButtonGroup>
                            </ListItem>
                            {volume.chapters.length > 0 && volume.chapters.map((chapter) => <ListItem key={chapter.chapter} className="flex gap-3 items-center">
                                <ButtonGroup rounded={'lg'} isAttached variant='outline' onClick={() => onClickDownload(volume.volume, chapter.chapter)}>
                                    <Button> Chapter {chapter.chapter}</Button>
                                    <IconButton icon={<DownloadIcon />} />
                                </ButtonGroup>
                            </ListItem>)}
                        </List>
                    </AccordionPanel>
                </AccordionItem>
            </GridItem>
            )}
        </Grid>
    </Accordion>
}
