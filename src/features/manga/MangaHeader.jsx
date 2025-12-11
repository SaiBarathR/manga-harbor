import { Image, Text, Badge, useToast } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import useMangaImage from '../../hooks/useMangaImage';
import { MangaStatusColors } from '../../config/constants';
import AppButton from '../../components/ui/AppButton';
import AppCard from '../../components/ui/AppCard';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { addNewItemToDownloadQueue, downloadMangaByVolumeOrChapter } from '../../store/mangaDownloaderSlice';

const MangaHeader = ({ manga, dispatch }) => {
    const { imageData } = useMangaImage(manga.image);
    const volumes = useSelector((state) => state.manga.volumes);
    const { preparingZips, itemsToDownload } = useSelector((state) => state.mangaDownloader);
    const toast = useToast();
    
    // Check if manga is already downloading (simple check by name for now, or match 'byManga' method)
    const isDownloading = useMemo(() => {
        const inPreparing = preparingZips.some(item => item.name === manga.title);
        // Note: itemsToDownload names have 'split_here' logic, checking partial match or simplified logic
        const inActive = itemsToDownload.some(item => item.name.includes(manga.title));
        return inPreparing || inActive;
    }, [preparingZips, itemsToDownload, manga.title]);

    // Download Logic (Simplified for bold design)
    const onClickDownload = () => {
        if (isDownloading) return;

         const params = {
            name: manga.title,
            volume: volumes.map(item => item.volume === 'none' ? '0' : item.volume),
            chapter: null,
            method: 'byManga'
        };
        dispatch(addNewItemToDownloadQueue(params));
        dispatch(downloadMangaByVolumeOrChapter(manga.id));

        toast({
            title: "Download Queued",
            description: `All volumes of ${manga.title} have been added to the queue.`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "bottom-right",
            variant: "solid",
        });
    };

    if (!manga.id) return <div className="animate-pulse h-96 w-full bg-slate-100 dark:bg-slate-800 rounded-xl" />;

    return (
        <AppCard className="flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group">
            {/* Cover Image */}
            <div className="w-[240px] shrink-0 mx-auto md:mx-0 shadow-lg rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                {imageData ? (
                    <Image src={imageData} alt={manga.title} className="w-full h-auto object-cover" />
                ) : (
                    <div className="w-full h-[360px] bg-slate-200 dark:bg-slate-700 animate-pulse" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full space-y-6">
                <div className="space-y-4">
                     <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                        {manga.title}
                    </h1>
                    
                    <div className="flex flex-wrap gap-3">
                        <Badge colorScheme={MangaStatusColors[manga.status] || 'gray'} fontSize="0.9em" className="px-2 py-1 rounded">
                            {manga.status}
                        </Badge>
                        <Badge colorScheme="yellow" fontSize="0.9em" className="px-2 py-1 rounded flex items-center gap-1">
                            <StarIcon /> {manga.rating?.value?.toFixed(2)}
                        </Badge>
                        <Badge colorScheme="blue" fontSize="0.9em" className="px-2 py-1 rounded">
                            {manga.year}
                        </Badge>
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/5 p-6 rounded-xl border border-slate-100 dark:border-white/5">
                    <Text noOfLines={4}>{manga.attributes?.description?.en || 'No description available.'}</Text>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <AppButton 
                        onClick={onClickDownload} 
                        isLoading={isDownloading} 
                        loadingText="Queued"
                        isDisabled={isDownloading}
                    >
                        {isDownloading ? 'Downloading...' : 'Download All Volumes'}
                    </AppButton>
                    <AppButton variant="secondary">
                        Start Reading
                    </AppButton>
                </div>
            </div>
        </AppCard>
    );
};

export default MangaHeader;
