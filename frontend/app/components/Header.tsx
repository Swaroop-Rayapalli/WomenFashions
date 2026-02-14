'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/collections', label: 'Collections' },
        { href: '/services', label: 'Services' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/testimonials', label: 'Testimonials' },
        { href: '/offers', label: 'Offers' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link href="/" className="navbar-logo">
                    <span>✨</span> Women <span>Fashions</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="navbar-menu">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="navbar-link">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Actions */}
                <div className="navbar-actions">
                    <Link href="/cart" className="btn btn-sm btn-outline" style={{ position: 'relative' }}>
                        🛒 Cart
                        <span className="cart-count" style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'var(--color-maroon)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold'
                        }}>
                            0
                        </span>
                    </Link>

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
                    </ul>
                </div>
            )}
        </nav>
    );
}
