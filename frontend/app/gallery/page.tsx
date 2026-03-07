'use client';

import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export default function GalleryPage() {
    const { addToCart } = useCart();

    const images: Product[] = [
        { id: 'gal-1', image: '/images/bridal_blouse_1765197647134.png', name: 'Bridal Blouse Work', price: 2500 },
        { id: 'gal-2', image: '/images/embroidery_work_closeup_1765197341457.png', name: 'Intricate Maggam Work', price: 1800 },
        { id: 'gal-3', image: '/images/kids_lehenga_1765197573435.png', name: 'Kids Lehenga', price: 1500 },
        { id: 'gal-4', image: '/images/designer_blouses_collection_1765197297759.png', name: 'Modern Blouse Design', price: 1200 },
        { id: 'gal-5', image: '/images/saree_collection_1765197553661.png', name: 'Saree Draping', price: 3000 },
        { id: 'gal-6', image: '/images/fabric_collection_display_1765197321006.png', name: 'Fabric Collection', price: 800 },
        { id: 'gal-7', image: '/images/WomenFashion-Entrance.png', name: 'Our Boutique', price: 0 },
    ];

    const handleAddToCart = (item: any) => {
        if (item.price === 0) return;
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.src
        });
    };

    return (
        <div style={{ marginTop: '70px' }}>
            <section className="hero" style={{ minHeight: '50vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Our Gallery</h1>
                    <p className="hero-subtitle">A Showcase of Our Finest Work</p>
                </div>
            </section>

            <section className="section bg-white">
                <div className="container">
                    <div className="grid grid-3">
                        {images.map((img) => (
                            <div key={img.id} className="card">
                                <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                                    <Image
                                        src={img.image}
                                        alt={img.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <p style={{ fontWeight: 600, color: 'var(--color-maroon)', marginBottom: 'var(--space-2)' }}>{img.name}</p>
                                    {img.price > 0 && (
                                        <>
                                            <p style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 'var(--space-3)' }}>₹{img.price}</p>
                                            <button
                                                onClick={() => addToCart(img)}
                                                className="btn btn-sm btn-primary w-full"
                                            >
                                                Add to Cart
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
