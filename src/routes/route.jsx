import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from 'react';
import Home from "../Pages/Home";
import Loader from "../common/Loader";

const MangaDetails = lazy(() => import('../Pages/MangaDetails'));

export const router = createBrowserRouter([
    {
        path: "*",
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
    },
]);