import { Box, Text, } from "@chakra-ui/react";
import SearchBar from "./commonComponents/SearchBar";
import DisplayImage from "./commonComponents/DisplayImage";
import HeaderImage from '../icons/headerIcon.png'
import { ThemeSwitcher } from "./commonComponents/ModeSwitcherButton";
import { useLocation, useNavigate } from "react-router-dom";
import AdditionalInfo from "../utils/AdditionalInfo";

const Header = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const isMangaDetailsPage = pathname.includes('manga')
    const onClickHeader = () => navigate('/');

    return (
        <Box className={`flex flex-col gap-4 items-center px-4 min-h-[100px] w-full transition-all duration-300 ease-in-out backdrop-blur-sm ${isMangaDetailsPage ? "h-[10%] max-h-[100px] justify-center md:flex-row md:justify-between" : "h-screen justify-start pt-[15%]"}`}>
            <Box className="flex gap-4 items-center min-w-[280px] transition-all duration-300 ease-in-out bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <DisplayImage 
                    imgSrc={HeaderImage} 
                    boxProps={{ 
                        onClick: onClickHeader, 
                        cursor: 'pointer',
                        className: "transition-transform hover:scale-105"
                    }} 
                />
                <Text 
                    className="text-3xl font-bold cursor-pointer hover:text-blue-400 transition-colors" 
                    onClick={onClickHeader}
                >
                    MangaHarbor
                </Text>
                <AdditionalInfo />
                <ThemeSwitcher />
            </Box>
            <SearchBar isMangaDetailsPage={isMangaDetailsPage} />
        </Box>
    );
}

export default Header;