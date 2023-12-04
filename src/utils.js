import { UNITS } from "./config/constants";

export const downloadMangaUsingFile = async (file, fileName) => {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = decodeURIComponent(fileName).replace(/\+/g, ' ') || 'manga.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}

export function formatBytes(bytes) {
    let l = 0, n = parseInt(bytes, 10) || 0;
    while (n >= 1000 && ++l) n = n / 1000;
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + UNITS[l]);
}

function getMangaName(attributes) {
    if (attributes) {
        const title = attributes.title;
        if (title && title.en) {
            return title.en;
        } else {
            const altTitles = attributes.altTitles;
            if (altTitles) {
                for (const altTitle of altTitles) {
                    if (altTitle.en) {
                        return altTitle.en;
                    }
                }
            }
        }
    }
}

function getColorName(rating) {
    switch (true) {
        case (rating < 1):
            return "red";
        case (rating < 2):
            return "orange";
        case (rating < 3):
            return "yellow";
        case (rating < 4):
            return "pink";
        case (rating < 5):
            return "gray";
        case (rating < 6):
            return "gray";
        case (rating < 7):
            return "linkedin";
        case (rating < 8):
            return "purple";
        case (rating < 9):
            return "green";
        case (rating < 10):
            return "yellow";
        default:
            return "Invalid Rating";
    }
}
export function constructMangaDetails(manga, stats) {
    return {
        title: getMangaName(manga.attributes),
        image: manga.image,
        year: manga.attributes.year,
        status: manga.attributes.status,
        id: manga.id,
        rating: stats ? { value: stats[manga.id].rating.average, color: getColorName(stats[manga.id].rating.average) } : {},
        follows: stats ? stats[manga.id].follows : null,
    }
}