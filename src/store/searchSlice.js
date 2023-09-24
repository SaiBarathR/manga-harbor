import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import MangaService from '../service/mangaService'

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

function getColorName(rating) {
    switch (true) {
        case (rating < 1):
            return "red";
        case (rating < 2):
            return "orange";
        case (rating < 3):
            return "yellow";
        case (rating < 4):
            return "pink";
        case (rating < 5):
            return "gray";
        case (rating < 6):
            return "gray";
        case (rating < 7):
            return "linkedin";
        case (rating < 8):
            return "purple";
        case (rating < 9):
            return "green";
        case (rating < 10):
            return "yellow";
        default:
            return "Invalid Rating";
    }
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchValue: (state, action) => { state.searchValue = action.payload },
        setLoading: (state, action) => { state.loading = action.payload }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMangaByName.fulfilled, (state, action) => {
            const stats = action.payload.statistics
            state.options = action.payload.data.map((manga, index) => {
                let relationShip = manga.relationships.filter((dataType) => dataType.type === 'cover_art')[0]
                return {
                    title: manga.attributes.title.en || manga.attributes.title.ja || manga.attributes.altTitles[0].en || '',
                    image: relationShip.attributes ? ('https://mangadex.org/covers/' + manga.id + '/' + relationShip.attributes.fileName) : "",
                    year: manga.attributes.year,
                    status: manga.attributes.status,
                    id: manga.id,
                    rating: { value: stats[manga.id].rating.average, color: getColorName(stats[manga.id].rating.average) },
                    follows: stats[manga.id].follows
                }
            })
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