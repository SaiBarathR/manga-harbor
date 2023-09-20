import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    manga: {}
}

export const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers: {
        setManga: (state, action) => {
            state.manga = action.payload;
        }
    },
})

export const { setManga } = mangaSlice.actions

export default mangaSlice.reducer