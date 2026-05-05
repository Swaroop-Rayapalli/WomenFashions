'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    phone: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (identifier: string, password: string) => Promise<User>;
    register: (userData: any) => Promise<User>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
    : (typeof window !== 'undefined' ? '' : 'http://localhost:5000');

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

        try {
                const response = await fetch(`${API_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    cache: 'no-store'
                });

                const result = await response.json();
                if (result.success) {
                    setUser(result.data);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (identifier: string, password: string) => {
        // Try regular login first (for admin/staff)
        let response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: identifier, password })
        });

        let result = await response.json();

        // If not found or invalid, try customer login
        if (!result.success) {
            response = await fetch(`${API_URL}/api/auth/customer/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });
            result = await response.json();
        }

        if (result.success) {
            localStorage.setItem('token', result.token);
            setUser(result.data);
            
            // Redirect based on role
            if (result.data.role === 'admin' || result.data.role === 'staff') {
                router.push('/admin');
            } else {
                router.push('/profile');
            }
            return result.data;
        } else {
            throw result.message || 'Login failed';
        }
    };

    const register = async (userData: any) => {
        const response = await fetch(`${API_URL}/api/auth/customer/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('token', result.token);
            setUser(result.data);
            router.push('/profile');
            return result.data;
        } else {
            throw result.message || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
