import app from '../config/app.json'

const MangaService = (function () {

    const baseURL = app.baseUrl['springBoot']
    var service = {};
    const urls = app.urls

    service.get = async function (key, params = '', headers = '') {
        const resp = await fetch(baseURL + urls[key] + params)
        return resp.json() || resp
    }

    return service;
}());

export default MangaService;
