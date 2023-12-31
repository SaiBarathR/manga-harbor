import app from '../config/config.json'
import axios from 'axios';
import { updateItemsToDownload } from '../store/mangaDownloaderSlice';

const MangaService = (function () {

    const env = import.meta.env.MODE
    console.log('env', env)
    const baseURL = env === 'development' ? app.baseUrl['springBoot'] : import.meta.env.VITE_APP_BASE_URL
    const API = axios.create({
        baseURL: baseURL,
    });
    let service = {};
    const urls = app.urls

    service.get = async function (key, params = '', type = 'json', headers = '') {
        const resp = await API.get(urls[key] + params, { responseType: type === 'json' ? 'json' : 'arraybuffer' })
        if (resp.status === 200) {
            return resp.data || resp;
        }
    }

    service.download = async function (key, manga, index, dispatch) {
        const resp = await API.post(urls[key], manga, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                const { rate, loaded } = progressEvent
                dispatch(updateItemsToDownload({ ...manga, index, rate, loaded }))
            }
        });
        if (resp.status === 200) {
            const fileName = resp.headers['content-disposition'].split('filename=')[1].split('"')[1].split('split_here')[1];
            return { fileName: fileName, file: await resp.data }
        }
    }

    return service;
}());

export default MangaService;
