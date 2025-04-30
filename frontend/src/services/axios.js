import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
    baseURL: 'http://localhost:9090/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor
API.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            const url = new URL(config.url, API.defaults.baseURL);
            const publicPaths = ['/auth/forgot-password', '/auth/reset-password'];
            const isPublic = publicPaths.some(path => url.pathname.startsWith(path));

            console.log('Interceptor:', {
                url: config.url,
                resolvedPath: url.pathname,
                isPublic,
                tokenExists: !!token,
            });

            if (token && !isPublic) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (err) {
            console.error('Interceptor URL parse failed:', err.message);
        }

        return config;
    },
    (error) => Promise.reject(error)
);




API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.warn('Unauthorized - redirecting to login');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.warn('Forbidden - insufficient permissions');
                    toast.error('You do not have permission to perform this action');
                    break;
                case 404:
                    console.warn('Resource not found');
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default API;