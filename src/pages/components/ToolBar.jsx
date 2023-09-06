
import { AutoComplete, Avatar, Input, } from 'antd';
import { useState } from 'react';
import HttpService from '../../service/http.service';
export function Toolbar() {
    return <div className=" my-4 p-2 px-4 flex items-center justify-between w-full bg-slate-500 h-[100px] rounded-lg">
        <h1 className="text-white font-medium text-4xl">
            App
        </h1>
        <SearchBar />
    </div>
}

const SearchBar = () => {
    const [options, setOptions] = useState([]);

    const handleSearch = (value) => {
        if (value) {
            return HttpService.get('mangaList', {
                limit: 10,
                title: value,
                includes: ["cover_art"]
            }).then((resp) => {
                const newLsit = resp.data.map((manga, index) => {
                    let relationShip = manga.relationships.filter((dataType) => dataType.type === 'cover_art')[0]
                    let coverArt = relationShip.attributes ? ('https://mangadex.org/covers/' + manga.id + '/' + relationShip.attributes.fileName) : ""
                    const title = manga.attributes.title.en || manga.attributes.altTitles.en || manga.attributes.title.ja
                    return {
                        value: title,
                        label: (
                            // <Tooltip title={title}>
                            <div className='flex gap-1 h-12 items-center '>
                                {coverArt ? <img className='w-12 h-12 aspect-square object-contain' src={coverArt} alt='s' /> : <Avatar>{title[0]}</Avatar>}
                                <div className='flex flex-col'>
                                    <p className='text-ellipsis break-words' > {title}</p>
                                    <div className='flex gap-2'>
                                        <p>{manga.attributes.year || 'unkown'}</p>
                                        <p className='capitalize'>{manga.attributes.status}</p>
                                    </div>
                                </div>
                            </div>
                            // </Tooltip>
                        ),
                    }
                })
                setOptions(newLsit)
            })
        } else {
            setOptions([])
        }
    };

    const onSelect = (value) => {
        console.log('onSelect', value);
    };

    return (
        <AutoComplete
            style={{ width: 350 }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
        >
            <Input.Search size="large" placeholder="search here" enterButton />
        </AutoComplete>
    );
};

