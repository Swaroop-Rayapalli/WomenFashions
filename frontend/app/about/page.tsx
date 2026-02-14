export default function AboutPage() {
    return (
        <div style={{ marginTop: '70px' }}>
            {/* Hero Section */}
            <section className="hero" style={{ minHeight: '60vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">About Women Fashion</h1>
                    <p className="hero-subtitle">14+ Years of Excellence in Designing & Stitching</p>
                </div>
            </section>

            {/* Our Story */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Story</h2>
                    </div>
                    <div className="grid grid-2">
                        <div>
                            <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-4)' }}>
                                Established in 2011
                            </h3>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8' }}>
                                Women Fashion began with a simple vision: to provide premium designing and stitching services
                                that celebrate the beauty of Indian ethnic fashion. Over the years, we've grown from a small
                                boutique to a trusted name in Visakhapatnam, serving hundreds of satisfied customers.
                            </p>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginTop: 'var(--space-4)' }}>
                                Our journey has been marked by dedication to quality, attention to detail, and a commitment
                                to making every customer feel special. We take pride in our craftsmanship and the relationships
                                we've built with our clients over the years.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-4)' }}>
                                Our Mission
                            </h3>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8' }}>
                                To provide exceptional designing and stitching services that combine traditional craftsmanship
                                with modern aesthetics, ensuring every garment is a perfect fit and a work of art.
                            </p>
                            <h3 style={{ color: 'var(--color-maroon)', marginTop: 'var(--space-6)', marginBottom: 'var(--space-4)' }}>
                                Our Values
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>
                                    ✓ Quality craftsmanship in every stitch
                                </li>
                                <li style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>
                                    ✓ Customer satisfaction above all
                                </li>
                                <li style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>
                                    ✓ Timely delivery and professional service
                                </li>
                                <li style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-2)' }}>
                                    ✓ Competitive and transparent pricing
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="section bg-beige">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Expertise</h2>
                        <p className="section-subtitle">Skilled artisans with years of experience</p>
                    </div>
                    <div className="grid grid-3">
                        <div className="card">
                            <div className="card-body text-center">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👗</div>
                                <h3 className="card-title">Expert Tailors</h3>
                                <p className="card-text">
                                    Our team of experienced tailors ensures perfect fitting and impeccable finishing on every garment.
                                </p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✨</div>
                                <h3 className="card-title">Design Specialists</h3>
                                <p className="card-text">
                                    Creative designers who understand the latest trends while respecting traditional aesthetics.
                                </p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎨</div>
                                <h3 className="card-title">Embroidery Artists</h3>
                                <p className="card-text">
                                    Skilled artisans specializing in Maggam work and intricate embroidery designs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Locations */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Visit Our Stores</h2>
                        <p className="section-subtitle">Two convenient locations to serve you better</p>
                    </div>
                    <div className="grid grid-2">
                        <div className="card card-gold">
                            <div className="card-body">
                                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                                    📍 Location 1
                                </h3>
                                <p style={{ color: 'var(--color-gray-700)' }}>
                                    MG Road, near City Center<br />
                                    Anand Nagar, Visakhapatnam
                                </p>
                                <p style={{ color: 'var(--color-gray-700)', marginTop: 'var(--space-4)' }}>
                                    <strong>Hours:</strong> 10:00 AM - 8:00 PM<br />
                                    <strong>Phone:</strong> 9030600126
                                </p>
                            </div>
                        </div>
                        <div className="card card-gold">
                            <div className="card-body">
                                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                                    📍 Location 2
                                </h3>
                                <p style={{ color: 'var(--color-gray-700)' }}>
                                    Uppada Road, Near INS Kalinga<br />
                                    Uppada, Visakhapatnam, AP 531163
                                </p>
                                <p style={{ color: 'var(--color-gray-700)', marginTop: 'var(--space-4)' }}>
                                    <strong>Hours:</strong> 10:00 AM - 8:00 PM<br />
                                    <strong>Phone:</strong> 9030600126
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
