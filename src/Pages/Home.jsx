import Header from "./Header"
// import Toolbar from "./Toolbar";
import MangaDetails from "./MangaDetails";
import DownloadManager from "./DownloadManager";
import { Box } from "@chakra-ui/react";

const Home = () => {
    return (<Box className="max-w-[2560px] w-full">
        <Header />
        <MangaDetails />
        {/* <Toolbar /> */}
        <DownloadManager />
    </Box>
    );
}

export default Home;
