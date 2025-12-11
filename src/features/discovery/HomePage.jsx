import { Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import AppInput from '../../components/ui/AppInput';
import AppButton from '../../components/ui/AppButton';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMangaByName } from '../../store/searchSlice';
import MangaCard from './MangaCard';

const HomePage = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const { options: searchResults, loading } = useSelector((state) => state.search);

    const [hasSearched, setHasSearched] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Debounced Search Effect
    useEffect(() => {
        // If query is empty, stop typing state immediately
        if (!query.trim()) {
            setIsTyping(false);
            return;
        }

        const timer = setTimeout(() => {
            if (query.trim()) {
                setHasSearched(true);
                dispatch(fetchMangaByName(query));
                setIsTyping(false);
            }
        }, 1000); // reduced to 1s as requested

        return () => clearTimeout(timer);
    }, [query, dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Immediate search on submit
        if (query.trim()) {
            setHasSearched(true);
            setIsTyping(false);
            dispatch(fetchMangaByName(query));
        }
    };

    return (
        <div className="flex flex-col gap-12 py-12 md:py-20 text-center items-center max-w-4xl mx-auto">
            <div className="space-y-6 animate-slide-up">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
                    Discover your next <br/>
                    <span className="text-brand-500">Manga Adventure</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Search through thousands of manga, track volumes, and download them for offline reading.
                </p>
            </div>

            <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <AppInput 
                    placeholder="Search by title (e.g., One Piece)" 
                    icon={<SearchIcon />} 
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.trim()) setIsTyping(true);
                    }}
                    className="flex-1"
                />
                <AppButton type="submit" isLoading={isTyping || loading}>Search</AppButton>
            </form>

            {/* Results Grid */}
            <div className="w-full pt-12 border-t border-slate-200 dark:border-slate-800 mt-8">
                {loading || isTyping ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
                         {[...Array(10)].map((_, i) => (
                             <div key={i} className="space-y-3">
                                <div className="aspect-[2/3] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                             </div>
                         ))}
                    </div>
                ) : searchResults && searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10 animate-appear">
                        {searchResults.map((manga) => (
                            <MangaCard key={manga.id} manga={manga} />
                        ))}
                    </div>
                ) : hasSearched && query && !loading ? (
                     <div className="py-20 text-center">
                        <Text className="text-xl font-medium text-slate-500">No manga found for "{query}"</Text>
                        <Text className="text-slate-400 mt-2">Try searching for something else.</Text>
                     </div>
                ) : (
                    <div className="py-10 flex flex-col items-center gap-4 opacity-50">
                        <div className="text-6xl">📖</div>
                        <Text className="text-slate-400 font-medium">Start typing to see results...</Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
