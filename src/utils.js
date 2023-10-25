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