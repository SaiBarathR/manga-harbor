import { BellIcon, Search2Icon, SmallCloseIcon, StarIcon } from "@chakra-ui/icons";
import {  Box, IconButton, Image, InputGroup, InputLeftElement, InputRightElement, Skeleton, Tag, Text, Tooltip } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangaByName, setSearchValue } from "../../store/searchSlice";
import { useState } from "react";
import { mangaStatusColors } from "../../config/constants";

function SearchBar() {
    const searchValue = useSelector((state) => state.search.searchValue);
    const options = useSelector((state) => state.search.options);
    const loading = useSelector((state) => state.search.loading);

    const dispatch = useDispatch();

    const handleChangeSearchVal = ({ target: { value } }) => {
        dispatch(setSearchValue(value))
        value && dispatch(fetchMangaByName(value))
    }

    return (
        <Box className="min-w-[300px] w-[80%]">
            <AutoComplete openOnFocus disableFilter={true} >
                <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                        <Search2Icon color='gray.300' />
                    </InputLeftElement>
                    <AutoCompleteInput
                        variant="filled"
                        placeholder="search"
                        size={'md'}
                        rounded={'md'}
                        bg={'#2C2C2C'}
                        value={searchValue}
                        onChange={handleChangeSearchVal}
                    />
                    <InputRightElement>
                        <IconButton size={'xs'} onClick={() => handleChangeSearchVal({ target: { value: "" } })}>
                            <SmallCloseIcon />
                        </IconButton>
                    </InputRightElement>
                </InputGroup>
                <AutoCompleteList maxH={'600px'}>
                    {options.map((manga, index) => {
                        return <AutoCompleteItem
                            key={`option-${manga.id}`}
                            value={manga.title}
                            textTransform="capitalize"
                            align="center"
                        >
                            {loading ? <Skeleton height={'45px'} width={`${(window.innerWidth * 90) / 100}px`} /> : <Items manga={manga} />}
                        </AutoCompleteItem>
                    })
                    }
                </AutoCompleteList>
            </AutoComplete >
        </Box>
    );
}

export function Items({ manga }) {
    const [loading, setLoading] = useState(true)

    return <Box className="flex bg-[#4F4F4F] w-full p-1 md:p-2 rounded-md shadow-lg">
        {loading && <Skeleton height={'46px'} width={'46px'} />}
        <Image
            boxSize='46px'
            aspectRatio={'square'}
            objectFit='contain' src={manga.image} alt='m'
            onLoad={() => setLoading(false)}
            display={loading && 'none'}
        />
        <Box className="ml-2">
            <Tooltip label={manga.title} hasArrow arrowSize={10} placement="top" >
                <Text noOfLines={2}>
                    {manga.title}
                </Text>
            </Tooltip>
            <Box className="flex flex-col md:flex-row gap-1 md:gap-2">
                {manga.status && <Tag rounded={'md'} fontWeight={'bold'} width={'fit-content'} colorScheme={mangaStatusColors[manga.status]}>{manga.year} - {manga.status}</Tag>}
                {manga.rating.value && <Tag rounded={'md'} fontWeight={'bold'} width={'fit-content'} gap={1} colorScheme={manga.rating.color}><StarIcon boxSize={3} />{manga.rating.value.toFixed(2)}</Tag>}
                {manga.follows && <Tag rounded={'md'} fontWeight={'bold'} width={'fit-content'} gap={1}><BellIcon boxSize={3} />{manga.follows}</Tag>}
            </Box>
        </Box>
    </Box>
}
export default SearchBar;