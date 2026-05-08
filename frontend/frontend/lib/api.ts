import axios from 'axios';

declare global {
    interface Window {
        Clerk?: {
            session?: {
                getToken: () => Promise<string>;
            }
        }
    }
}

const api = axios.create({
    baseURL: 'http://localhost:3001'
});


// Automatically attach the Clerk token to every request

api.interceptors.request.use(async (config) => {
    try {
        const token = await window.Clerk?.session?.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        console.error('Error getting token:', err);
    }

    return config;
});


export default api;

