import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'

const initialState = {
    volumesToDownload: [],
    loading: false,
}

const downloadManga = async (blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manga.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}


export const downloadMangaById = createAsyncThunk(
    'manga/downloadMangaById',
    async (id) => {
        try {
            const blob = await MangaService.download('download', id)
            downloadManga(blob)
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
)

export const downloadMangaByVolume = createAsyncThunk(
    'manga/downloadMangaByVolume',
    async (data, { dispatch, getState }) => {
        try {
            const blob = await MangaService.download('download', data.id + '/volume/' + data.volumeNumber)
            downloadManga(blob)
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
)


export const mangaDownloaderSlice = createSlice({
    name: 'mangaDownloader',
    initialState,
    reducers: {
        addVolumeToDownloadQueue: (state, action) => {
            if (action.payload.length) {
                state.volumesToDownload = [...state.volumesToDownload, ...action.payload]
            }
            else {
                state.volumesToDownload.push(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(downloadMangaById.fulfilled, (state, action) => {
            state.loading = false;
        })
        builder.addCase(downloadMangaById.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(downloadMangaById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        builder.addCase(downloadMangaByVolume.fulfilled, (state, action) => {
            state.volumesToDownload.shift()
            state.loading = false;
        })
        builder.addCase(downloadMangaByVolume.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(downloadMangaByVolume.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { addVolumeToDownloadQueue } = mangaDownloaderSlice.actions

export default mangaDownloaderSlice.reducer