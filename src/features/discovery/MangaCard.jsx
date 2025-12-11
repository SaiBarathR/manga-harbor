import { Box, Image, Text, Badge, Tooltip } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import useMangaImage from '../../hooks/useMangaImage';
import { MangaStatusColors } from '../../config/constants';

const MangaCard = ({ manga }) => {
    const { imageData, loading } = useMangaImage(manga.image);

    return (
        <Link to={`/manga/${manga.id}`}>
            <div className="group relative flex flex-col gap-3 transition-all duration-300 hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm transition-all group-hover:shadow-md border border-slate-200 dark:border-slate-700">
                    {loading ? (
                        <div className="w-full h-full animate-pulse bg-slate-200 dark:bg-slate-700" />
                    ) : (
                        <Image
                            src={imageData}
                            alt={manga.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    )}
                    
                    {/* Overlay Gradient on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Floating Rating Badge */}
                    <div className="absolute top-2 right-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                        <StarIcon color="orange.400" w={3} h={3} />
                        {manga.rating?.value?.toFixed(1) || 'N/A'}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                    <Tooltip label={manga.title} placement="top" openDelay={500}>
                        <Text className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">
                            {manga.title}
                        </Text>
                    </Tooltip>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                        {manga.status && (
                             <Badge colorScheme={MangaStatusColors[manga.status] || 'gray'} variant="solid" className="rounded px-1.5 py-0.5 capitalize">
                                {manga.status}
                             </Badge>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                            {manga.year || 'Unknown Year'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MangaCard;
