import axios from 'axios';
import apiMiddleware from './apiMiddleware';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_URL_BACK,
});

apiClient.interceptors.request.use(apiMiddleware, (error) => Promise.reject(error));

export default apiClient;