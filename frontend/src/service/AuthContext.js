import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axiosConfig';
import AuthService from './AuthService';

const AuthContext = createContext(null);
const authService = new AuthService();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('usuario');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const navigate = useNavigate();

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            if (response.status === 200 && response.data.token) {
                const userData = response.data;
                localStorage.setItem("usuario", JSON.stringify(userData));
                setUser(userData);
                navigate("/"); 
                return { success: true };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.response?.data?.message || "Login falhou." };
        }
    };

    const logout = () => {
        localStorage.removeItem("usuario");
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

