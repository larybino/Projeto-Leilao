import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers:{
        'Content-Type':'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario) {
            config.headers.Authorization = `Bearer ${usuario.token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
export default api;