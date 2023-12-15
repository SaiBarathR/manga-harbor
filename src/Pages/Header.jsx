import { Box, Text } from "@chakra-ui/react";
import SearchBar from "./commonComponents/SearchBar";
import DisplayImage from "./commonComponents/DisplayImage";
import HeaderImage from '../icons/headerIcon.png'
import { ThemeSwitcher } from "./commonComponents/ModeSwitcherButton";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const isMangaDetailsPage = pathname.includes('manga')
    const onClickHeader = () => navigate('/');

    return (
        <Box className={"flex flex-col gap-4 items-center px-2  min-h-[100px] w-full transition-all duration-500 ease-in-out" + (isMangaDetailsPage ? " h-[10%] max-h-[100px] justify-center md:flex-row md:justify-between " : " h-screen justify-start pt-[10%]")}>
            <Box className="flex gap-2 items-center min-w-[280px] transition-all duration-500 ease-in-out">
                <DisplayImage imgSrc={HeaderImage} boxProps={{ onClick: onClickHeader, cursor: 'pointer' }} />
                <Text className="text-2xl font-bold cursor-pointer" onClick={onClickHeader}>
                    MangaHarbor
                </Text>
                <ThemeSwitcher />
            </Box>
            <SearchBar isMangaDetailsPage={isMangaDetailsPage} />
        </Box >
    );
}

export default Header;