import { combineReducers, configureStore } from '@reduxjs/toolkit'
import mangaAppSlice from './mangaAppSlice';
import searchSlice from './searchSlice';

const combinedMangaAppReducers = combineReducers({
    mangaApp: mangaAppSlice,
    search: searchSlice
});

export const rootReducer = (state, action) => {
    // console.log('action', action)
    if (action.type === "Clear") {
        state = undefined;
    }
    return combinedMangaAppReducers(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
})