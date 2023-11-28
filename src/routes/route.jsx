import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from 'react';
import Home from "../Pages/Home";
import Loader from "../common/loader";

const MangaDetails = lazy(() => import('../Pages/MangaDetails'));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "manga/:mangaId",
                element: (
                    <Suspense fallback={<Loader />}>
                        <MangaDetails />
                    </Suspense>
                ),
            },
        ],
    }
]);