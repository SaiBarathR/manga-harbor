import { combineReducers, configureStore } from '@reduxjs/toolkit'
import searchSlice from './searchSlice';
import mangaSlice from './mangaSlice';

const combinedMangaAppReducers = combineReducers({
    search: searchSlice,
    manga: mangaSlice,
});

export const rootReducer = (state, action) => {
    console.log('action', action)
    if (action.type === "Clear") {
        state = undefined;
    }
    return combinedMangaAppReducers(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
})