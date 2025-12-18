import axios from 'axios';

import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { NavigateFunction } from '../../shared/types/common.type';

// Create typed axios instance
const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Store navigation function with proper type
let navigate: NavigateFunction | null = null;

export const setNavigate = (navigateFunction: NavigateFunction): void => {
    navigate = navigateFunction;
};

// Request interceptor with types
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token: string | null = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

// Response interceptor with types
api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
        return response;
    },
    (error: AxiosError): Promise<AxiosError> => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (navigate) {
                navigate('/login', { replace: true });
            }
        }
        return Promise.reject(error);
    }
);

export default api;