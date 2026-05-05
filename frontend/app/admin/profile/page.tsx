'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminProfile() {
    const { user, logout, isLoading: authLoading } = useAuth();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataUpload
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
            window.location.reload(); 
        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: err.message || 'Failed to upload image.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/;
        if (!passwordRegex.test(formData.newPassword)) {
            setMessage({ type: 'error', text: 'Password must contain a letter, a number, and a special character.' });
            return;
        }

        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Account Settings</h1>
                <p className="admin-subtitle">Manage your staff profile and security</p>
            </div>

            {message.text && (
                <div className={`admin-alert admin-alert-${message.type}`}>
                    {message.type === 'success' ? '✅' : '⚠️'} {message.text}
                </div>
            )}

            <div className="admin-grid">
                {/* Profile Info */}
                <div className="admin-card">
                    <h3 className="admin-card-title">
                        👤 Profile Information
                    </h3>

                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                        <div 
                            onClick={() => user?.avatarUrl && setIsViewerOpen(true)}
                            style={{ 
                            width: '100px', 
                            height: '100px', 
                            borderRadius: '50%', 
                            background: 'var(--color-maroon)', 
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
                                    alt={user.name || 'Admin'} 
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : user?.name ? (
                                user.name.charAt(0).toUpperCase()
                            ) : (
                                formData.username.charAt(0).toUpperCase() || 'A'
                            )}
                        </div>
                        <label className="admin-btn admin-btn-outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
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

                    <form onSubmit={handleUpdateProfile}>
                        <div className="admin-grid admin-grid-2">
                            <div className="admin-form-group">
                                <label className="admin-label">Username</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    className="admin-input"
                                    value={formData.username} 
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-label">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    className="admin-input"
                                    value={formData.email} 
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-label">Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                className="admin-input"
                                value={formData.phone} 
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" disabled={isUpdating} className="admin-btn admin-btn-primary">
                                {isUpdating ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security */}
                <div className="admin-card">
                    <h3 className="admin-card-title">
                        🔒 Security & Password
                    </h3>
                    <form onSubmit={handleUpdatePassword}>
                        <div className="admin-form-group">
                            <label className="admin-label">Current Password</label>
                            <input 
                                type="password" 
                                name="currentPassword"
                                className="admin-input"
                                value={formData.currentPassword} 
                                onChange={handleChange}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="admin-grid admin-grid-2">
                            <div className="admin-form-group">
                                <label className="admin-label">New Password</label>
                                <input 
                                    type="password" 
                                    name="newPassword"
                                    className="admin-input"
                                    value={formData.newPassword} 
                                    onChange={handleChange}
                                    placeholder="Letter, number, & special symbol required"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-label">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    className="admin-input"
                                    value={formData.confirmPassword} 
                                    onChange={handleChange}
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" disabled={isUpdating || !formData.newPassword} className="admin-btn admin-btn-outline">
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* Role Info */}
                <div style={{ 
                    padding: '1.25rem', 
                    backgroundColor: '#eff6ff', 
                    borderRadius: '0.75rem', 
                    border: '1px solid #dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                    <div>
                        <div className="admin-role-badge">Role: {user?.role}</div>
                        <div style={{ fontSize: '0.875rem', color: '#1e40af', marginTop: '0.5rem' }}>
                            You have administrative access to manage orders, products, and boutique operations.
                        </div>
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
                            alt={user.name || 'Admin'} 
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
