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

// const loadState = () => {
//     try {
//         const currentReduxStates = localStorage.getItem('state');
//         if (currentReduxStates === null) {
//             return undefined;
//         }
//         return JSON.parse(currentReduxStates);
//     } catch (e) {
//         console.log("error loading redux state from local storage", e)
//     }
// };
//
// const saveState = (state) => {
//     try {
//         const currentReduxStates = JSON.stringify(state);
//         localStorage.setItem('state', currentReduxStates);
//     } catch (e) {
//         console.log("Error saving redux state before reload", e)
//     }
// };

// window.addEventListener('beforeunload', () => {
//     saveState(store.getState());
// });
//
// window.removeEventListener('beforeunload', () => {
//     saveState(store.getState());
// });

export const store = configureStore({
    reducer: rootReducer,
    // preloadedState: loadState()
})