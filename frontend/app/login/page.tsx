'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>('login');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        username: '',
        password: '',
        identifier: '', // for login (phone or username)
        otp: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            if (mode === 'login') {
                await login(formData.identifier, formData.password);
            } else if (mode === 'register') {
                // Password validation: Letter and Number required
                const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
                if (!passwordRegex.test(formData.password)) {
                    throw new Error('Password must contain both letters and numbers.');
                }
                await register({
                    name: formData.name,
                    phone: formData.phone,
                    username: formData.username,
                    password: formData.password
                });
            } else if (mode === 'forgot-password') {
                const base = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : (typeof window !== 'undefined' ? '' : 'http://localhost:5000');
                const res = await fetch(`${base}/api/auth/customer/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone: formData.phone })
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.message);
                setSuccess(data.message);
                setMode('reset-password');
            } else if (mode === 'reset-password') {
                // Password validation: Letter and Number required
                const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
                if (!passwordRegex.test(formData.newPassword)) {
                    throw new Error('New password must contain both letters and numbers.');
                }
                const base = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : (typeof window !== 'undefined' ? '' : 'http://localhost:5000');
                const res = await fetch(`${base}/api/auth/customer/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        phone: formData.phone, 
                        otp: formData.otp, 
                        newPassword: formData.newPassword 
                    })
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.message);
                setSuccess(data.message);
                setMode('login');
            }
        } catch (err: any) {
            setError(err.message || err || 'Authentication failed. Please try again.');
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
            background: 'linear-gradient(135deg, var(--color-beige) 0%, var(--color-beige-dark) 100%)',
            padding: 'var(--space-8)'
        }}>
            <div className="card" style={{ 
                width: '100%', 
                maxWidth: '450px', 
                boxShadow: 'var(--shadow-2xl)',
                border: '1px solid var(--color-gold-light)',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, var(--color-maroon), var(--color-maroon-dark))', 
                    padding: 'var(--space-8)', 
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <h1 style={{ color: 'var(--color-gold)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-3xl)' }}>
                        ✨ Women Fashions
                    </h1>
                    <p style={{ opacity: 0.9 }}>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</p>
                </div>

                <div className="card-body" style={{ padding: 'var(--space-8)' }}>
                    {error && (
                        <div style={{ padding: 'var(--space-4)', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', border: '1px solid #fecaca' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ padding: 'var(--space-4)', backgroundColor: '#dcfce7', color: '#166534', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', border: '1px solid #bbf7d0' }}>
                            ✅ {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {mode === 'forgot-password' ? (
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your registered phone number"
                                    style={{ width: '100%', padding: 'var(--space-3)', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}
                                />
                            </div>
                        ) : mode === 'reset-password' ? (
                            <>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                                        OTP sent to {formData.phone}
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter 6-digit OTP"
                                        style={{ width: '100%', padding: 'var(--space-3)', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
                                        New Password
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Must include letters & numbers"
                                            style={{ width: '100%', padding: 'var(--space-3)', paddingRight: '50px', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-maroon)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {mode === 'register' && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" style={{ width: '100%', padding: 'var(--space-3)', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }} />
                                    </div>
                                )}

                                {mode === 'login' ? (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>Phone or Username</label>
                                        <input type="text" name="identifier" value={formData.identifier} onChange={handleChange} required placeholder="Enter phone or username" style={{ width: '100%', padding: 'var(--space-3)', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }} />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>Phone Number</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10 digit number" style={{ width: '100%', padding: 'var(--space-3)', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>Username (Optional)</label>
                                            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" style={{ width: '100%', padding: 'var(--space-3)', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }} />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 600, color: 'var(--color-gray-700)' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Letters & numbers required" style={{ width: '100%', padding: 'var(--space-3)', paddingRight: '50px', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }} />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-maroon)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {mode === 'login' && (
                                        <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                            <button type="button" onClick={() => setMode('forgot-password')} style={{ background: 'none', border: 'none', color: 'var(--color-maroon)', fontSize: '0.8rem', cursor: 'pointer' }}>
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <button type="submit" disabled={isLoading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                            {isLoading ? 'Processing...' : 
                             mode === 'login' ? 'Login' : 
                             mode === 'register' ? 'Register' : 
                             mode === 'forgot-password' ? 'Send OTP' : 'Reset Password'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {(mode === 'login' || mode === 'register') ? (
                            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ color: 'var(--color-maroon)', background: 'none', border: 'none', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}>
                                {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
                            </button>
                        ) : (
                            <button type="button" onClick={() => setMode('login')} style={{ color: 'var(--color-maroon)', background: 'none', border: 'none', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}>
                                Back to Login
                            </button>
                        )}
                        
                        <Link href="/" style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
