import { createBrowserRouter } from "react-router-dom";
import MangaDetails from "../Pages/MangaDetails";

const router = createBrowserRouter([
    {
        path: "/manga/view/",
        element: <MangaDetails />,
    },
]);