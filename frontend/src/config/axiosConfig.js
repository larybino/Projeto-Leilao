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
        const publicRoutes = ['/auth', '/person/register', '/recover-password', '/reset-password'];
        const isPublic = publicRoutes.some(route => config.url.includes(route));
        
        if (usuario && !isPublic) {
            config.headers.Authorization = `Bearer ${usuario.token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
export default api;