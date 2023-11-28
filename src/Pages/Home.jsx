import Header from "./Header"
import DownloadManager from "./DownloadManager";
import { Outlet } from "react-router-dom";

const Home = () => {
    return <>
        <Header />
        <Outlet />
        <DownloadManager />
    </>
}

export default Home;
