import axios from 'axios';

const Api = axios.create({
    baseURL: 'https://mestre-sorvete-back-end.onrender.com',
    headers: { 'Content-Type': 'application/json' },
});

Api.interceptors.request.use(config => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default Api;
