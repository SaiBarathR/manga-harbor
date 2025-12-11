import { Heading, Text, Progress, IconButton, Badge } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import MangaService from '../../service/mangaService';
import { downloadMangaUsingFile, formatBytes } from '../../utils';
import { removeCompletedDownloads } from '../../store/mangaDownloaderSlice';
import AppCard from '../../components/ui/AppCard';

const DownloadingItem = ({ item, index, dispatch }) => {
    // Logic from old DownloadingQueue.jsx
    const name = useMemo(() => String(item.name.split('split_here')[1] + (item.method === 'byChapter' ? (' Chapter: ' + item.chapters) : item.volumes.length > 1 ? '' : ' Volume: ' + item.volumes[0])), [item]);
    const percentCompleted = Math.round((item.loaded * 100) / item.folderSize) || 0;

    const startDownload = async () => {
        try {
            const { file, fileName } = await MangaService.download('download', item, index, dispatch);
            console.log('downloaded file: ', fileName);
            downloadMangaUsingFile(file, fileName);
            dispatch(removeCompletedDownloads(item));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AppCard className="flex flex-col gap-4 animate-slide-up">
            <div className="flex justify-between items-start">
                <div>
                   <Text className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{name}</Text>
                   <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                       <span>{formatBytes(item.loaded || 0)} / {formatBytes(item.folderSize)}</span>
                       <span className="font-mono">{formatBytes(item.rate || 0)}/s</span>
                   </div>
                </div>
                {item.loaded === 0 && (
                    <IconButton 
                        icon={<DownloadIcon />} 
                        aria-label="Start Download"
                        colorScheme="green"
                        className="!rounded-lg"
                        onClick={startDownload}
                    />
                )}
            </div>
            
            <div className="space-y-2">
                <Progress 
                    value={percentCompleted} 
                    size="sm" 
                    colorScheme="blue" 
                    className="rounded-full" 
                    hasStripe={item.loaded > 0} 
                    isAnimated={item.loaded > 0} 
                />
                 <div className="flex justify-end">
                    <Badge colorScheme={percentCompleted === 100 ? 'green' : 'blue'}>
                        {percentCompleted}%
                    </Badge>
                </div>
            </div>
        </AppCard>
    );
};

const PreparingItem = ({ item }) => {
    // Logic from old PreparingForDownloadList.jsx
    // Flatten items for display if needed, or just show summary
    // The old one mapped chapters/volumes. Let's simplify for the clean UI.
    const displayName = `${item.name} (${item.method === 'byChapter' ? item.chapters.length + ' Chapters' : 'Volume ' + item.volumes.join(', ')})`;

    return (
        <AppCard className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <Text className="font-medium text-slate-700 dark:text-slate-300">{displayName}</Text>
            </div>
            <Badge variant="outline" colorScheme="orange">Preparing...</Badge>
        </AppCard>
    );
};

const DownloadsPage = () => {
    const dispatch = useDispatch();
    const { preparingZips, itemsToDownload } = useSelector((state) => state.mangaDownloader);

    const hasDownloads = preparingZips.length > 0 || itemsToDownload.length > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-appear">
            <div>
                <Heading className="text-3xl font-black text-slate-900 dark:text-white mb-2">Download Queue</Heading>
                <Text className="text-slate-500 dark:text-slate-400">Manage your active and pending downloads here.</Text>
            </div>

            {!hasDownloads ? (
                 <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Text className="text-slate-400 font-medium text-lg">Your queue is empty.</Text>
                    <Text className="text-slate-500 text-sm mt-2">Go discover some manga to download!</Text>
                 </div>
            ) : (
                <div className="space-y-6">
                    {/* Preparing Section */}
                    {preparingZips.length > 0 && (
                        <div className="space-y-4">
                            <Text className="font-bold text-sm uppercase tracking-wider text-slate-400">Preparing Files</Text>
                            {preparingZips.map((item, i) => (
                                <PreparingItem key={`${item.name}-${i}`} item={item} />
                            ))}
                        </div>
                    )}

                    {/* Active Section */}
                    {itemsToDownload.length > 0 && (
                        <div className="space-y-4">
                            <Text className="font-bold text-sm uppercase tracking-wider text-slate-400">Ready to Download</Text>
                            {itemsToDownload.map((item, i) => (
                                <DownloadingItem key={`${item.name}-${i}`} item={item} index={i} dispatch={dispatch} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DownloadsPage;
