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
            console.log("Manga prepared to download data", resp)
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
            const index = state.preparingZips.length > 0 ? state.preparingZips.findIndex((item) => item.name === action.payload.name) : -1
            console.log("addNewItemToDownloadQueue index:", index)
            if (index > -1) {
                console.log("manga name already exist with data", state.preparingZips[index])
                console.log("new data for update action.payload", action.payload)
                if (action.payload.chapter) {
                    state.preparingZips[index].chapters.push(action.payload.chapter)
                    state.preparingZips[index].method = 'byChapter';
                    console.log('Updated By Chapter, newData after update:', state.preparingZips[index])
                }
                else {
                    const newVolumeForQueue = action.payload.volume;
                    console.log("newVolumeForQueue:", newVolumeForQueue)
                    if (typeof newVolumeForQueue === 'object') {
                        state.preparingZips[index].volumes = [...state.preparingZips[index].volumes, ...newVolumeForQueue];
                        console.log('Updated By byManga, newData after update:', state.preparingZips[index])
                        state.preparingZips[index].method = 'byManga';

                    } else {
                        if (newVolumeForQueue) {
                            state.preparingZips[index].volumes.push(newVolumeForQueue.toString())
                            console.log('Updated By byVolume, newData after update:', state.preparingZips[index])
                            state.preparingZips[index].method = 'byVolume';
                        } else {
                            state.preparingZips[index].method = 'unknown';
                            console.log("invalid Volume:", newVolumeForQueue)
                        }
                    }
                }
            } else {
                const newItem = { name: action.payload.name, volumes: [], chapters: [] }
                console.log("manga name doesn't exist within data so newItem is:", newItem)
                if (action.payload.chapter) {
                    newItem.chapters.push(action.payload.chapter)
                    console.log('adding By Chapter, newItem after update:', newItem)
                    newItem.method = 'byChapter';
                }
                else {
                    const newVolumeForQueue = action.payload.volume;
                    console.log("newVolumeForQueue:", newVolumeForQueue)
                    if (typeof newVolumeForQueue === 'object') {
                        newItem.volumes = newVolumeForQueue;
                        console.log('adding By byManga, newItem after update:', newItem)
                        newItem.method = 'byManga';

                    } else {
                        newItem.volumes.push(newVolumeForQueue.toString())
                        console.log('adding By byVolume, newItem after update:', newItem)
                        newItem.method = 'byVolume';
                    }
                }
                state.preparingZips.push(newItem)
            }
        },
        updateItemsToDownload: (state, action) => {
            const index = state.itemsToDownload.findIndex((item) => item.name === action.payload.name)
            if (index > -1) {
                state.itemsToDownload[index] = action.payload
            }
        },
        removeCompletedDownloads: (state, action) => {
            console.log('download completed so removing: ', action.payload)
            state.itemsToDownload = state.itemsToDownload.filter((item) => item.name !== action.payload.name)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(downloadMangaByVolumeOrChapter.fulfilled, (state, action) => {
            const itemToDownloadInQueue = { ...action.payload, loaded: 0, rate: 0 }
            const nameFromResp = itemToDownloadInQueue.name.split('split_here')[1];
            const currentPreparingZips = current(state.preparingZips);
            console.log('At remove process', "all currentPreparingZips:", currentPreparingZips)
            console.log('itemToDownloadInQueue from resp for removal', itemToDownloadInQueue)
            const index = currentPreparingZips.findIndex((item) => item.name === nameFromResp);
            console.log("Does manga from resp for removal is present in slice: ", index > -1, 'index', index)
            if (index > -1) {
                let itemFromZipQueue = structuredClone(currentPreparingZips[index]);
                console.log("old queue filtered from list: ", itemFromZipQueue)
                if (itemToDownloadInQueue.method === 'byVolume') {
                    itemFromZipQueue.volumes = itemFromZipQueue.volumes.filter((item) => !itemToDownloadInQueue.volumes.includes(item))
                    console.log("removed by volume in old queue", itemFromZipQueue)
                }
                else {
                    itemFromZipQueue.chapters = itemFromZipQueue.chapters.filter((item) => item !== itemToDownloadInQueue.chapters)
                    console.log("removed by chapter in old queue", itemFromZipQueue)
                }
                if (itemFromZipQueue.volumes.length === 0 && itemFromZipQueue.chapters.length === 0) {
                    console.log("deleting since vol/chap are 0 :", itemFromZipQueue)
                    state.preparingZips = currentPreparingZips.filter((item) => item.name !== nameFromResp)
                    console.log('total list after delete: ', (state.preparingZips))
                }
                else {
                    state.preparingZips[index] = itemFromZipQueue;
                    console.log('updated queue item vol/chap ');
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

export const { updateItemsToDownload, removeCompletedDownloads, addNewItemToDownloadQueue } = mangaDownloaderSlice.actions

export default mangaDownloaderSlice.reducer