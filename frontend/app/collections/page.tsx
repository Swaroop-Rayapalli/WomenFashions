import Link from 'next/link';
import Image from 'next/image';

export default function CollectionsPage() {
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
                        {/* Bridal */}
                        <div className="card">
                            <div style={{ position: 'relative', height: '300px' }}>
                                <Image
                                    src="/images/bridal_blouse_1765197647134.png"
                                    alt="Bridal Collection"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">Bridal Collection</h3>
                                <p className="card-text">
                                    Stunning bridal blouses and lehengas designed to make your special day unforgettable.
                                    Intricate Maggam work and heavy embroidery.
                                </p>
                                <Link href="/gallery" className="btn btn-primary">View Gallery</Link>
                            </div>
                        </div>

                        {/* Kids */}
                        <div className="card" id="kids">
                            <div style={{ position: 'relative', height: '300px' }}>
                                <Image
                                    src="/images/kids_lehenga_1765197573435.png"
                                    alt="Kids Collection"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">Kids Wear</h3>
                                <p className="card-text">
                                    Adorable and comfortable ethnic wear for children. Pattu pavadas, frocks, and
                                    lehengas customized for little ones.
                                </p>
                                <Link href="/gallery" className="btn btn-primary">View Gallery</Link>
                            </div>
                        </div>

                        {/* Designer Blouses */}
                        <div className="card">
                            <div style={{ position: 'relative', height: '300px' }}>
                                <Image
                                    src="/images/designer_blouses_collection_1765197297759.png"
                                    alt="Designer Blouses"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">Designer Blouses</h3>
                                <p className="card-text">
                                    Trendy cuts, back designs, and modern patterns. Perfect for parties and
                                    festive occasions.
                                </p>
                                <Link href="/gallery" className="btn btn-primary">View Gallery</Link>
                            </div>
                        </div>

                        {/* Sarees */}
                        <div className="card">
                            <div style={{ position: 'relative', height: '300px' }}>
                                <Image
                                    src="/images/saree_collection_1765197553661.png"
                                    alt="Saree Collection"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">Sarees & Fabrics</h3>
                                <p className="card-text">
                                    Curated collection of Banaras, Silk, and Fancy sarees. We also have a wide
                                    range of fabrics for custom stitching.
                                </p>
                                <Link href="/contact" className="btn btn-primary">Enquire Now</Link>
                            </div>
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
