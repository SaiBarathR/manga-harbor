import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMangaById, fetchVolumeList } from '../store/mangaSlice';
import DetailsHeader from './MangaDetails/DetailsHeader';
import MangaContent from './MangaDetails/MangaContent';

export default function MangaDetails() {
    const mangaDetails = useSelector((state) => state.manga.mangaDetails);
    const [delayLoading, setDelayLoading] = useState(false);
    const loading = useSelector((state) => state.manga.loading) || delayLoading;

    const dispatch = useDispatch();
    const { mangaId } = useParams();

    useEffect(() => {
        if (mangaId) {
            dispatch(fetchMangaById(mangaId));
            dispatch(fetchVolumeList(mangaId));
        }
    }, [mangaId, dispatch]);

    useEffect(() => {
        if (loading) {
            setDelayLoading(true);
            const delay = setTimeout(() => setDelayLoading(false), 500);
            return () => clearTimeout(delay);
        }
    }, [loading]);

    return (
        <Box className='w-full min-h-screen flex flex-col items-center bg-dark-bg'>
             {/* Background Gradient for a premium feel */}
            <div className="fixed inset-0 bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg -z-10" />
            
            <DetailsHeader loading={loading} manga={mangaDetails} dispatch={dispatch} />
            <MangaContent loading={loading} id={mangaDetails.id || null} title={mangaDetails.title || null} />
        </Box>
    );
}