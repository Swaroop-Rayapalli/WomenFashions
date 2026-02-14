export default function ContactPage() {
    return (
        <div style={{ marginTop: '70px' }}>
            {/* Hero */}
            <section className="hero" style={{ minHeight: '60vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Contact Us</h1>
                    <p className="hero-subtitle">We'd love to hear from you</p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="section bg-white">
                <div className="container">
                    <div className="grid grid-2">
                        {/* Contact Form */}
                        <div>
                            <h2 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-6)' }}>
                                Send us a Message
                            </h2>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3)',
                                            border: '2px solid var(--color-gray-300)',
                                            borderRadius: 'var(--radius-lg)',
                                            fontSize: 'var(--text-base)'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3)',
                                            border: '2px solid var(--color-gray-300)',
                                            borderRadius: 'var(--radius-lg)',
                                            fontSize: 'var(--text-base)'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3)',
                                            border: '2px solid var(--color-gray-300)',
                                            borderRadius: 'var(--radius-lg)',
                                            fontSize: 'var(--text-base)'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--space-3)',
                                            border: '2px solid var(--color-gray-300)',
                                            borderRadius: 'var(--radius-lg)',
                                            fontSize: 'var(--text-base)',
                                            fontFamily: 'inherit'
                                        }}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Details */}
                        <div>
                            <h2 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-6)' }}>
                                Get in Touch
                            </h2>

                            <div className="card card-gold" style={{ marginBottom: 'var(--space-6)' }}>
                                <div className="card-body">
                                    <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                                        📞 Phone
                                    </h3>
                                    <p style={{ color: 'var(--color-gray-700)' }}>
                                        <a href="tel:9030600126" style={{ color: 'var(--color-peacock)', fontWeight: 600 }}>
                                            9030600126
                                        </a>
                                    </p>
                                    <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
                                        Call us for appointments and inquiries
                                    </p>
                                </div>
                            </div>

                            <div className="card card-gold" style={{ marginBottom: 'var(--space-6)' }}>
                                <div className="card-body">
                                    <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                                        📍 Location 1
                                    </h3>
                                    <p style={{ color: 'var(--color-gray-700)' }}>
                                        MG Road, near City Center<br />
                                        Anand Nagar, Visakhapatnam
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
                                </div>
                            </div>

                            <div style={{ marginTop: 'var(--space-6)' }}>
                                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                                    🕒 Business Hours
                                </h3>
                                <p style={{ color: 'var(--color-gray-700)' }}>
                                    Monday - Sunday: 10:00 AM - 8:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WhatsApp CTA */}
            <section className="section bg-beige">
                <div className="container text-center">
                    <h2 className="section-title">Prefer WhatsApp?</h2>
                    <p className="section-subtitle">Chat with us directly for quick responses</p>
                    <a
                        href="https://wa.me/919030600126?text=Hello! I would like to know more about your services."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-lg"
                        style={{
                            background: 'linear-gradient(135deg, #25D366, #128C7E)',
                            color: 'white',
                            marginTop: 'var(--space-4)'
                        }}
                    >
                        💬 Chat on WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
}
