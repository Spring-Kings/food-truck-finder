import axios from 'axios';

const api = axios.create({
    baseURL: process.env.FOOD_TRUCK_API_URL,

});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    }
);


export default api;