import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'

const initialState = {
    volumesToDownload: [],
    loading: false,
}

const downloadManga = async (file, fileName) => {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}


export const downloadMangaById = createAsyncThunk(
    'manga/downloadMangaById',
    async (id) => {
        try {
            const { file, fileName } = await MangaService.download('download', id)
            downloadManga(file, fileName)
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
)

export const downloadMangaByVolumeOrChapter = createAsyncThunk(
    'manga/downloadMangaByVolumeOrChapter',
    async (params, { dispatch, getState }) => {
        try {
            const { file, fileName } = await MangaService.download('download', params);
            downloadManga(file, fileName);
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
        builder.addCase(downloadMangaByVolumeOrChapter.fulfilled, (state, action) => {
            state.volumesToDownload.shift()
            state.loading = false;
        })
        builder.addCase(downloadMangaByVolumeOrChapter.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(downloadMangaByVolumeOrChapter.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { addVolumeToDownloadQueue } = mangaDownloaderSlice.actions

export default mangaDownloaderSlice.reducer