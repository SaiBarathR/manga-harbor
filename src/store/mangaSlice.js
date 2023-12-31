import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'
import { constructMangaDetails } from '../utils'

const initialState = {
    mangaDetails: {},
    volumes: [],
    loading: false,
}

export const fetchMangaById = createAsyncThunk(
    'manga/fetchMangaById',
    async (id) => {
        try {
            const resp = await MangaService.get('manga', id)
            return { ...resp.mangaData, ...resp.statsResponse }
        }
        catch (e) {
            console.log(e)
        }
    }
)

export const fetchVolumeList = createAsyncThunk(
    'manga/fetchVolumeList',
    async (id) => {
        try {
            const resp = await MangaService.get('volumes', id)
            return resp.reverse()
        }
        catch (e) {
            console.log(e)
        }
    }
)

export const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers: {
        setManga: (state, action) => {
            state.mangaDetails = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMangaById.fulfilled, (state, action) => {
            try {
                const stats = action.payload && (action.payload.statistics || null)
                state.mangaDetails = constructMangaDetails(action.payload.data, stats)
                state.loading = false;
            }
            catch (e) {
                console.log('Unable to fetch manga data', e)
            }
        })
        builder.addCase(fetchMangaById.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchMangaById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        builder.addCase(fetchVolumeList.fulfilled, (state, action) => {
            state.volumes = action.payload
            state.loading = false;
        })
        builder.addCase(fetchVolumeList.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchVolumeList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { setManga } = mangaSlice.actions

export default mangaSlice.reducer