import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import HttpService from '../service/http.service'

const initialState = {
    searchValue: "",
    options: [],
    loading: false,
    error: null
}

export const fetchMangaByName = createAsyncThunk(
    'search/fetchMangaByName',
    async (name) => {
        const resp = await HttpService.get('mangaList', {
            limit: 4,
            title: name,
            includes: ['cover_art']
        })
        const statRes = await HttpService.get('grpMangaStats', {
            manga: resp.data.map((manga) => manga.id)
        })
        return { ...resp, ...statRes }

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
        setSearchValue: (state, action) => {
            state.searchValue = action.payload;

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMangaByName.fulfilled, (state, action) => {
            state.loading = false;
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

export const { setSearchValue } = searchSlice.actions

export default searchSlice.reducer