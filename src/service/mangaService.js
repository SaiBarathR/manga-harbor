import app from '../config/app.json'

const MangaService = (function () {

    const baseURL = app.baseUrl['springBoot']
    var service = {};
    const urls = app.urls

    service.get = async function (key, params = '', type = 'json', headers = '') {
        const resp = await fetch(baseURL + urls[key] + params)
        if (!resp.ok) throw new Error('Network resp was not ok');
        return type === 'image' ? resp.arrayBuffer() : resp.json() || resp;
    }

    service.download = async function (key, params = '') {
        const resp = await fetch(baseURL + urls[key] + params, { method: 'GET', responseType: 'blob' });
        if (!resp.ok) throw new Error('Network resp was not ok');
        if (resp.status === 200) {
            for (let header of resp.headers.entries()) {
                if (header[0] === 'content-disposition') {
                    const fileName = header[1].split('filename=')[1];
                    return { fileName: fileName, file: await resp.blob() }
                }
            }
        }
    }

    return service;
}());

export default MangaService;
