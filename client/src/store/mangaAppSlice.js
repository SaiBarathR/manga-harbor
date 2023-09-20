import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false
}

export const mangaAppSlice = createSlice({
    name: 'mangaApp',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        }
    },
})

export const { setIsLoggedIn } = mangaAppSlice.actions

export default mangaAppSlice.reducer