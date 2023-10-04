import { Box, Image, Skeleton, Tag } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMangaById } from '../store/mangaSlice';
import MangaService from '../service/mangaService';

export default function MangaDetails() {
    const mangaDetails = useSelector((state) => state.manga.mangaDetails);
    const loading = useSelector((state) => state.manga.loading);
    const dispatch = useDispatch()
    const [imageData, setImageData] = useState(false);

    const getCoverImage = async () => {
        try { setImageData(URL.createObjectURL(new Blob([await MangaService.get('cover', mangaDetails.image, 'image')], { type: 'image/jpeg' }))); }
        catch (error) { console.log(error) }
    }

    useEffect(() => {
        const getData = setTimeout(() => { getCoverImage() }, 200)
        return () => clearTimeout(getData)
    }, [mangaDetails.image])

    useEffect(() => {
        if (mangaDetails.id) {
            dispatch(fetchMangaById(mangaDetails.id))
        }
    }, [mangaDetails.id])

    return mangaDetails.id && (loading ? <Skeleton className='h-[82vh] w-full'>
    </Skeleton> : <Box className='h-[82vh] w-full'>
        
    </Box>)
}
