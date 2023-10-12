import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'

const initialState = {
    downloading: {
        volumes: [],
        chapters: []
    },
    itemsToDownload: [],

}

export const downloadMangaByVolumeOrChapter = createAsyncThunk(
    'manga/downloadMangaByVolumeOrChapter',
    async (params, { dispatch, getState }) => {
        try {
            const resp = await MangaService.get('download', params);
            console.log("Manga download data", resp)
            return resp;
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
)

export const mangaDownloaderSlice = createSlice({
    name: 'mangaDownloaderSlice',
    initialState,
    reducers: {
        addVolumeToDownloadQueue: (state, action) => {
            if (action.payload.length) {
                state.volumesToDownload = [...state.volumesToDownload, ...action.payload]
            }
            else {
                state.volumesToDownload.push(action.payload);
            }
        },
        updateItemsToDownload: (state, action) => {
            const index = state.itemsToDownload.findIndex((item) => item.name === action.payload.name)
            if (index > -1) {
                state.itemsToDownload[index] = action.payload
            }

        },
        removeCompletedDownloads: (state, action) => {
            state.itemsToDownload = state.itemsToDownload.filter((item) => item.name !== action.payload.name)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(downloadMangaByVolumeOrChapter.fulfilled, (state, action) => {
            const itemToDownload = { ...action.payload, loaded: 0, rate: 0 }
            state.itemsToDownload.push(itemToDownload);
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

export const { addVolumeToDownloadQueue, updateItemsToDownload, removeCompletedDownloads } = mangaDownloaderSlice.actions

export default mangaDownloaderSlice.reducer