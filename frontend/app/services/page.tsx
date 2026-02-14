import Link from 'next/link';

export default function ServicesPage() {
    return (
        <div style={{ marginTop: '70px' }}>
            {/* Hero */}
            <section className="hero" style={{ minHeight: '60vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Our Services</h1>
                    <p className="hero-subtitle">Premium Designing & Stitching for Every Occasion</p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section bg-white" id="maggam">
                <div className="container">
                    <div className="grid grid-2">
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>✨</div>
                            <h2 style={{ color: 'var(--color-maroon)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
                                Maggam Work
                            </h2>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: 'var(--space-4)' }}>
                                Exquisite hand embroidery with intricate designs, beads, sequins, and stones. Our skilled artisans
                                create stunning Maggam work that adds elegance and tradition to your sarees and blouses.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-gray-600)' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Traditional and modern designs</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Custom patterns available</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Premium quality materials</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Expert craftsmanship</li>
                            </ul>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Pricing</h3>
                                <p className="card-text">Starting from ₹500 per design</p>
                                <p className="card-text" style={{ fontSize: 'var(--text-sm)' }}>
                                    *Price varies based on complexity and materials used
                                </p>
                                <Link href="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                                    Get Quote
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-beige" id="blouses">
                <div className="container">
                    <div className="grid grid-2">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Pricing</h3>
                                <p className="card-text">Starting from ₹300</p>
                                <p className="card-text" style={{ fontSize: 'var(--text-sm)' }}>
                                    *Price varies based on design and fabric
                                </p>
                                <Link href="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                                    Get Quote
                                </Link>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>👗</div>
                            <h2 style={{ color: 'var(--color-maroon)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
                                Designer Blouses
                            </h2>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: 'var(--space-4)' }}>
                                Custom-designed blouses with perfect fitting, modern patterns, and traditional craftsmanship.
                                We create unique designs that complement your sarees beautifully.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-gray-600)' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Perfect fitting guaranteed</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Latest designs and patterns</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ All types of necklines</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Quick turnaround time</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-white" id="saree">
                <div className="container">
                    <div className="grid grid-2">
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🧵</div>
                            <h2 style={{ color: 'var(--color-maroon)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
                                Saree Fall & Pico
                            </h2>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: 'var(--space-4)' }}>
                                Professional saree finishing services with neat fall and pico work. We ensure your sarees drape
                                perfectly and look elegant.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-gray-600)' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Neat and durable stitching</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Color-matched fall and pico</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Same-day service available</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Affordable pricing</li>
                            </ul>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Pricing</h3>
                                <p className="card-text">Fall & Pico: ₹150</p>
                                <p className="card-text">Fall Only: ₹100</p>
                                <p className="card-text">Pico Only: ₹80</p>
                                <Link href="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-beige" id="embroidery">
                <div className="container">
                    <div className="grid grid-2">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Pricing</h3>
                                <p className="card-text">Starting from ₹200</p>
                                <p className="card-text" style={{ fontSize: 'var(--text-sm)' }}>
                                    *Price varies based on design complexity
                                </p>
                                <Link href="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                                    Get Quote
                                </Link>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🎨</div>
                            <h2 style={{ color: 'var(--color-maroon)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
                                Embroidery Work
                            </h2>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: 'var(--space-4)' }}>
                                Both hand and computer embroidery services for stunning designs on any fabric. Perfect for
                                adding personalized touches to your garments.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-gray-600)' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Hand and machine embroidery</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Custom designs welcome</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Wide range of patterns</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Quality thread and materials</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section bg-white" id="custom">
                <div className="container">
                    <div className="grid grid-2">
                        <div>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>📏</div>
                            <h2 style={{ color: 'var(--color-maroon)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-4)' }}>
                                Custom Stitching
                            </h2>
                            <p style={{ color: 'var(--color-gray-600)', lineHeight: '1.8', marginBottom: 'var(--space-4)' }}>
                                Personalized measurements and tailoring for salwars, kurtis, lehengas, and more. We create
                                garments that fit you perfectly and match your style.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--color-gray-600)' }}>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Precise measurements</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ All types of ethnic wear</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Alterations available</li>
                                <li style={{ marginBottom: 'var(--space-2)' }}>✓ Fitting trials provided</li>
                            </ul>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">Pricing</h3>
                                <p className="card-text">Salwar: ₹400</p>
                                <p className="card-text">Kurti: ₹350</p>
                                <p className="card-text">Lehenga: ₹800+</p>
                                <Link href="/contact" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                                    Book Appointment
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-maroon), var(--color-maroon-dark))', color: 'white' }}>
                <div className="container text-center">
                    <h2 style={{ color: 'var(--color-gold)', fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>
                        Ready to Get Started?
                    </h2>
                    <p style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)', color: 'white' }}>
                        Visit us today or book an appointment for personalized service
                    </p>
                    <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
                        <Link href="/contact" className="btn btn-gold btn-lg">
                            Contact Us
                        </Link>
                        <a href="tel:9030600126" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                            📞 9030600126
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
