import { Box } from "@chakra-ui/react";
import Header from "./Header"
import Toolbar from "./Toolbar";
import MangaDetails from "./MangaDetails";

const Home = () => {
    return (<Box className="max-w-[2560px] w-full h-screen">
        <Header />
        <MangaDetails />
        <Toolbar />
    </Box>
    );
}

export default Home;
