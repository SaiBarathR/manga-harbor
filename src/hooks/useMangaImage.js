import { useEffect, useState } from "react";
import MangaService from "../service/mangaService";

export default function useMangaImage(source) {

    const [imageData, setImageData] = useState(false);
    const [loading, setLoading] = useState(false);

    const getCoverImage = async () => {
        setLoading(true);
        try {
            setImageData(URL.createObjectURL(new Blob([await MangaService.get('cover', source, 'image')], { type: 'image/jpeg' })));
            setLoading(false);
        }
        catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    useEffect(() => {
        const getData = setTimeout(() => { source && getCoverImage() }, 200)
        return () => clearTimeout(getData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source])

    return { imageData, loading };

}