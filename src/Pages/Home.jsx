import { Suspense, lazy } from "react";
import Header from "./Header"
// import DownloadManager from "./DownloadManager";
const DownloadManager = lazy(() => import("./DownloadManager"));
import { Outlet } from "react-router-dom";
import Loader from "../common/loader";

const Home = () => {
    return <Suspense fallback={<Loader />}>
        < Header />
        <Outlet />
        <DownloadManager />
    </Suspense >
}

export default Home;
