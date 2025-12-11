import { Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderImage from '../icons/headerIcon.png';
import AdditionalInfo from "../utils/AdditionalInfo";
import DisplayImage from "./commonComponents/DisplayImage";
import SearchBar from "./commonComponents/SearchBar";
import ThemeToggle from "../components/ThemeToggle";

const Header = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const isMangaDetailsPage = pathname.includes('manga');
    const onClickHeader = () => navigate('/');

    return (
        <nav className={`w-full z-50 transition-all duration-300 ease-in-out px-6 py-4 border-b
            ${isMangaDetailsPage 
                ? "sticky top-0 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-sm dark:shadow-none border-light-border dark:border-dark-border" 
                : "flex flex-col items-center justify-center min-h-[40vh] gap-10 bg-transparent relative border-transparent"
            }`}>
            
            {/* Top Bar for Toggle (Absolute on Home, Relative on Details) */}
            <div className={`absolute top-4 right-6 z-50`}>
                <ThemeToggle />
            </div>

            {/* Logo Section */}
            <div className={`flex items-center gap-6 transition-all duration-300 ${isMangaDetailsPage ? 'w-full max-w-7xl mx-auto justify-between' : 'flex-col animate-appear'}`}>
                <div className="flex items-center gap-4 cursor-pointer group" onClick={onClickHeader}>
                    <DisplayImage 
                        imgSrc={HeaderImage} 
                        boxProps={{ 
                            cursor: 'pointer',
                            className: "transition-transform duration-300 group-hover:scale-105 drop-shadow-sm" 
                        }} 
                    />
                    <Text className={`font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 group-hover:to-brand-500 dark:group-hover:to-brand-accent transition-all
                        ${isMangaDetailsPage ? 'text-2xl' : 'text-5xl md:text-7xl'}`}>
                        MangaHarbor
                    </Text>
                     <div className={isMangaDetailsPage ? "hidden" : "block"}>
                         <AdditionalInfo />
                     </div>
                </div>

                {/* Search Bar Section */}
                 <div className={`transition-all duration-500 ${isMangaDetailsPage ? 'flex-1 max-w-xl mx-8' : 'w-full max-w-2xl transform hover:scale-[1.02]'}`}>
                    <SearchBar isMangaDetailsPage={isMangaDetailsPage} />
                </div>
                
                 {/* Additional Info for Details Page */}
                 <div className={isMangaDetailsPage ? "flex items-center" : "hidden"}>
                     <div className="scale-90 origin-right">
                        <AdditionalInfo />
                     </div>
                 </div>
            </div>
        </nav>
    );
};

export default Header;