import { Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "./Header"
import Loader from "../common/Loader";

const DownloadManager = lazy(() => import("./DownloadManager"));

const Home = () => {
    return <Suspense fallback={<Loader />}>
        < Header />
        <Outlet />
        <DownloadManager />
    </Suspense >
}

export default Home;
