import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert } from 'react-native';

const api = axios.create({
    baseURL: 'http://192.168.1.96:5000/api', // Explicitly route to LAN IP for Expo mobile devices
    timeout: 10000,
});

// Request interceptor to attach the JWT token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Fallback interceptor for network errors and global error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, message, response } = error;

        // Handle 403 Forbidden and 400 Bad Request globally
        if (response) {
            if (response.status === 403) {
                Alert.alert('Access Denied', response.data?.message || 'You do not have permission to perform this action.');
            } else if (response.status === 400) {
                Alert.alert('Bad Request', response.data?.message || 'Invalid input provided. Please check your data.');
            }
        }

        // Check if the error is a network error and we haven't already retried on the active IP
        if (message === 'Network Error' && config.baseURL !== 'http://192.168.1.96:5000/api') {
            console.warn('Network error with localhost address, falling back to 192.168.1.96...');
            config.baseURL = 'http://192.168.1.96:5000/api';
            // Retry the request with the new baseURL
            return axios.request(config);
        }
        return Promise.reject(error);
    }
);

export default api;
