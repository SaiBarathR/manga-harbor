import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'

const initialState = {
    preparingZips: [],
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
        addNewItemToDownloadQueue: (state, action) => {
            if (state.preparingZips.length > 0) {
                const index = state.preparingZips.findIndex((item) => item.name === action.payload.name);
                if (action.payload.chapter) {
                    state.preparingZips[index].chapters.push(action.payload.chapter)
                }
                else {
                    state.preparingZips[index].chapters.push(action.payload.volume.toString())
                }
            } else {
                const newItem = { name: action.payload.name, volumes: [], chapters: [] }
                if (action.payload.chapter) {
                    newItem.chapters.push(action.payload.chapter)
                }
                else {
                    newItem.volumes.push(action.payload.volume.toString())
                }
                state.preparingZips.push(newItem)
            }
        },
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
            const itemToDownloadInQueue = { ...action.payload, loaded: 0, rate: 0 }
            const name = itemToDownloadInQueue.name.split('split_here')[1];
            const currentPreparingZips = current(state.preparingZips);
            const index = currentPreparingZips.findIndex((item) => item.name === name);
            if (index > -1) {
                let itemFromZipQueue = structuredClone(currentPreparingZips[index]);
                if (itemToDownloadInQueue.volumes.length > 0) {
                    itemFromZipQueue.volumes = itemFromZipQueue.volumes.filter((item) => item !== itemToDownloadInQueue.volumes[0])
                }
                else {
                    itemFromZipQueue.chapters = itemFromZipQueue.chapters.filter((item) => item !== itemToDownloadInQueue.chapters)
                }
                if (itemFromZipQueue.volumes.length === 0 && itemFromZipQueue.chapters.length === 0) {
                    state.preparingZips = currentPreparingZips.filter((item) => item.name !== name)
                }
                else {
                    state.preparingZips[index] = itemFromZipQueue;
                }
            }
            state.itemsToDownload.push(itemToDownloadInQueue);
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

export const { addVolumeToDownloadQueue, updateItemsToDownload, removeCompletedDownloads, addNewItemToDownloadQueue } = mangaDownloaderSlice.actions

export default mangaDownloaderSlice.reducer