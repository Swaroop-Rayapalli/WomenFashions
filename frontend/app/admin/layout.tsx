'use client';

import AdminSidebar from './components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import './admin.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
        // Only redirect if not loading and definitely not admin/staff
        // Ignore the admin login page itself
        if (!isLoading && !isAdminOrStaff && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [user, isLoading, router, pathname]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
                <div className="loader"></div>
            </div>
        );
    }

    const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
    const isLoginPage = pathname === '/admin/login';

    if (!isAdminOrStaff && !isLoginPage) return null;

    // For login page, just render children without sidebar
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <AdminSidebar />
            <main style={{ 
                flex: 1, 
                marginLeft: '260px', 
                padding: '40px',
                width: 'calc(100% - 260px)'
            }}>
                {children}
            </main>
        </div>
    );
}
