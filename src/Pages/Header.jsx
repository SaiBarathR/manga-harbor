import { Box, Text } from "@chakra-ui/react";
import SearchBar from "./commonComponents/SearchBar";
import CustomImageViewer from "./commonComponents/ImageLoade";
import HeaderImage from '../icons/headerIcon.png'
import { ThemeSwitcher } from "./commonComponents/ModeSwitcherButton";

const Header = () => {
    return (
        <Box className="flex flex-col md:flex-row gap-4 items-center px-2 justify-center md:justify-between min-h-[100px]  h-[10%] w-full" >
            <Box className="flex gap-2 items-center">
                <CustomImageViewer imgSrc={HeaderImage} />
                <Text>
                    MangaHarbor
                </Text>
                <ThemeSwitcher />

            </Box>
            <SearchBar />

        </Box >
    );
}

export default Header;