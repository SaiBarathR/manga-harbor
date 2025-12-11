import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMangaById, fetchVolumeList } from '../../store/mangaSlice';
import MangaHeader from './MangaHeader';
import VolumeList from './VolumeList';

const MangaDetailsPage = () => {
    const { mangaId } = useParams();
    const dispatch = useDispatch();
    
    const { mangaDetails, volumes, loading } = useSelector((state) => state.manga);

    useEffect(() => {
        if (mangaId) {
            dispatch(fetchMangaById(mangaId));
            dispatch(fetchVolumeList(mangaId));
        }
    }, [dispatch, mangaId]);

    // Cleanup or specialized loading state could go here

    return (
        <div className="pb-20">
            {/* Header Section */}
            <div className="animate-appear">
                 <MangaHeader manga={mangaDetails} dispatch={dispatch} />
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="mt-12 space-y-4 max-w-5xl mx-auto px-2">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <VolumeList volumes={volumes} mangaId={mangaDetails?.id} title={mangaDetails?.title} />
            )}
        </div>
    );
};

export default MangaDetailsPage;
