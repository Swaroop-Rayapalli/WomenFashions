'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const menuItems = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/orders', label: 'Orders', icon: '📦' },
        { href: '/admin/products', label: 'Products', icon: '👗' },
        { href: '/admin/customers', label: 'Customers', icon: '👥' },
        { href: '/admin/feedback', label: 'Feedback', icon: '⭐' },
        { href: '/admin/profile', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="admin-sidebar" style={{
            width: '260px',
            height: '100vh',
            backgroundColor: '#1e293b',
            color: 'white',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000
        }}>
            <div style={{ padding: '30px 20px', borderBottom: '1px solid #334155' }}>
                <h2 style={{ color: 'var(--color-gold)', fontSize: '1.5rem', margin: 0 }}>✨ Admin Panel</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '5px' }}>Women Fashions Boutique</p>
            </div>

            <nav style={{ flex: 1, padding: '20px 0' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map((item) => (
                        <li key={item.href}>
                            <Link 
                                href={item.href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 20px',
                                    color: pathname === item.href ? 'white' : '#cbd5e1',
                                    backgroundColor: pathname === item.href ? '#334155' : 'transparent',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    borderLeft: pathname === item.href ? '4px solid var(--color-gold)' : '4px solid transparent'
                                }}
                                className="admin-nav-link"
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '20px', borderTop: '1px solid #334155', backgroundColor: '#0f172a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ 
                        width: '35px', 
                        height: '35px', 
                        borderRadius: '50%', 
                        background: 'var(--color-gold)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.username || 'Admin'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{user?.role}</div>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
