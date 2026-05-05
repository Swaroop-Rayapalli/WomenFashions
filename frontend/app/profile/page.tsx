'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
    const { user, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();
    
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            setUsername(user.username || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
            fetchOrders();
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                cache: 'no-store'
            });
            const data = await res.json();
            if (data.success) {
                // Map API data to UI format
                const formattedOrders = data.data.map((order: any) => ({
                    id: `ORD-${order.id}`,
                    date: new Date(order.createdAt).toLocaleDateString(),
                    total: order.totalAmount,
                    status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
                    items: order.items?.map((item: any) => item.product?.name).join(', ') || 'No items listed'
                }));
                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            // Refresh the page or update user state
            setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
            window.location.reload(); // Simple way to refresh the user data from server
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Failed to upload image. Please check backend logs.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ username, phone })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            setMessage({ type: 'success', text: 'Profile updated successfully! Refresh to see changes.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword) return;
        setIsUpdating(true);

        try {
            // Password validation: Letter and Number required
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
            if (!passwordRegex.test(newPassword)) {
                throw new Error('Password must contain both letters and numbers.');
            }
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
        } finally {
            setIsUpdating(false);
        }
    };

    if (authLoading) return <div className="flex-center" style={{ minHeight: '80vh' }}>Loading...</div>;

    return (
        <div style={{ marginTop: '100px', paddingBottom: 'var(--space-20)' }}>
            <div className="container">
                <div className="section-header">
                    <h1 className="section-title">My Profile</h1>
                    <p className="section-subtitle">Manage your account and view your order history</p>
                </div>

                <div className="grid grid-2" style={{ alignItems: 'start' }}>
                    {/* Left Column: Account Settings */}
                    <div className="card" style={{ padding: 'var(--space-8)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                            <div 
                                onClick={() => user?.avatarUrl && setIsViewerOpen(true)}
                                style={{ 
                                width: '100px', 
                                height: '100px', 
                                borderRadius: '50%', 
                                background: 'var(--color-gold)', 
                                margin: '0 auto var(--space-4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: 'var(--shadow-lg)',
                                overflow: 'hidden',
                                position: 'relative',
                                cursor: user?.avatarUrl ? 'pointer' : 'default'
                            }}>
                                {user?.avatarUrl ? (
                                    <Image 
                                        src={user.avatarUrl} 
                                        alt={user.name} 
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : user?.name ? (
                                    user.name.charAt(0).toUpperCase()
                                ) : (
                                    username.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <label className="btn btn-sm btn-outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
                                {isUpdating ? 'Uploading...' : 'Change Photo'}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleUploadAvatar} 
                                    hidden 
                                    disabled={isUpdating}
                                />
                            </label>
                        </div>

                        {message.text && (
                            <div style={{ 
                                padding: 'var(--space-4)', 
                                backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2', 
                                color: message.type === 'success' ? '#166534' : '#991b1b', 
                                borderRadius: 'var(--radius-md)', 
                                marginBottom: 'var(--space-6)' 
                            }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <h3 style={{ borderBottom: '1px solid var(--color-gray-200)', paddingBottom: 'var(--space-2)' }}>Personal Info</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Full Name</label>
                                <input 
                                    type="text" 
                                    value={user?.name || ''} 
                                    disabled
                                    style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-gray-200)', background: '#f9f9f9' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Username</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Mobile Number</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                            <button type="submit" disabled={isUpdating} className="btn btn-primary">Save Changes</button>
                        </form>
                        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                            <h3 style={{ borderBottom: '1px solid var(--color-gray-200)', paddingBottom: 'var(--space-2)' }}>Security</h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>Current Password</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    style={{ width: '100%', padding: 'var(--space-3)', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600 }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Letters & numbers required"
                                        style={{ width: '100%', padding: 'var(--space-3)', paddingRight: '50px', border: '1px solid var(--color-gray-300)', borderRadius: 'var(--radius-md)' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--color-maroon)',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={isUpdating || !newPassword} className="btn btn-outline">Update Password</button>
                        </form>

                        <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-gray-100)' }}>
                            <button 
                                onClick={() => logout()} 
                                className="btn btn-outline w-full" 
                                style={{ 
                                    color: 'var(--color-error)', 
                                    borderColor: 'var(--color-error)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                <span>🚪</span> Sign Out from My Account
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Orders */}
                    <div className="card" style={{ padding: 'var(--space-8)' }}>
                        <h3 style={{ borderBottom: '2px solid var(--color-maroon)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>Order History</h3>
                        
                        {isLoadingOrders ? (
                            <p>Loading your orders...</p>
                        ) : orders.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {orders.map(order => (
                                    <div key={order.id} style={{ 
                                        padding: 'var(--space-4)', 
                                        border: '1px solid var(--color-gray-200)', 
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'rgba(215, 163, 74, 0.05)'
                                    }}>
                                        <div className="flex-between" style={{ marginBottom: 'var(--space-2)' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--color-maroon)' }}>{order.id}</span>
                                            <span style={{ 
                                                padding: '2px 8px', 
                                                borderRadius: 'var(--radius-full)', 
                                                fontSize: '12px',
                                                background: order.status === 'Delivered' ? '#dcfce7' : '#fef9c3',
                                                color: order.status === 'Delivered' ? '#166534' : '#854d0e'
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
                                            <strong>Items:</strong> {order.items}<br />
                                            <strong>Date:</strong> {order.date}<br />
                                            <strong>Total:</strong> ₹{order.total}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🛍️</div>
                                <p>No orders yet. Start shopping!</p>
                                <button onClick={() => router.push('/collections')} className="btn btn-gold btn-sm" style={{ marginTop: 'var(--space-4)' }}>
                                    Browse Collections
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Picture Lightbox */}
            {isViewerOpen && user?.avatarUrl && (
                <div 
                    onClick={() => setIsViewerOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <button 
                        onClick={() => setIsViewerOpen(false)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '30px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '40px',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                    <div style={{ position: 'relative', width: '90vw', maxWidth: '600px', height: '90vh', maxHeight: '600px' }}>
                        <Image 
                            src={user.avatarUrl} 
                            alt={user.name || 'User'} 
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
