'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

export default function AdminCustomers() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCustomers(data.data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            setStatus({ type: 'error', text: 'Failed to load customers' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
        if (!authLoading && (!user || !isAdminOrStaff)) {
            router.push('/');
            return;
        }

        if (user) {
            fetchCustomers();
        }
    }, [user, authLoading, router, fetchCustomers]);

    const filteredCustomers = customers.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone?.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || isLoading) return <div className="text-center p-20">Loading...</div>;

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
                            Customers
                        </h1>
                        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '15px' }}>
                            Manage your boutique's registered clientele
                        </p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Search name, phone or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                padding: '12px 16px', 
                                paddingLeft: '40px',
                                borderRadius: '10px', 
                                border: '1px solid #e5e7eb', 
                                width: '300px',
                                outline: 'none',
                                fontSize: '14px'
                            }} 
                        />
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
                    </div>
                </div>

                {status.text && (
                    <div style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        marginBottom: '32px', 
                        backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fff1f2',
                        color: status.type === 'success' ? '#065f46' : '#9f1239',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: `1px solid ${status.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                    }}>
                        {status.text}
                    </div>
                )}

                <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Customer</th>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Contact Info</th>
                                <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Joined Date</th>
                                <th style={{ textAlign: 'center', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Orders</th>
                                <th style={{ textAlign: 'right', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? filteredCustomers.map(customer => (
                                <tr key={customer.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div className="flex items-center gap-4">
                                            <div style={{ 
                                                width: '40px', 
                                                height: '40px', 
                                                borderRadius: '50%', 
                                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '14px'
                                            }}>
                                                {customer.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#111827' }}>{customer.name}</div>
                                                <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: #{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{customer.phone}</div>
                                        <div style={{ fontSize: '13px', color: '#6b7280' }}>{customer.email || 'No email'}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px', color: '#4b5563', fontSize: '14px' }}>
                                        {new Date(customer.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                        <span style={{ 
                                            backgroundColor: customer.orderCount > 0 ? '#eff6ff' : '#f3f4f6', 
                                            color: customer.orderCount > 0 ? '#1d4ed8' : '#6b7280', 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '13px', 
                                            fontWeight: 600 
                                        }}>
                                            {customer.orderCount}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <span style={{ 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: customer.isActive ? '#059669' : '#9ca3af'
                                        }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: customer.isActive ? '#10b981' : '#d1d5db' }}></span>
                                            {customer.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No customers found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
