import { combineReducers, configureStore } from '@reduxjs/toolkit'
import searchSlice from './searchSlice';
import mangaSlice from './mangaSlice';
import mangaDownloaderSlice from './mangaDownloaderSlice';

const combinedMangaAppReducers = combineReducers({
    search: searchSlice,
    manga: mangaSlice,
    mangaDownloader: mangaDownloaderSlice,
});

export const rootReducer = (state, action) => {
    if (action.type === "Clear") {
        state = undefined;
    }
    return combinedMangaAppReducers(state, action);
};

export const store = configureStore({
    reducer: rootReducer,    
})