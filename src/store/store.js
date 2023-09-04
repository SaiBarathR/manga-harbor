import { combineReducers, configureStore } from '@reduxjs/toolkit'
import mangaAppSlice from './mangaAppSlice';

const combinedMangaAppReducers = combineReducers({
    mangaApp: mangaAppSlice,
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