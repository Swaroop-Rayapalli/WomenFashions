'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

function CollectionsContent() {
    const { addToCart } = useCart();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
                const data = await res.json();
                if (data.success) setCategories(data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (categoryId) params.append('category', categoryId);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);
                if (sort) params.append('sort', sort);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [search, categoryId, minPrice, maxPrice, sort]);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/collections?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/collections');
    };

    if (loading) {
        return <div style={{ marginTop: '100px', textAlign: 'center' }}>Loading collections...</div>;
    }

    return (
        <div style={{ marginTop: '70px' }}>
            {/* Hero */}
            <section className="hero" style={{ minHeight: '60vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Our Collections</h1>
                    <p className="hero-subtitle">Handpicked Styles & Custom Creations</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="section bg-white">
                <div className="container">
                    <div className="collections-container">
                        {/* Sidebar Filters */}
                        <aside className="filters-sidebar">
                            <div className="filter-group">
                                <h3 className="filter-title">Search Results</h3>
                                {search && (
                                    <p className="search-term">
                                        Showing results for: <strong>"{search}"</strong>
                                    </p>
                                )}
                                <button onClick={clearFilters} className="btn-link">Clear All Filters</button>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-subtitle">Categories</h4>
                                <div className="filter-options">
                                    <label className="filter-option">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            checked={!categoryId} 
                                            onChange={() => handleFilterChange('category', '')} 
                                        />
                                        <span>All Categories</span>
                                    </label>
                                    {categories.map(cat => (
                                        <label key={cat.id} className="filter-option">
                                            <input 
                                                type="radio" 
                                                name="category" 
                                                checked={categoryId === cat.id.toString()} 
                                                onChange={() => handleFilterChange('category', cat.id.toString())} 
                                            />
                                            <span>{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-subtitle">Price Range</h4>
                                <div className="price-inputs">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={minPrice} 
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="price-input"
                                    />
                                    <span>-</span>
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={maxPrice} 
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="price-input"
                                    />
                                </div>
                            </div>
                        </aside>

                        {/* Product List */}
                        <div className="products-column">
                            <div className="products-header">
                                <p className="product-count">{products.length} products found</p>
                                <div className="sort-container">
                                    <label>Sort By:</label>
                                    <select 
                                        value={sort} 
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="sort-select"
                                    >
                                        <option value="newest">Newest Arrivals</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="oldest">Oldest First</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-spinner">Loading products...</div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-2">
                                    {products.map((item) => (
                                        <div key={item.id} className="card product-card group" style={{ transition: 'all 0.3s ease', position: 'relative' }}>
                                            <Link href={`/collections/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                                <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
                                                    <Image
                                                        src={item.images?.[0]?.imageUrl || '/images/placeholder.png'}
                                                        alt={item.name}
                                                        fill
                                                        style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                        className="group-hover:scale-105"
                                                    />
                                                    {item.isFeatured && <span className="badge featured">Featured</span>}
                                                </div>
                                                <div className="card-body">
                                                    <h3 className="card-title">{item.name}</h3>
                                                    <p className="card-text line-clamp-2">{item.description}</p>
                                                    <p className="product-price">₹{item.price}</p>
                                                </div>
                                            </Link>
                                            <div className="px-6 pb-6 mt-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCart({ 
                                                            id: item.id.toString(), 
                                                            name: item.name, 
                                                            price: item.price, 
                                                            image: item.images?.[0]?.imageUrl || '/images/placeholder.png' 
                                                        }, 'Standard');
                                                        alert('Added to cart!');
                                                    }}
                                                    className="btn btn-primary w-full"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-products">
                                    <h3>No products found</h3>
                                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                                    <button onClick={clearFilters} className="btn btn-primary">Clear All Filters</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Fabrics Information */}
            <section className="section bg-beige">
                <div className="container">
                    <div className="grid grid-2" style={{ alignItems: 'center' }}>
                        <div>
                            <h2 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-4)' }}>
                                Premium Fabrics
                            </h2>
                            <p style={{ color: 'var(--color-gray-700)', marginBottom: 'var(--space-4)' }}>
                                We stock a wide variety of high-quality fabrics to bring your dream outfit to life.
                                From pure silks to comfortable cottons, we have it all.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-gray-700)' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Pure Raw Silk & Banaras</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Organza & Georgette</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Designer Net & Lace</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Handloom Cottons</li>
                            </ul>
                        </div>
                        <div style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <Image
                                src="/images/fabric_collection_display_1765197321006.png"
                                alt="Fabric Collection"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function CollectionsPage() {
    return (
        <Suspense fallback={<div>Loading collections...</div>}>
            <CollectionsContent />
        </Suspense>
    );
}
