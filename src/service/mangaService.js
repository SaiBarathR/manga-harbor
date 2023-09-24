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

    return service;
}());

export default MangaService;
