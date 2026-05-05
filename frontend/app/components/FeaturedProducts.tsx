'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string;
    images: { imageUrl: string }[];
    category?: { name: string };
    isFeatured: boolean;
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?featured=true`, { cache: 'no-store' });
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data.slice(0, 4)); // Show top 4
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    if (loading) return null;
    if (products.length === 0) return null;

    return (
        <section className="section bg-white" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Featured Collections</h2>
                    <p className="section-subtitle">Handpicked premium designs for your special moments</p>
                </div>

                <div className="grid grid-4" style={{ marginTop: 'var(--space-8)' }}>
                    {products.map(product => (
                        <Link 
                            key={product.id} 
                            href={`/collections/${product.slug}`}
                            className="card product-card" 
                            style={{ 
                                transition: 'all 0.3s ease', 
                                border: '1px solid #f3f4f6',
                                textDecoration: 'none',
                                display: 'block',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{ position: 'relative', paddingTop: '125%', overflow: 'hidden' }}>
                                <img 
                                    src={product.images?.[0]?.imageUrl || '/images/placeholder.png'} 
                                    alt={product.name}
                                    style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease'
                                    }} 
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                                <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--color-gold)', color: 'var(--color-maroon)', padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Featured
                                </div>
                            </div>
                            <div className="card-body" style={{ padding: '20px' }}>
                                <p style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>{product.category?.name}</p>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{product.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-maroon)' }}>₹{product.price}</span>
                                    <span style={{ color: 'var(--color-gold)', fontWeight: 600, fontSize: '14px' }}>
                                        Details →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center" style={{ marginTop: 'var(--space-12)' }}>
                    <Link href="/collections" className="btn btn-outline">
                        View Entire Collection
                    </Link>
                </div>
            </div>
        </section>
    );
}
