import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'

const initialState = {
    mangaDetails: {},
    loading: false,
}

export const fetchMangaById = createAsyncThunk(
    'search/fetchMangaById',
    async (id) => {
        try {
            const resp = await MangaService.get('manga', id)
            return resp
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
            state.mangaDetails = { ...state.mangaDetails, ...action.payload.mangaData.data }
            state.loading = false;
        })
        builder.addCase(fetchMangaById.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchMangaById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { setManga } = mangaSlice.actions

export default mangaSlice.reducer