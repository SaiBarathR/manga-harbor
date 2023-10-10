import app from '../config/app.json'
import axios from 'axios';

const MangaService = (function () {

    const API = axios.create({
        baseURL: app.baseUrl['springBoot']
    });
    let service = {};
    const urls = app.urls

    service.get = async function (key, params = '', type = 'json', headers = '') {
        const resp = await API.get(urls[key] + params, { responseType: type === 'json' ? 'json' : 'arraybuffer' })
        if (resp.status === 200) {
            return resp.data || resp;
        }
    }

    service.download = async function (key, params = '') {
        const resp = await API.get(urls[key] + params, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/zip',
                'Accept': 'application/zip'
            },
            onDownloadProgress: (progressEvent) => {
                // let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total); // you can use this to show user percentage of file downloaded
            }
        });
        if (resp.status === 200) {
            const fileName = resp.headers['content-disposition'].split('filename=')[1];
            return { fileName: fileName, file: await resp.data }
        }
    }

    return service;
}());

export default MangaService;
