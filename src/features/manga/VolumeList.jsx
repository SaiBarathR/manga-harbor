import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box, useToast } from '@chakra-ui/react';
import AppButton from '../../components/ui/AppButton';
import { DownloadIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addNewItemToDownloadQueue, downloadMangaByVolumeOrChapter } from '../../store/mangaDownloaderSlice';
import { useMemo } from 'react';

const ChapterRow = ({ chapter, volume, mangaId, title }) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { preparingZips, itemsToDownload } = useSelector((state) => state.mangaDownloader);

    const isQueued = useMemo(() => {
        // Helper to check if an item processing matches this chapter
        const matches = (item) => {
            // Check if names match (handling the split_here logic if present in name, or just title)
            // The slice uses `name.split('split_here')[1]` for some processing, but the state object has `name`.
            // Let's assume item.name *contains* the title. 
            // Better yet, knowing the bug was .includes(title), we should check method.
            
            // Check title match first roughly (or strict if we trust the name format active downloads use)
            if (!item.name.includes(title)) return false;

            if (item.method === 'byManga') return true;
            if (item.method === 'byVolume' && item.volumes && item.volumes.includes(volume)) return true;
            if (item.method === 'byChapter' && item.chapters && item.chapters.includes(chapter.chapter)) return true;
            
            return false;
        };

        const inPreparing = preparingZips.some(matches);
        const inActive = itemsToDownload.some(matches);

        return inPreparing || inActive;
    }, [preparingZips, itemsToDownload, title, volume, chapter.chapter]);

    const handleDownload = (e) => {
        e.stopPropagation();
        if (isQueued) return;

        const params = {
            name: title,
            volume: volume,
            chapter: chapter.chapter,
            method: 'byChapter'
        };
        // Simplified dispatch for now - assuming byChapter logic in slice handles single chapter
        // We need to match the exact payload structure expected by slice
        // The original logic was complex strings 'id/volume/chapter'
        const apiParams = `${mangaId}/${volume}/${chapter.chapter}`;
        dispatch(addNewItemToDownloadQueue(params));
        dispatch(downloadMangaByVolumeOrChapter(apiParams));

        toast({
            title: "Added to Queue",
            description: `Chapter ${chapter.chapter} added to downloads.`,
            status: "info",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
             variant: "solid",
        });
    };

    return (
        <div className="flex justify-between items-center py-3 px-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors group">
            <span className="font-medium text-slate-700 dark:text-slate-300">Chapter {chapter.chapter}</span>
            {isQueued ? (
                 <span className="text-xs text-brand-500 font-bold bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded">Queued</span>
            ) : (
                <AppButton 
                    variant="ghost" 
                    size="sm" 
                    className="!p-2 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={handleDownload}
                >
                    <DownloadIcon />
                </AppButton>
            )}
        </div>
    );
};

const VolumeItem = ({ volume, mangaId, title }) => {
    const volNum = volume.volume === 'none' ? '0' : volume.volume;
    const label = volume.volume === 'none' ? 'Unlisted Chapters' : `Volume ${volume.volume}`;

    return (
        <AccordionItem className="border !border-slate-200 dark:!border-slate-800 rounded-xl mb-4 overflow-hidden shadow-sm bg-white dark:bg-dark-surface">
            <h2>
                <AccordionButton className="!px-6 !py-4 hover:!bg-slate-50 dark:hover:!bg-white/5">
                    <Box as="span" flex='1' textAlign='left' className="font-bold text-lg text-slate-900 dark:text-white">
                        {label}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4} className="border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex flex-col">
                    {volume.chapters.map(ch => (
                        <ChapterRow 
                            key={ch.chapter} 
                            chapter={ch} 
                            volume={volNum} 
                            mangaId={mangaId} 
                            title={title}
                        />
                    ))}
                </div>
            </AccordionPanel>
        </AccordionItem>
    );
};

const VolumeList = ({ volumes, mangaId, title }) => {
    if (!volumes || volumes.length === 0) return null;

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white px-2">Volumes & Chapters</h3>
            <Accordion allowMultiple defaultIndex={[0]} className="!border-none">
                {volumes.map((vol) => (
                    <VolumeItem key={vol.volume} volume={vol} mangaId={mangaId} title={title} />
                ))}
            </Accordion>
        </div>
    );
};

export default VolumeList;
