import { createBrowserRouter } from "react-router-dom";
import MangaDetails from "../Pages/MangaDetails";
import Home from "../Pages/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "/manga/:mangaId",
                element: <MangaDetails />,
            },
        ],
    }
]);