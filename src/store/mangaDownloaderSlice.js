import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'

const initialState = {
    preparingZips: [],
    itemsToDownload: [],
    downloadLimit: 3,
}

export const downloadMangaByVolumeOrChapter = createAsyncThunk(
    'manga/downloadMangaByVolumeOrChapter',
    async (params) => {
        try {
            const resp = await MangaService.get('download', params);
            console.log("Manga prepared to download data", resp)
            return resp;
        } catch (error) {
            if (error.response) {
                console.log((error.response.data))
            }
            console.error('An error occurred:', error);
        }
    }
)

export const mangaDownloaderSlice = createSlice({
    name: 'mangaDownloaderSlice',
    initialState,
    reducers: {
        addNewItemToDownloadQueue: (state, action) => {
            const { name, volume, chapter, method } = action.payload;
            const existingManga = state.preparingZips.find(item => item.name === name);
            if (existingManga) {
                existingManga.method = method;
                switch (method) {
                    case 'byChapter': existingManga.chapters.push(chapter); break;
                    case 'byVolume': existingManga.volumes.push(volume); break;
                    case 'byManga': existingManga.volumes.push(...volume); break;
                    default: return;
                }
            } else {
                state.preparingZips.push({
                    name: name, method: method,
                    chapters: method === 'byChapter' ? [chapter] : [],
                    volumes: method === 'byVolume' ? [volume] : method === 'byManga' ? volume : [],
                })
            }
        },
        updateItemsToDownload: (state, action) => {
            const { name } = action.payload;
            const index = state.itemsToDownload.findIndex(item => item.name === name);
            if (index > -1) {
                state.itemsToDownload[index] = action.payload;
            }
        },
        removeCompletedDownloads: (state, action) => {
            const { name } = action.payload;
            console.log('Download completed, removing:', name);
            state.itemsToDownload = state.itemsToDownload.filter(item => item.name !== name);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(downloadMangaByVolumeOrChapter.fulfilled, (state, action) => {
            try {
                const { name, method, volumes, chapters } = action.payload;
                const nameFromResp = name.split('split_here')[1];
                const index = state.preparingZips.findIndex(item => item.name === nameFromResp);
                if (index > -1) {
                    const itemFromZipQueue = state.preparingZips[index];
                    if (method === 'byVolume') {
                        itemFromZipQueue.volumes = itemFromZipQueue.volumes.filter(item => !volumes.includes(item));
                    } else {
                        itemFromZipQueue.chapters = itemFromZipQueue.chapters.filter(item => !chapters.includes(item));
                    }
                    if (itemFromZipQueue.volumes.length === 0 && itemFromZipQueue.chapters.length === 0) {
                        state.preparingZips = state.preparingZips.filter(item => item.name !== nameFromResp);
                    } else {
                        state.preparingZips[index] = itemFromZipQueue;
                    }
                }
                state.itemsToDownload.push({ ...action.payload, loaded: 0, rate: 0 });
                state.loading = false;
            }
            catch (err) {
                console.log(err)
            }
        });

        builder.addCase(downloadMangaByVolumeOrChapter.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(downloadMangaByVolumeOrChapter.rejected, (state) => {
            state.loading = false;
        });
    }

});

export const { updateItemsToDownload, removeCompletedDownloads, addNewItemToDownloadQueue } = mangaDownloaderSlice.actions;

export default mangaDownloaderSlice.reducer;
