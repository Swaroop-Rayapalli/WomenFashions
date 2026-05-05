'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, size?: string) => void;
    removeFromCart: (productId: string, size?: string) => void;
    updateQuantity: (productId: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const API_URL = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
    : (typeof window !== 'undefined' ? '' : 'http://localhost:5000');

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage and Backend
    useEffect(() => {
        const savedCart = localStorage.getItem('women_fashions_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
            }
        }

        const fetchBackendCart = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await fetch(`${API_URL}/api/cart`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        cache: 'no-store'
                    });
                    const data = await res.json();
                    if (data.success) {
                        // Merge or replace? For simplicity, we'll replace if backend has items
                        if (data.data.length > 0) {
                            const formattedCart = data.data.map((item: any) => ({
                                id: item.productId,
                                name: item.product.name,
                                price: item.product.price,
                                image: item.product.images?.[0]?.imageUrl,
                                size: item.size,
                                quantity: item.quantity,
                                cartId: item.id // Store backend ID for removal
                            }));
                            setCart(formattedCart);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch cart from backend', error);
                }
            }
        };
        fetchBackendCart();
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('women_fashions_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = async (product: Product, size?: string) => {
        const token = localStorage.getItem('token');
        
        // Update local state first for responsiveness
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id && item.size === size);
            if (existingItem) {
                return prevCart.map((item) =>
                    (item.id === product.id && item.size === size) ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, size, quantity: 1 }];
        });

        // Sync with backend
        if (token) {
            try {
                await fetch(`${API_URL}/api/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId: product.id, size, quantity: 1 })
                });
            } catch (error) {
                console.error('Failed to sync addToCart with backend', error);
            }
        }
    };

    const removeFromCart = async (productId: string, size?: string) => {
        const token = localStorage.getItem('token');
        const itemToRemove = cart.find(item => item.id === productId && item.size === size);

        setCart((prevCart) => prevCart.filter((item) => !(item.id === productId && item.size === size)));

        if (token && itemToRemove?.cartId) {
            try {
                await fetch(`${API_URL}/api/cart/${itemToRemove.cartId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Failed to sync removeFromCart with backend', error);
            }
        }
    };

    const updateQuantity = async (productId: string, quantity: number, size?: string) => {
        if (quantity < 1) return;
        const token = localStorage.getItem('token');

        setCart((prevCart) =>
            prevCart.map((item) =>
                (item.id === productId && item.size === size) ? { ...item, quantity } : item
            )
        );

        // For quantity update, we can either have a PUT route or just send another POST with the delta.
        // Our current backend POST adds to quantity if it exists, but doesn't SET it.
        // I'll assume we want to SET it, so I should ideally have a PUT /api/cart/:id.
        // For now, I'll just sync the local state.
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
