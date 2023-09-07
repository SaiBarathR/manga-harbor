import { BellIcon, Search2Icon, SmallCloseIcon, StarIcon } from "@chakra-ui/icons";
import { Box, IconButton, Image, InputGroup, InputLeftElement, InputRightElement, Skeleton, Tag, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangaByName, setSearchValue } from "../../store/searchSlice";
import { useMemo, useState } from "react";
import { mangaStatusColors } from "../../config/constants";

function SearchBar() {
    const searchValue = useSelector((state) => state.search.searchValue);
    const options = useSelector((state) => state.search.options);
    const loading = useSelector((state) => state.search.loading);
    const dispatch = useDispatch();
    const { colorMode } = useColorMode()
    const dark = useMemo(() => colorMode === 'dark', [colorMode])

    const handleChangeSearchVal = ({ target: { value } }) => {
        dispatch(setSearchValue(value))
        value && dispatch(fetchMangaByName(value))
    }

    return (
        <Box className="min-w-[300px] max-w-[1200px] w-[80%]">
            <AutoComplete openOnFocus disableFilter={true} >
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                        <Search2Icon color={dark ? 'gray.300' : 'blackAlpha.500'} />
                    </InputLeftElement>
                    <AutoCompleteInput variant="filled" placeholder="search" size={'md'} rounded={'md'} border={'none'} outline={'none'}
                        bg={dark ? '#2C2C2C' : '#D8E8FE'}
                        _focus={{ border: "none", bg: dark ? '#2C2C2C' : '#D8E8FE', }}
                        _hover={{ bg: dark ? '#2C2C2C' : '#D8E8FE' }}
                        value={searchValue}
                        onChange={handleChangeSearchVal}
                    />
                    <InputRightElement>
                        <IconButton _hover={{ bg: dark ? '#676973' : '#adadc7' }} bg={dark ? 'gray' : 'whiteAlpha.300'} size={'xs'} onClick={() => handleChangeSearchVal({ target: { value: "" } })}>
                            <SmallCloseIcon />
                        </IconButton>
                    </InputRightElement>
                </InputGroup>
                <AutoCompleteList maxH={'600px'} bg={dark ? '#2C2C2C !important' : '#D8E8FE !important'}>
                    {options.map((manga, index) => {
                        return <AutoCompleteItem key={`option-${manga.id}`} value={manga.title} align="center" className="searchbarAutocompleListItem capitalize"                        >
                            {loading ? <Skeleton className="my-2 mx-8 rounded-md" height={'45px'} width={`${(window.innerWidth * 90) / 100}px`} /> : <Items manga={manga} dark={dark} />}
                        </AutoCompleteItem>
                    })}
                </AutoCompleteList>
            </AutoComplete >
        </Box>
    );
}

export function Items({ manga, dark }) {
    const [loading, setLoading] = useState(true)

    function TagRenderer({ colorScheme, children }) {
        return <Tag rounded={'md'} gap={1} fontWeight={'bold'} width={'fit-content'} colorScheme={colorScheme}>{children}</Tag>
    }

    return <Box bg={dark ? 'blackAlpha.600' : '#adcdf7'} className="flex w-full p-1 my-2 mx-8 lg:mx-10 md:p-2 rounded-md shadow-xl hover:scale-105 delay-75 transition ease-in-out">
        {loading && <Skeleton height={'46px'} width={'46px'} />}
        <Image boxSize='46px' aspectRatio={'square'} objectFit='contain' src={manga.image} alt='m' display={loading && 'none'}
            onLoad={() => setLoading(false)}
        />
        <Box className="ml-2">
            <Tooltip label={manga.title} hasArrow arrowSize={10} placement="top" >
                <Text noOfLines={2}>{manga.title}</Text>
            </Tooltip>
            <Box className="flex flex-col md:flex-row gap-1 md:gap-2">
                {manga.status && <TagRenderer colorScheme={mangaStatusColors[manga.status]}>{manga.year || 'unknown'} - {manga.status}</TagRenderer>}
                {manga.rating.value && <TagRenderer colorScheme={manga.rating.color}><StarIcon boxSize={3} />{manga.rating.value.toFixed(2)}</TagRenderer>}
                {manga.follows && <TagRenderer ><BellIcon boxSize={3} />{manga.follows}</TagRenderer>}
            </Box>
        </Box>
    </Box>
}
export default SearchBar;