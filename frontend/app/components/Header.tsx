'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsMenuOpen(false); // Close mobile menu if open
        }
    };

    // Hide header on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/collections', label: 'Collections' },
        { href: '/testimonials', label: 'Testimonials' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link href="/" className="navbar-logo">
                    <span>✨</span>Women<span>Fashions</span>
                </Link>

                {/* Search Bar - Visible on all devices */}
                <div className="navbar-search">
                    <form onSubmit={handleSearch} className="search-form">
                        <input 
                            type="text" 
                            placeholder="Search styles, fabrics, occasions..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">🔍</button>
                    </form>
                </div>

                <div className="navbar-right">
                    {/* Desktop Menu */}
                    <ul className="navbar-menu hidden lg-flex">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={`navbar-link ${pathname === link.href ? 'active' : ''}`}>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="navbar-actions">
                        <Link href="/cart" className="cart-btn-premium">
                            <span style={{ fontSize: '20px' }}>👜</span>
                            <span className="hidden md-block">Cart</span>
                            {totalItems > 0 && (
                                <span className="cart-badge-new">{totalItems}</span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className="profile-trigger">
                                    <div className="avatar-circle">
                                        {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden xl-block name-label">
                                        {user.name || user.username || 'Profile'}
                                    </span>
                                </Link>
                            </div>
                        ) : (
                            <Link href="/login" className="btn btn-sm btn-primary" style={{ borderRadius: '10px' }}>
                                Login
                            </Link>
                        )}

                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme} 
                            className="btn btn-sm btn-outline" 
                            style={{ padding: '8px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px' }}
                            title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="navbar-toggle"
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button onClick={toggleTheme} className="btn btn-outline w-full mt-4">
                                {theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode'}
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
