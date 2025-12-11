import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from 'react';
import MainLayout from '../layouts/MainLayout';
import Loader from "../common/Loader";

const HomePage = lazy(() => import('../features/discovery/HomePage'));
const DownloadsPage = lazy(() => import('../features/downloads/DownloadsPage'));
const MangaDetails = lazy(() => import('../features/manga/MangaDetailsPage')); 

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loader />}>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: "downloads",
                element: (
                    <Suspense fallback={<Loader />}>
                        <DownloadsPage />
                    </Suspense>
                ),
            },
            {
                path: "manga/:mangaId",
                element: (
                    <Suspense fallback={<Loader />}>
                        <MangaDetails />
                    </Suspense>
                ),
            },
        ],
    },
]);