import { BellIcon, Search2Icon, SmallCloseIcon, StarIcon } from "@chakra-ui/icons";
import { Box, IconButton, Image, InputGroup, InputLeftElement, InputRightElement, Skeleton, Stack, Tag, Text, Tooltip, useColorMode } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangaByName, setLoading, setSearchValue } from "../../store/searchSlice";
import { useEffect, useMemo, useState } from "react";
import { mangaStatusColors } from "../../config/constants";
import MangaService from "../../service/mangaService";
import { setManga } from "../../store/mangaSlice";

function SearchBar() {
    const searchValue = useSelector((state) => state.search.searchValue);
    const options = useSelector((state) => state.search.options);
    const loading = useSelector((state) => state.search.loading);
    const dispatch = useDispatch();
    const { colorMode } = useColorMode()
    const dark = useMemo(() => colorMode === 'dark', [colorMode])
    const handleChangeSearchVal = ({ target: { value } }) => dispatch(setSearchValue(value));

    useEffect(() => {
        !loading && dispatch(setLoading(true))
        const getData = setTimeout(() => { searchValue && dispatch(fetchMangaByName(searchValue)) }, 300)
        return () => clearTimeout(getData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue])

    const onClickSearchItem = (manga) => {
        return () => {
            dispatch(setManga(manga))
        }
    }

    return (
        <Box className="min-w-[300px] max-w-[1200px] w-[80%]">
            <AutoComplete openOnFocus disableFilter={true} isLoading={loading}>
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
                        loadingIcon={<></>}
                    />
                    <InputRightElement>
                        <IconButton _hover={{ bg: dark ? '#676973' : '#adadc7' }} bg={dark ? 'gray' : 'whiteAlpha.300'} size={'xs'} onClick={() => handleChangeSearchVal({ target: { value: "" } })}>
                            <SmallCloseIcon />
                        </IconButton>
                    </InputRightElement>
                </InputGroup>
                <AutoCompleteList maxH={'600px'} bg={dark ? '#2C2C2C !important' : '#D8E8FE !important'}
                    loadingState={<Stack className="w-[100%] flex flex-col items-center">{[1, 2, 3, 4].map((item) => <Skeleton key={item} rounded={'6px'} className="my-2  rounded-md w-[92%] md:w-[97%] h-[45px]" />)}</Stack>}
                >
                    {options.map((manga, index) => {
                        return <AutoCompleteItem onClick={onClickSearchItem(manga)} key={`option-${manga.id}`} value={manga.title} align="center" className="searchbarAutocompleListItem capitalize">
                            {loading ? <></> : <Items manga={manga} dark={dark} />}
                        </AutoCompleteItem>
                    })}
                </AutoCompleteList>
            </AutoComplete >
        </Box>
    );
}

export function Items({ manga, dark }) {
    const [loading, setLoading] = useState(true)
    const [imageData, setImageData] = useState(false);
    const TagRenderer = ({ colorScheme, children }) => <Tag rounded={'md'} gap={1} fontWeight={'bold'} width={'fit-content'} colorScheme={colorScheme}>{children}</Tag>

    const getCoverImage = async () => {
        try { setImageData(URL.createObjectURL(new Blob([await MangaService.get('cover', manga.image, 'image')], { type: 'image/jpeg' }))); }
        catch (error) { console.log(error) }
    }

    useEffect(() => {
        const getData = setTimeout(() => { getCoverImage() }, 200)
        return () => clearTimeout(getData)
    }, [manga.image])


    return <Box bg={dark ? 'blackAlpha.600' : '#adcdf7'} className="flex w-full p-1 items-center  my-2 mx-8 lg:mx-10 md:p-2 lg:p-4 rounded-md shadow-xl hover:scale-105 delay-75 transition ease-in-out">
        {!imageData && loading ? <Box width={'52px'}> <Skeleton height={'52px'} width={'52px'} /> </Box> :
            <Image boxSize={'8%'} minW={'52px'} minH={'52px'} className="aspect-square" aspectRatio={'square'} objectFit='contain' src={imageData} alt='m' display={!imageData && loading && 'none'}
                onLoad={() => setLoading(false)}
            />}
        <Box className="ml-2">
            <Tooltip label={manga.title} hasArrow arrowSize={10} placement="top" >
                <Text noOfLines={2}>{manga.title}</Text>
            </Tooltip>
            <Box className="flex flex-col md:flex-row gap-2 md:gap-2">
                {manga.status && <TagRenderer colorScheme={mangaStatusColors[manga.status]}>{manga.year || 'unknown'} - {manga.status}</TagRenderer>}
                {manga.rating.value && <TagRenderer colorScheme={manga.rating.color}><StarIcon boxSize={3} />{manga.rating.value.toFixed(2)}</TagRenderer>}
                {manga.follows && <TagRenderer ><BellIcon boxSize={3} />{manga.follows}</TagRenderer>}
            </Box>
        </Box>
    </Box>
}
export default SearchBar;