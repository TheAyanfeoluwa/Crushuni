/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.access_token);
            // Fetch validation immediately
            const userRes = await api.get('/auth/me');
            setUser(userRes.data);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            const msg = error.response?.data?.detail || "Login failed";
            return { success: false, error: msg };
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const { data } = await api.post('/auth/register', {
                email,
                password,
                full_name: fullName
            });
            localStorage.setItem('token', data.access_token);
            // Fetch validation immediately
            const userRes = await api.get('/auth/me');
            setUser(userRes.data);
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            const msg = error.response?.data?.detail || "Registration failed";
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
