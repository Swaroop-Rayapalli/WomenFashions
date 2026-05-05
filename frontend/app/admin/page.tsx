'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
    return (
        <div>
            <div style={{ marginBottom: '40px' }}>
                <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--color-gray-500)', marginTop: '5px' }}>Manage your boutique operations</p>
            </div>

                <div className="grid grid-3">
                    <Link href="/admin/orders" className="card p-8 text-center hover-lift">
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Orders</h3>
                        <p style={{ color: 'var(--color-gray-500)' }}>View all orders, update status, and add new orders.</p>
                    </Link>

                    <Link href="/admin/products" className="card p-8 text-center hover-lift">
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👗</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Products</h3>
                        <p style={{ color: 'var(--color-gray-500)' }}>Add new collections and manage existing items.</p>
                    </Link>

                    <Link href="/profile" className="card p-8 text-center hover-lift">
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👤</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Profile</h3>
                        <p style={{ color: 'var(--color-gray-500)' }}>Back to your personal account settings.</p>
                    </Link>
                </div>
            </div>
    );
}
