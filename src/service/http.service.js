import axios from 'axios';
import app from '../config/app.json'

const HttpService = (function () {
    const API = axios.create({
        baseURL: app.baseUrl['mangaDex']
    });
    var service = {};
    const urls = app.urls

    service.post = function (key, data) {
        return API.post(urls[key], data).then(res => {
            return res;
        }).catch(e => {
            console.log('ERROR:', e);
            checkNetorkError(e);
            return e.message
        });
    }

    service.get = function (key, options) {
        return API.get(urls[key], { params: options })
            .then(res => {
                return res.data;
            }).catch(e => {
                return e.response.data || e.message
            });
    }


    service.postWithHeaders = function (key, data, headers) {
        return API.post(urls[key], data, { headers: headers }).then(res => {
            return res.data;
        }).catch(e => {
            console.log('ERROR:', e);
            checkNetorkError(e)
            return e.message
        });
    }

    service.getWithHeaders = function (key, options, headers) {
        return API.get(urls[key], { params: options, headers }).then(res => {
            return res.data;
        }).catch(e => {
            console.log('ERROR:', e);
            checkNetorkError(e)
            return e.message
        });
    }

    function checkNetorkError(error) {
        if (error.toJSON().message === 'Network Error') {
            console.log(error)
            // showErrorNotification('Network Error');
        }
    }
    return service;
}());


export default HttpService;
