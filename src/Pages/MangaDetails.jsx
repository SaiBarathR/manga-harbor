import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Grid, GridItem, Heading, IconButton, Image, List, ListItem, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import React, { useEffect, } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMangaById, fetchVolumeList } from '../store/mangaSlice';
import { TagRenderer } from './commonComponents/SearchBar';
import useMangaImage from '../hooks/useMangaImage';
import { mangaStatusColors } from '../config/constants';
import { BellIcon, DownloadIcon, StarIcon } from '@chakra-ui/icons';
import { addVolumeToDownloadQueue, dowwnloadMangaByVolume } from '../store/mangaDownloader';

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
            <MangaDetailsHeader manga={mangaDetails} />
            <ToolbarItems id={mangaDetails.id} />
        </Box>
    </Box>)
}

const MangaDetailsHeader = ({ manga }) => {

    const imageData = useMangaImage(manga.image)

    return <Box _dark={{ bg: 'blackAlpha.600' }} bg={'#adcdf7'}
        className="flex w-full p-1 items-center  my-2 mx-8 lg:mx-10 md:p-2 lg:p-4 rounded-md shadow-xl">
        {!imageData ? <Box width={'252px'}> <Skeleton height={'330px'} width={'202px'} /> </Box> :
            <Image maxW={'10%'} maxH={'10%'} src={imageData} alt='m' display={!imageData && 'none'}
            />}
        <Box className="ml-8 self-start">
            <Tooltip label={manga.title} hasArrow arrowSize={10} placement="top" >
                <Heading >{manga.title}</Heading>
            </Tooltip>
            <Text py={2}>
                {manga.attributes && (manga.attributes.description.en || '')}
            </Text>
            <Box className="flex flex-col md:flex-row gap-2 md:gap-2 my-2">
                {manga.status && <TagRenderer sm={'lg'} colorScheme={mangaStatusColors[manga.status]}>{manga.year || 'unknown'} - {manga.status}</TagRenderer>}
                {manga.rating.value && <TagRenderer sm={'lg'} colorScheme={manga.rating.color}><StarIcon boxSize={3} />{manga.rating.value.toFixed(2)}</TagRenderer>}
                {manga.follows && <TagRenderer sm={'lg'} ><BellIcon boxSize={3} />{manga.follows}</TagRenderer>}
            </Box>
        </Box>
    </Box>
}

const ToolbarItems = ({ id }) => {
    const volumes = useSelector((state) => state.manga.volumes);
    const dispatch = useDispatch()

    const onClickDownload = async (volumeNumber) => {
        dispatch(addVolumeToDownloadQueue({ id: id, volumeNumber: volumeNumber === 'none' ? 0 : volumeNumber }))
        dispatch(dowwnloadMangaByVolume({ id: id, volumeNumber: volumeNumber === 'none' ? 0 : volumeNumber }))

    };

    return <Accordion className=" w-full" allowMultiple>
        <Grid templateColumns='repeat(6, 1fr)' gap={6} px={4} mb={20}>
            {volumes && volumes.length > 0 && volumes.map((volume) => volume.chapters.length > 0 && <GridItem w='100%' rounded={'lg'} key={volume.volume} >
                <AccordionItem p={0} border={'1px solid rgba(255, 255, 255, 0.16)'} className="m-1 my-2 rounded-lg shadow-lg hover:rounded-lg">
                    <AccordionButton className="rounded-lg">
                        <Box as="span" flex='1' textAlign='left'>
                            {volume.volume === 'none' ? 'Un-listested Chapters' : "Volume " + volume.volume}
                        </Box>
                        <Tooltip label={'Download Volume ' + volume.volume}>
                            <IconButton size={'sm'} mx={2} onClick={() => onClickDownload(volume.volume)}>
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} pt={1}>
                        <List spacing={3}  >
                            {volume.chapters.length > 0 && volume.chapters.map((chapter) => <ListItem key={chapter.chapter} className="flex gap-3 items-center">
                                Chapter {chapter.chapter}
                            </ListItem>)}
                        </List>
                    </AccordionPanel>
                </AccordionItem>
            </GridItem>
            )}
        </Grid>
    </Accordion>
}