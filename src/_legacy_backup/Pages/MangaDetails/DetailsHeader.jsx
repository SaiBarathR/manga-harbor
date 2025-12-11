import { Button, ButtonGroup, Collapse, IconButton, Image, Tooltip, useMediaQuery } from '@chakra-ui/react';
import { BellIcon, DownloadIcon, StarIcon } from '@chakra-ui/icons';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { TagRenderer } from '../commonComponents/SearchBar';
import useMangaImage from '../../hooks/useMangaImage';
import { MangaStatusColors } from '../../config/constants';
import { addNewItemToDownloadQueue, downloadMangaByVolumeOrChapter } from '../../store/mangaDownloaderSlice';

const Description = ({ children }) => {
    const [show, setShow] = useState(false);
    return (
        <>
            <Collapse startingHeight={42} in={show} className="text-light-text-secondary dark:text-dark-text-secondary text-sm md:text-base leading-relaxed">
                {children}
            </Collapse>
            <Button onClick={() => setShow(!show)} size="sm" variant="link" className="mt-2 !text-brand-500 dark:!text-brand-accent font-medium hover:underline">
                {show ? 'Read Less' : 'Read More...'}
            </Button>
        </>
    );
};

const DetailsHeader = ({ manga = {}, loading = false, dispatch }) => {
    const { imageData, loading: loadingImage } = useMangaImage(manga.image);
    const volumes = useSelector((state) => state.manga.volumes);
    const pendingList = useSelector((state) => state.mangaDownloader.preparingZips);
    const downloadLimit = useSelector((state) => state.mangaDownloader.downloadLimit);
    
    const currentPendingList = useMemo(() => pendingList.length > 0 ? pendingList.filter((item) => item.name === manga.title) : [], [pendingList, manga.title]);
    const method = (currentPendingList.length > 0 && currentPendingList[0].method) ? currentPendingList[0].method : null;
    const isDownloadLimitReached = (downloadLimit <= pendingList.length);
    const disableMangaDownload = method || isDownloadLimitReached;
    // eslint-disable-next-line no-unused-vars
    const [isMobile] = useMediaQuery("(max-width: 500px)");

    const onClickDownload = async () => {
        const params = {
            name: manga.title,
            volume: volumes.map(item => item.volume === 'none' ? '0' : item.volume),
            chapter: null,
            method: 'byManga'
        };
        dispatch(addNewItemToDownloadQueue(params));
        dispatch(downloadMangaByVolumeOrChapter(manga.id));
    };

    if (loading || loadingImage || !manga.id) {
        return (
            <div className="bold-card p-8 animate-pulse h-[330px] w-full max-w-7xl mx-auto flex gap-10 items-start my-8">
                 <div className="w-[200px] h-[300px] bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0" />
                 <div className="flex-1 space-y-4">
                     <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                     <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                 </div>
            </div>
        );
    }

    return (
        <div className="bold-card w-full max-w-7xl mx-auto p-8 flex flex-col md:flex-row gap-10 items-start animate-appear my-8 relative overflow-hidden bg-light-surface dark:bg-dark-surface transition-colors duration-200">
            
            {/* Image Section */}
            <div className="flex-shrink-0 mx-auto md:mx-0 relative z-10 group perspective-1000">
               {imageData && <Image 
                    src={imageData} 
                    alt={manga.title} 
                    className="rounded-lg shadow-md hover:shadow-xl transition-all duration-500 object-contain bg-white dark:bg-slate-800 w-[220px] h-[330px]"
                    fallback={<div className="w-[220px] h-[330px] bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />}
                />}
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-6 w-full z-10">
                <Tooltip label={manga.title} placement="top" hasArrow>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-light-text-primary dark:text-dark-text-primary leading-tight tracking-tight">{manga.title}</h1>
                </Tooltip>

                {manga.attributes && (
                    <div className="bg-white dark:bg-black/20 p-6 rounded-xl border border-light-border dark:border-white/5">
                        <Description>{manga.attributes.description.en || 'No description available.'}</Description>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 items-center mt-2">
                    {manga.status && <TagRenderer size='lg' colorScheme={MangaStatusColors[manga.status]}>{manga.year || '?'} - {manga.status}</TagRenderer>}
                    {manga.rating?.value && <TagRenderer size='lg' colorScheme={manga.rating.color}><StarIcon boxSize={3} className="mr-1" />{manga.rating.value.toFixed(2)}</TagRenderer>}
                    {manga.follows && <TagRenderer size='lg'><BellIcon boxSize={3} className="mr-1" />{manga.follows}</TagRenderer>}
                </div>
                
                {/* Actions */}
                <div className="mt-4 pt-6 border-t border-light-border dark:border-white/10 flex justify-end">
                    {isDownloadLimitReached && !method ? (
                        <TagRenderer size='lg' colorScheme='red'>Max Downloads Reached</TagRenderer>
                    ) : (
                        <ButtonGroup size='lg' isAttached variant='solid' className="shadow-sm">
                            <Button 
                                isLoading={disableMangaDownload} 
                                loadingText='Preparing' 
                                onClick={onClickDownload}
                                colorScheme="blue"
                                className="!bg-brand-500 hover:!bg-brand-600 !text-white !font-bold px-8"
                            >
                                Download All
                            </Button>
                            {!disableMangaDownload && <IconButton 
                                icon={<DownloadIcon />} 
                                aria-label="Download" 
                                onClick={onClickDownload}
                                className="!bg-brand-600 hover:!bg-brand-700 !text-white"
                            />}
                        </ButtonGroup>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsHeader;
