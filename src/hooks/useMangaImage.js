import { useEffect, useState } from "react";
import MangaService from "../service/mangaService";

export default function useMangaImage(source) {

    const [imageData, setImageData] = useState(false);

    const getCoverImage = async () => {
        try { setImageData(URL.createObjectURL(new Blob([await MangaService.get('cover', source, 'image')], { type: 'image/jpeg' }))); }
        catch (error) { console.log(error) }
    }

    useEffect(() => {
        const getData = setTimeout(() => { getCoverImage() }, 200)
        return () => clearTimeout(getData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source])

    return imageData;

}