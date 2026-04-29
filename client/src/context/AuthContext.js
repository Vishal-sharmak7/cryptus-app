import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        loadStoreData();
    }, []);

    const loadStoreData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const role = await AsyncStorage.getItem('userRole');
            if (token && role) {
                setUserToken(token);
                setUserRole(role);
            }
        } catch (e) {
            console.log('Failed to fetch from storage');
        }
        setIsLoading(false);
    };

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token, role } = response.data;

            setUserToken(token);
            setUserRole(role);
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', role);
        } catch (error) {
            if (error.response) {
                console.error('Login error status:', error.response.status);
            } else {
                console.error('Check if server is running at localhost:5000');
            }
            alert(error.response?.data?.message || 'Login Failed');
        }
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserRole(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userRole');
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};
