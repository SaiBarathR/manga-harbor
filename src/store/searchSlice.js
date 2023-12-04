import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'
import { constructMangaDetails } from '../utils'

const initialState = {
    searchValue: "",
    options: [],
    loading: false,
    error: null
}

export const fetchMangaByName = createAsyncThunk(
    'search/fetchMangaByName',
    async (name) => {
        try {
            const resp = await MangaService.get('search', name)
            return { ...resp.mangaData, ...resp.statsResponse }
        }
        catch (e) {
            console.log(e)
        }
    }
)

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchValue: (state, action) => { state.searchValue = action.payload },
        setLoading: (state, action) => { state.loading = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMangaByName.fulfilled, (state, action) => {
            const stats = action.payload && (action.payload.statistics || null)
            state.options = action.payload.data.map((manga) => constructMangaDetails(manga, stats))
            state.loading = false;
        })
        builder.addCase(fetchMangaByName.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(fetchMangaByName.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { setSearchValue, setLoading } = searchSlice.actions

export default searchSlice.reducer