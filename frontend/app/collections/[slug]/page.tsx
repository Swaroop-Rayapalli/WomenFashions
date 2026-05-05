'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImage {
    id: number;
    imageUrl: string;
}

interface ProductSize {
    id: number;
    size: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    description: string;
    fabric?: string;
    workType?: string;
    occasion?: string;
    images: ProductImage[];
    sizes: ProductSize[];
    category?: { id: number; name: string };
}

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProductData() {
            try {
                // Fetch main product
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`, { cache: 'no-store' });
                const data = await res.json();
                
                if (data.success) {
                    const prod = data.data;
                    setProduct(prod);
                    
                    // Fetch related products (same category)
                    if (prod.categoryId) {
                        const relRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${prod.categoryId}`, { cache: 'no-store' });
                        const relData = await relRes.json();
                        if (relData.success) {
                            setRelatedProducts(relData.data.filter((p: Product) => p.id !== prod.id).slice(0, 4));
                        }
                    }
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        }
        fetchProductData();
    }, [slug]);

    const handleAddToCart = (silent = false) => {
        if (!product) return;
        if (product.sizes?.length > 0 && !selectedSize) {
            if (!silent) alert('Please select a size first');
            return false;
        }

        const cartProduct = {
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            image: product.images?.[0]?.imageUrl || '/images/placeholder.png'
        };

        addToCart(cartProduct as any, selectedSize);
        if (!silent) alert('Added to cart successfully!');
        return true;
    };

    const handleBuyNow = () => {
        if (handleAddToCart(true)) {
            window.location.href = '/cart';
        } else {
            alert('Please select a size first');
        }
    };

    if (loading) return (
        <div className="flex-center min-h-screen">
            <div className="spinner"></div>
        </div>
    );

    if (error || !product) return (
        <div className="container text-center py-20">
            <h1 className="text-2xl font-bold text-gray-800">{error || 'Product Not Found'}</h1>
            <Link href="/collections" className="btn btn-gold mt-6">Return to Collections</Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            <div className="container">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/collections">Collections</Link>
                    <span>/</span>
                    <span className="text-maroon font-semibold">{product.name}</span>
                </div>

                <div className="grid grid-2 gap-12 lg:gap-20">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div style={{ position: 'relative', paddingTop: '125%', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    src={product.images?.[activeImage]?.imageUrl || '/images/placeholder.png'}
                                    alt={product.name}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </AnimatePresence>
                        </div>
                        
                        {product.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <div 
                                        key={img.id}
                                        onClick={() => setActiveImage(idx)}
                                        style={{ 
                                            width: '80px', 
                                            height: '100px', 
                                            borderRadius: '8px', 
                                            overflow: 'hidden', 
                                            cursor: 'pointer',
                                            border: activeImage === idx ? '2px solid var(--color-gold)' : '2px solid transparent',
                                            transition: 'border 0.2s'
                                        }}
                                    >
                                        <img src={img.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                                {product.category?.name || 'Designer Collection'}
                            </span>
                            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#111827', lineHeight: 1.1, letterSpacing: '-0.5px' }}>{product.name}</h1>
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <span style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-maroon)' }}>₹{product.price}</span>
                            <div style={{ backgroundColor: '#f3f4f6', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
                                Inclusive of all taxes
                            </div>
                        </div>

                        <div className="mb-10" style={{ borderLeft: '4px solid var(--color-gold)', paddingLeft: '20px' }}>
                            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '16px' }}>{product.description}</p>
                        </div>

                        {/* Specs Grid */}
                        {(product.fabric || product.workType) && (
                            <div className="grid grid-2 gap-4 mb-10">
                                {product.fabric && (
                                    <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                        <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Fabric</span>
                                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginTop: '4px' }}>{product.fabric}</p>
                                    </div>
                                )}
                                {product.workType && (
                                    <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                        <span style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Work Type</span>
                                        <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginTop: '4px' }}>{product.workType}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.sizes?.length > 0 && (
                            <div className="mb-12">
                                <div className="flex justify-between items-center mb-5">
                                    <span style={{ fontWeight: 700, color: '#111827', fontSize: '16px' }}>Select Size</span>
                                    <Link href="/size-guide" style={{ fontSize: '14px', color: 'var(--color-gold)', fontWeight: 600, textDecoration: 'none' }}>Size Guide</Link>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {product.sizes.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setSelectedSize(s.size)}
                                            style={{
                                                minWidth: '64px',
                                                height: '52px',
                                                borderRadius: '14px',
                                                border: selectedSize === s.size ? '2px solid #111827' : '1px solid #e5e7eb',
                                                backgroundColor: selectedSize === s.size ? '#111827' : '#fff',
                                                color: selectedSize === s.size ? '#fff' : '#111827',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                cursor: 'pointer',
                                                boxShadow: selectedSize === s.size ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none'
                                            }}
                                            onMouseOver={(e) => { if (selectedSize !== s.size) e.currentTarget.style.borderColor = '#111827'; }}
                                            onMouseOut={(e) => { if (selectedSize !== s.size) e.currentTarget.style.borderColor = '#e5e7eb'; }}
                                        >
                                            {s.size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-4 mt-4">
                            <button 
                                onClick={() => handleAddToCart()}
                                className="btn btn-gold"
                                style={{ height: '56px', fontSize: '16px', borderRadius: '14px', letterSpacing: '0.5px' }}
                            >
                                🛒 ADD TO CART
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                className="btn btn-primary"
                                style={{ height: '56px', fontSize: '16px', borderRadius: '14px', letterSpacing: '0.5px' }}
                            >
                                ⚡ BUY IT NOW
                            </button>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-8 py-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                <span style={{ fontSize: '18px' }}>🛡️</span> 100% Quality Assurance
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                <span style={{ fontSize: '18px' }}>🚚</span> Fast Shipping
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggestions Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <h2 className="section-title text-left mb-10">You May Also Like</h2>
                        <div className="grid grid-4 gap-8">
                            {relatedProducts.map(rel => (
                                <Link href={`/collections/${rel.slug}`} key={rel.id} className="group">
                                    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-sm">
                                        <img 
                                            src={rel.images?.[0]?.imageUrl || '/images/placeholder.png'} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{rel.name}</h3>
                                    <p className="text-maroon font-bold">₹{rel.price}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
