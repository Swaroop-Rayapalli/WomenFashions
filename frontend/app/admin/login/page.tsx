'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'forgot-password' | 'reset-password'>('login');
    
    const [resetData, setResetData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const { login } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const base = process.env.NEXT_PUBLIC_API_URL 
                ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
                : (typeof window !== 'undefined' 
                    ? (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '') 
                    : 'http://localhost:5000');
            const res = await fetch(`${base}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            setSuccess('OTP has been generated. Check your console (dev) or email.');
            setMode('reset-password');
        } catch (err: any) {
            setError(err.message || 'Request failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (resetData.newPassword !== resetData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const base = process.env.NEXT_PUBLIC_API_URL 
                ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') 
                : (typeof window !== 'undefined' 
                    ? (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '') 
                    : 'http://localhost:5000');
            const res = await fetch(`${base}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email,
                    otp: resetData.otp,
                    newPassword: resetData.newPassword
                })
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            setSuccess('Password reset successfully! You can now login.');
            setMode('login');
        } catch (err: any) {
            setError(err.message || 'Reset failed.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(formData.email, formData.password);
            
            // Check if the user is staff/admin
            if (user && (user.role === 'admin' || user.role === 'staff')) {
                router.push('/admin');
            } else {
                setError('Access denied. This area is for staff only.');
                // Maybe log them out or just leave them on the login page
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#0f172a', // Dark theme for admin
            padding: '20px'
        }}>
            <div className="card" style={{ 
                width: '100%', 
                maxWidth: '400px', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: 'white'
            }}>
                <div style={{ padding: '40px 30px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🛡️</div>
                    <h1 style={{ color: 'var(--color-gold)', marginBottom: '5px', fontSize: '1.8rem' }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        {mode === 'login' ? 'Secure Staff Access Only' : 'Reset Your Password'}
                    </p>
                </div>

                <div style={{ padding: '0 30px 40px' }}>
                    {error && (
                        <div style={{ padding: '12px', backgroundColor: '#451a1a', color: '#f87171', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem', border: '1px solid #7f1d1d' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: '12px', backgroundColor: '#064e3b', color: '#34d399', borderRadius: '6px', marginBottom: '20px', fontSize: '0.85rem', border: '1px solid #065f46' }}>
                            ✅ {success}
                        </div>
                    )}

                    {mode === 'login' ? (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                    Staff Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="name@womenfashions.com"
                                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                                />
                                <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setMode('forgot-password')}
                                        style={{ background: 'none', border: 'none', color: 'var(--color-gold)', fontSize: '0.8rem', cursor: 'pointer' }}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="btn btn-primary" 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    marginTop: '10px',
                                    background: 'linear-gradient(to right, var(--color-maroon), var(--color-maroon-dark))',
                                    border: 'none'
                                }}
                            >
                                {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
                            </button>
                        </form>
                    ) : mode === 'forgot-password' ? (
                        <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                    Your Staff Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="btn btn-primary" 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    background: 'linear-gradient(to right, var(--color-maroon), var(--color-maroon-dark))',
                                    border: 'none'
                                }}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setMode('login')}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                ← Back to Login
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                                    Enter 6-digit OTP
                                </label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={resetData.otp}
                                    onChange={handleResetChange}
                                    required
                                    placeholder="Check console for OTP"
                                    style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>New Pass</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={resetData.newPassword}
                                        onChange={handleResetChange}
                                        required
                                        style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#cbd5e1' }}>Confirm</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={resetData.confirmPassword}
                                        onChange={handleResetChange}
                                        required
                                        style={{ width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="btn btn-primary" 
                                style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    background: 'linear-gradient(to right, var(--color-maroon), var(--color-maroon-dark))',
                                    border: 'none'
                                }}
                            >
                                {isLoading ? 'Updating...' : 'Reset Password'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setMode('login')}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </form>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Link href="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>
                            ← Back to StoreSite
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
