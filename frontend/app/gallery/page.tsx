import Image from 'next/image';

export default function GalleryPage() {
    const images = [
        { src: '/images/bridal_blouse_1765197647134.png', alt: 'Bridal Blouse Work' },
        { src: '/images/embroidery_work_closeup_1765197341457.png', alt: 'Intricate Maggam Work' },
        { src: '/images/kids_lehenga_1765197573435.png', alt: 'Kids Lehenga' },
        { src: '/images/designer_blouses_collection_1765197297759.png', alt: 'Modern Blouse Design' },
        { src: '/images/saree_collection_1765197553661.png', alt: 'Saree Draping' },
        { src: '/images/fabric_collection_display_1765197321006.png', alt: 'Fabric Collection' },
        { src: '/images/WomenFashion-Entrance.png', alt: 'Our Boutique' },
    ];

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
                        {images.map((img, index) => (
                            <div key={index} className="card" style={{ cursor: 'pointer' }}>
                                <div style={{ position: 'relative', height: '300px' }}>
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="card-body text-center">
                                    <p style={{ fontWeight: 500, color: 'var(--color-maroon)' }}>{img.alt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
