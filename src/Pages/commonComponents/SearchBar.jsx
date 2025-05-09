import { BellIcon, Search2Icon, SmallCloseIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Kbd, IconButton, Image, InputGroup, InputLeftElement, InputRightElement, Skeleton, Stack, Tag, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangaByName, setLoading, setSearchValue } from "../../store/searchSlice";
import { useEffect, useMemo, useRef } from "react";
import { MangaStatusColors } from "../../config/constants";
import useMangaImage from "../../hooks/useMangaImage";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@chakra-ui/media-query";

function SearchBar({ isMangaDetailsPage = false }) {
    const searchValue = useSelector((state) => state.search.searchValue);
    const options = useSelector((state) => state.search.options);
    const loading = useSelector((state) => state.search.loading);
    const dispatch = useDispatch();
    const { colorMode } = useColorMode()
    const dark = useMemo(() => colorMode === 'dark', [colorMode])
    const handleChangeSearchVal = ({ target: { value } }) => dispatch(setSearchValue(value));
    const navigate = useNavigate()
    const searchInputRef = useRef(null);
    const [isMobile] = useMediaQuery("(max-width: 768px)")

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                event.stopPropagation();
                if (searchInputRef.current) {
                    if (document.activeElement === searchInputRef.current) {
                        searchInputRef.current.blur();
                    } else {
                        searchInputRef.current.focus();
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    useEffect(() => {
        !loading && dispatch(setLoading(true))
        const getData = setTimeout(() => { searchValue && dispatch(fetchMangaByName(searchValue)) }, 300)
        return () => clearTimeout(getData);
    }, [searchValue, dispatch, loading])

    const onSelectOption = (option) => {
        const { item: { originalValue } } = option
        navigate(`/manga/${originalValue}`)
    }

    const handleFocus = () => {
        if (searchValue && options.length === 0) {
            dispatch(fetchMangaByName(searchValue))
        }
    }

    return (
        <Box className="min-w-[300px] max-w-[1200px] w-[80%] relative">
            <AutoComplete openOnFocus rollNavigation={true} onSelectOption={onSelectOption} disableFilter={true} isLoading={loading}>
                <InputGroup className="backdrop-blur-sm bg-white/5 rounded-2xl shadow-lg">
                    <InputLeftElement pointerEvents='none' height={'100%'}>
                        <Search2Icon color={dark ? 'gray.300' : 'blackAlpha.500'} />
                    </InputLeftElement>
                    <AutoCompleteInput 
                        variant="filled" 
                        placeholder="Search for manga..."
                        inputMode="search"
                        size={isMangaDetailsPage ? 'md' : 'lg'}
                        rounded={'2xl'} 
                        border={'none'} 
                        outline={'none'}
                        bg={dark ? 'rgba(44, 44, 44, 0.8)' : 'rgba(216, 232, 254, 0.8)'}
                        _focus={{ 
                            border: "none", 
                            bg: dark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(216, 232, 254, 0.9)',
                            boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.6)'
                        }}
                        _hover={{ 
                            bg: dark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(216, 232, 254, 0.9)'
                        }}
                        value={searchValue}
                        onChange={handleChangeSearchVal}
                        loadingIcon={<></>}
                        id='search-bar-input'
                        ref={searchInputRef}
                        onFocus={handleFocus}
                        className="transition-all duration-300"
                    />
                    {searchValue && (
                        <InputRightElement height={'100%'}>
                            <IconButton 
                                _hover={{ bg: dark ? 'rgba(103, 105, 115, 0.8)' : 'rgba(173, 173, 199, 0.8)' }} 
                                bg={dark ? 'rgba(128, 128, 128, 0.6)' : 'rgba(255, 255, 255, 0.3)'}
                                size={'xs'} 
                                onClick={() => handleChangeSearchVal({ target: { value: "" } })}
                                rounded="full"
                            >
                                <SmallCloseIcon />
                            </IconButton>
                        </InputRightElement>
                    )}
                </InputGroup>
                <AutoCompleteList 
                    maxH={'600px'} 
                    bg={dark ? 'rgba(44, 44, 44, 0.95) !important' : 'rgba(216, 232, 254, 0.95) !important'}
                    overflowY={'auto'}
                    className="backdrop-blur-md rounded-xl mt-2 border border-gray-200/20"
                    loadingState={
                        <Stack className="w-[100%] flex flex-col items-center overflow-y-auto">
                            {[1, 2, 3, 4].map((item) => (
                                <Skeleton key={item} rounded={'xl'} className="my-2 rounded-md w-[92%] md:w-[97%] h-[45px]" />
                            ))}
                        </Stack>
                    }
                >
                    {options.map((manga) => (
                        <AutoCompleteItem 
                            key={`option-${manga.id}`} 
                            value={manga.id} 
                            align="center" 
                            className="search-bar-autocomplete-listI-tem capitalize"
                        >
                            {loading ? <></> : <Items isMangaDetailsPage={isMangaDetailsPage} manga={manga} dark={dark} />}
                        </AutoCompleteItem>
                    ))}
                </AutoCompleteList>
            </AutoComplete>
            {!isMangaDetailsPage && !isMobile && (
                <Text 
                    className="flex w-full justify-center my-4 gap-2 items-center backdrop-blur-sm bg-white/5 p-2 rounded-lg" 
                    fontSize={'sm'} 
                    color={dark ? 'gray.400' : 'gray.900'}
                >
                    Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to Search
                </Text>
            )}
        </Box>
    );
}

export const TagRenderer = ({ colorScheme, children, size = 'sm' }) => (
    <Tag 
        className="animate-appear" 
        rounded={'xl'} 
        gap={size === 'lg' ? 3 : 1} 
        p={size === 'lg' && 2} 
        fontSize={size === 'lg' && 18} 
        fontWeight={'bold'} 
        width={'fit-content'} 
        colorScheme={colorScheme}
    >
        {children}
    </Tag>
);

export function Items({ manga, dark, isMangaDetailsPage }) {
    const { imageData, loading } = useMangaImage(manga.image)

    return (
        <Box 
            bg={dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(173, 205, 247, 0.6)'}
            className="flex w-full p-3 items-center my-2 mx-8 lg:mx-10 rounded-xl shadow-xl hover:scale-102 transition-all duration-300 ease-in-out backdrop-blur-sm"
        >
            {(!imageData || loading) ? (
                <Box width={'52px'}><Skeleton height={'52px'} width={'52px'} rounded="xl" /></Box>
            ) : (
                <Image 
                    p={{ sm: 0.5, md: 0 }} 
                    maxW={isMangaDetailsPage ? '6%' : '5%'} 
                    maxH={isMangaDetailsPage ? '6%' : '5%'} 
                    minW={'52px'} 
                    minH={'52px'} 
                    rounded={'xl'} 
                    objectFit='contain' 
                    src={imageData} 
                    alt='manga' 
                    display={!imageData && 'none'}
                    className="transition-transform hover:scale-105"
                />
            )}
            <Box className="ml-4">
                <Tooltip label={manga.title} hasArrow arrowSize={10} placement="top">
                    <Text noOfLines={2} className="font-medium">{manga.title}</Text>
                </Tooltip>
                <Box className="flex flex-col md:flex-row gap-2 mt-2">
                    {manga.status && (
                        <TagRenderer colorScheme={MangaStatusColors[manga.status]}>
                            {manga.year || 'unknown'} - {manga.status}
                        </TagRenderer>
                    )}
                    <Box className="gap-2 flex">
                        {manga.rating.value && (
                            <TagRenderer colorScheme={manga.rating.color}>
                                <StarIcon boxSize={3} />{manga.rating.value.toFixed(2)}
                            </TagRenderer>
                        )}
                        {manga.follows && (
                            <TagRenderer>
                                <BellIcon boxSize={3} />{manga.follows}
                            </TagRenderer>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default SearchBar;