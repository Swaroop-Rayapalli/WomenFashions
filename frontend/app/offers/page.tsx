import Link from 'next/link';

export default function OffersPage() {
    return (
        <div style={{ marginTop: '70px' }}>
            <section className="hero" style={{ minHeight: '60vh', background: 'linear-gradient(135deg, var(--color-maroon), var(--color-maroon-dark))' }}>
                <div className="hero-content">
                    <h1 className="hero-title" style={{ color: 'var(--color-gold)' }}>Special Offers</h1>
                    <p className="hero-subtitle" style={{ color: 'white' }}>Exclusive Deals & Seasonal Discounts</p>
                </div>
            </section>

            <section className="section bg-white">
                <div className="container">
                    {/* Main Offer */}
                    <div className="card" style={{ border: '2px solid var(--color-gold)', background: 'var(--color-beige)' }}>
                        <div className="card-body text-center" style={{ padding: 'var(--space-12) var(--space-6)' }}>
                            <span style={{
                                background: 'var(--color-maroon)',
                                color: 'white',
                                padding: 'var(--space-2) var(--space-4)',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 'bold',
                                fontSize: 'var(--text-sm)'
                            }}>
                                LIMITED TIME
                            </span>
                            <h2 style={{
                                fontSize: 'var(--text-5xl)',
                                color: 'var(--color-maroon)',
                                margin: 'var(--space-6) 0'
                            }}>
                                Aashadam Super Sale
                            </h2>
                            <p style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-gray-700)', marginBottom: 'var(--space-8)' }}>
                                Get flat <strong style={{ color: 'var(--color-gold-dark)' }}>20% OFF</strong> on all stitching services above ₹2000
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                                <Link href="/contact" className="btn btn-primary btn-lg">Claim Offer</Link>
                                <Link href="/collections" className="btn btn-outline btn-lg">View Collections</Link>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-12)' }}>
                        <h3 className="section-title text-center">More Deals</h3>
                        <div className="grid grid-2">
                            <div className="card card-gold">
                                <div className="card-body">
                                    <h3 className="card-title">Wedding Package</h3>
                                    <p className="card-text">
                                        Book bridal blouse stitching + family lehengas (min 3) and get <strong>Complimentary Saree Polishing</strong> worth ₹1000.
                                    </p>
                                    <Link href="/contact" className="btn btn-sm btn-outline">Enquire</Link>
                                </div>
                            </div>
                            <div className="card card-gold">
                                <div className="card-body">
                                    <h3 className="card-title">Referral Bonus</h3>
                                    <p className="card-text">
                                        Refer a friend and both get <strong>10% OFF</strong> on your next visit. Ask staff for referral card.
                                    </p>
                                    <Link href="/contact" className="btn btn-sm btn-outline">Enquire</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
