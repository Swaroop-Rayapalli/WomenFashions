'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function CollectionsPage() {
    const { addToCart } = useCart();

    const collections = [
        {
            id: 'coll-1',
            name: 'Bridal Collection',
            description: 'Stunning bridal blouses and lehengas designed to make your special day unforgettable. Intricate Maggam work and heavy embroidery.',
            image: '/images/bridal_blouse_1765197647134.png',
            price: 5000,
            link: '/gallery'
        },
        {
            id: 'coll-2',
            name: 'Kids Wear',
            description: 'Adorable and comfortable ethnic wear for children. Pattu pavadas, frocks, and lehengas customized for little ones.',
            image: '/images/kids_lehenga_1765197573435.png',
            price: 2500,
            link: '/gallery'
        },
        {
            id: 'coll-3',
            name: 'Designer Blouses',
            description: 'Trendy cuts, back designs, and modern patterns. Perfect for parties and festive occasions.',
            image: '/images/designer_blouses_collection_1765197297759.png',
            price: 1500,
            link: '/gallery'
        },
        {
            id: 'coll-4',
            name: 'Sarees & Fabrics',
            description: 'Curated collection of Banaras, Silk, and Fancy sarees. We also have a wide range of fabrics for custom stitching.',
            image: '/images/saree_collection_1765197553661.png',
            price: 3500,
            link: '/contact'
        }
    ];

    return (
        <div style={{ marginTop: '70px' }}>
            {/* Hero */}
            <section className="hero" style={{ minHeight: '60vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Our Collections</h1>
                    <p className="hero-subtitle">Handpicked Styles & Custom Creations</p>
                </div>
            </section>

            {/* Categories */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Explore by Category</h2>
                    </div>

                    <div className="grid grid-2">
                        {collections.map((item) => (
                            <div key={item.id} className="card">
                                <div style={{ position: 'relative', height: '300px' }}>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="card-body">
                                    <h3 className="card-title">{item.name}</h3>
                                    <p className="card-text">{item.description}</p>
                                    <p style={{ fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-maroon)', marginBottom: 'var(--space-4)' }}>₹{item.price}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                                            className="btn btn-primary flex-1"
                                        >
                                            Add to Cart
                                        </button>
                                        <Link href={item.link} className="btn btn-outline flex-1 text-center">Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
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
