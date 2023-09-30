const axios = require('axios');
const { writeErrorLog } = require('./logger');

// Inisialisasi instance Axios
const API = axios.create({
    baseURL: 'https://api.verihubs.com/v1'
});

const whatsapp = ({ msisdn, otp }) => API.post('/whatsapp/otp/send', {
    "msisdn": '628' + msisdn.substring(2),
    "content": [
        "Ponjen"
    ],
    "time_limit": "300",
    "lang_code": "id",
    "template_name": "send_otp_template",
    "otp": otp
})
// const whatsapp = (data) => API.post('/whatsapp/otp/send', data)

// Menambahkan Interceptor untuk request
API.interceptors.request.use(config => {
    // Menambahkan header kustom ke setiap request
    config.headers['App-ID'] = 'f65562e7-deec-4d03-8493-4eda24ff783b'; // Ganti dengan header Anda
    config.headers['Api-Key'] = '50A8jTMjkenHtGbroYFetVvcyf+gewST'; // Ganti dengan header Anda
    return config;
}, error => {
    return Promise.reject(error);
});

API.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        writeErrorLog('OTP service Error', JSON.stringify(error.response.data))
    }
    return error.response;
    // return Promise.reject(error);
});

module.exports = {
    whatsapp
}