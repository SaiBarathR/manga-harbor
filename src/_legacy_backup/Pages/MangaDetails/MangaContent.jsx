import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Grid, GridItem, IconButton, List, ListItem } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewItemToDownloadQueue, downloadMangaByVolumeOrChapter } from '../../store/mangaDownloaderSlice';

const ChapterItem = ({ pendingChapterList, chapter, method, volume, onClickDownload }) => {
    const disableChapter = pendingChapterList.filter(item => chapter.chapter === item.chapter).length > 0;

    return (
        <ListItem className="flex gap-3 items-center group py-1">
            <ButtonGroup size='sm' isAttached variant='outline' onClick={() => onClickDownload(volume.volume, chapter.chapter)} className="w-full shadow-sm hover:shadow-md transition-all">
                <Button
                    isLoading={disableChapter}
                    loadingText={disableChapter ? '' : ''}
                    className="!justify-start flex-1 !text-left !border-light-border dark:!border-white/10 group-hover:!border-brand-500 !text-light-text-secondary dark:!text-dark-text-secondary group-hover:!text-brand-600 dark:group-hover:!text-brand-400 transition-all overflow-hidden !bg-white dark:!bg-transparent"
                    variant="outline"
                >
                     <span className="truncate font-medium">Chapter {chapter.chapter}</span>
                </Button>
                {!disableChapter && (
                    <IconButton 
                        icon={<DownloadIcon />} 
                        aria-label={'download-icon-chapter'} 
                        variant="outline"
                        className="!border-light-border dark:!border-white/10 group-hover:!border-brand-500 !text-light-text-secondary dark:!text-dark-text-secondary group-hover:!text-brand-600 dark:group-hover:!text-brand-400 !bg-white dark:!bg-transparent"
                    />
                )}
            </ButtonGroup>
        </ListItem>
    );
};

const VolumeItem = ({ method, currentPendingList, volume, title, onClickDownload }) => {
    const pendingChapterList = useMemo(() => {
        const pendingChapterList = (currentPendingList[0]) ? currentPendingList[0].chapters || [] : [];
        if (pendingChapterList.length > 0) {
            return volume.chapters.filter((item) => pendingChapterList.indexOf(item.chapter || '') !== -1);
        }
        return [];
    }, [currentPendingList, volume.chapters]);

    const isChaptersDownloading = pendingChapterList.length > 0;
    const disableVolumeDownload = method ? (method === 'byManga' || currentPendingList[0].volumes.includes(volume.volume === 'none' ? '0' : volume.volume) || isChaptersDownloading) : false;

    return (
        <GridItem colSpan={1} className="w-full">
            <AccordionItem border={'none'} className="bold-card overflow-hidden hover:shadow-md transition-all duration-300">
                <h2>
                    <AccordionButton className="!px-5 !py-4 hover:!bg-slate-50 dark:hover:!bg-white/5 data-[expanded]:!bg-brand-50 data-[expanded]:dark:!bg-brand-900/20">
                        <Box as="span" flex='1' textAlign='left' className="font-bold text-lg text-light-text-primary dark:text-dark-text-primary">
                            {volume.volume === 'none' ? 'Un-listed Chapters' : "Volume " + volume.volume}
                        </Box>
                        <AccordionIcon className="text-slate-400 dark:text-slate-500" />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4} pt={2} className="bg-slate-50/50 dark:bg-black/20">
                    <List spacing={3}>
                        <ListItem>
                            <ButtonGroup size="md" isAttached variant='solid' className="w-full mb-3 shadow-sm" onClick={() => onClickDownload(volume.volume)}>
                                <Button
                                    isLoading={disableVolumeDownload}
                                    loadingText={disableVolumeDownload ? 'Queued' : ''}
                                    colorScheme="gray"
                                    className="flex-1 !bg-white dark:!bg-white/10 hover:!bg-slate-100 dark:hover:!bg-white/20 !text-light-text-primary dark:!text-dark-text-primary !border !border-light-border dark:!border-transparent !font-semibold"
                                >
                                    {volume.volume === 'none' ? 'Download All' : "Download Vol " + volume.volume}
                                </Button>
                                {(!disableVolumeDownload) && <IconButton aria-label={'download-icon-volume'} icon={<DownloadIcon />} className="!bg-white dark:!bg-white/10 hover:!bg-slate-100 dark:hover:!bg-white/20 !text-light-text-primary dark:!text-dark-text-primary !border !border-l-0 !border-light-border dark:!border-transparent" />}
                            </ButtonGroup>
                        </ListItem>
                        
                        <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                           {(!disableVolumeDownload || isChaptersDownloading) && volume.chapters.length > 0 && volume.chapters.map((chapter) =>
                                <ChapterItem
                                    pendingChapterList={pendingChapterList}
                                    key={chapter.chapter}
                                    method={method}
                                    volume={volume}
                                    chapter={chapter}
                                    onClickDownload={onClickDownload} 
                                />
                            )} 
                        </div>
                    </List>
                </AccordionPanel>
            </AccordionItem>
        </GridItem>
    );
};

const MangaContent = ({ id, title, loading }) => {
    const volumes = useSelector((state) => state.manga.volumes);
    const dispatch = useDispatch();
    const pendingList = useSelector((state) => state.mangaDownloader.preparingZips);
    const currentPendingList = useMemo(() => pendingList.length > 0 ? pendingList.filter((item) => item.name === title) : [], [pendingList, title]);
    const method = (currentPendingList.length > 0 && currentPendingList[0].method) ? currentPendingList[0].method : null;

    const onClickDownload = async (vol, chapter = null) => {
        let volume = (vol === 'none') ? '0' : vol.toString();
        const params = !chapter ? id + '/' + volume : id + '/' + volume + '/' + chapter;
        const newObj = { name: title, volume: volume, chapter: chapter, method: chapter ? 'byChapter' : 'byVolume' };
        dispatch(addNewItemToDownloadQueue(newObj));
        dispatch(downloadMangaByVolumeOrChapter(params));
    };

    if (loading) return <div className="flex justify-center my-16"><Button isLoading loadingText="Loading Volumes" variant="ghost" size="lg" className='!text-brand-500' /></div>;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 pb-16">
            <Accordion allowMultiple>
                <Grid gap={8} templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }} className='animate-appear'>
                    {volumes && volumes.length > 0 && volumes.map((volume) => volume.chapters.length > 0 &&
                        <VolumeItem
                            key={volume.volume}
                            currentPendingList={currentPendingList}
                            title={title}
                            volume={volume}
                            onClickDownload={onClickDownload}
                            method={method}
                        />)}
                </Grid>
            </Accordion>
        </div>
    );
};

export default MangaContent;
