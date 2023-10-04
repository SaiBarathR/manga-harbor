import { Box, Button, Skeleton } from '@chakra-ui/react'
import React, { useEffect, } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMangaById } from '../store/mangaSlice';
import { Items } from './commonComponents/SearchBar';

export default function MangaDetails() {
    const mangaDetails = useSelector((state) => state.manga.mangaDetails);
    const loading = useSelector((state) => state.manga.loading);
    const dispatch = useDispatch()

    useEffect(() => {
        if (mangaDetails.id) {
            dispatch(fetchMangaById(mangaDetails.id))
        }
    }, [mangaDetails.id])

    const onClickDownload = async () => {
        try {
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = 'http://localhost:9000/manga/download/' + mangaDetails.id;
            a.download = 'manga.zip';
            a.click();
            window.URL.revokeObjectURL('http://localhost:9000/manga/download/' + mangaDetails.id);
        } catch (error) {
            console.error('Error downloading manga:', error);
        }
    };

    return mangaDetails.id && (loading ? <Skeleton className='h-[82vh] w-full'>
    </Skeleton> : <Box className='h-[82vh] w-[96%]'>
        <Box className='flex flex-col items-center'>
            <Items dark={true} manga={mangaDetails} />
            <Button onClick={onClickDownload}>
                Download
            </Button>
        </Box>
    </Box>)
}
