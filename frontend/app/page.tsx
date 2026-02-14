import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Perfect Fit. Elegant Designs.</h1>
          <p className="hero-subtitle">Crafted for Every Occasion Since 2011</p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg">📅 Book Appointment</button>
            <Link href="/collections" className="btn btn-gold btn-lg">
              ✨ View Collections
            </Link>
            <button className="btn btn-outline btn-lg">📞 Call Now</button>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Specialties</h2>
            <p className="section-subtitle">
              Premium designing and stitching services tailored to perfection
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card service-item">
              <div className="card-body text-center">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✨</div>
                <h3 className="card-title">Maggam Work</h3>
                <p className="card-text">
                  Exquisite hand embroidery with intricate designs, beads, and sequins for that perfect traditional look.
                </p>
                <Link href="/services#maggam" className="btn btn-sm btn-outline">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="card service-item">
              <div className="card-body text-center">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👗</div>
                <h3 className="card-title">Designer Blouses</h3>
                <p className="card-text">
                  Custom-designed blouses with perfect fitting, modern patterns, and traditional craftsmanship.
                </p>
                <Link href="/services#blouses" className="btn btn-sm btn-outline">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="card service-item">
              <div className="card-body text-center">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🧵</div>
                <h3 className="card-title">Saree Fall & Pico</h3>
                <p className="card-text">
                  Professional saree finishing services with neat fall and pico work for a polished appearance.
                </p>
                <Link href="/services#saree" className="btn btn-sm btn-outline">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="card service-item">
              <div className="card-body text-center">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎨</div>
                <h3 className="card-title">Embroidery Work</h3>
                <p className="card-text">
                  Both hand and computer embroidery services for stunning designs on any fabric.
                </p>
                <Link href="/services#embroidery" className="btn btn-sm btn-outline">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="card service-item">
              <div className="card-body text-center">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👶</div>
                <h3 className="card-title">Kids Wear</h3>
                <p className="card-text">
                  Adorable lehengas, frocks, and ethnic wear for your little ones with comfortable fitting.
                </p>
                <Link href="/collections#kids" className="btn btn-sm btn-outline">
                  View Collection
                </Link>
              </div>
            </div>

            <div className="card service-item">
              <div className="card-body text-center">
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📏</div>
                <h3 className="card-title">Custom Stitching</h3>
                <p className="card-text">
                  Personalized measurements and tailoring for salwars, kurtis, and lehengas.
                </p>
                <Link href="/services#custom" className="btn btn-sm btn-outline">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-beige">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Women Fashion?</h2>
            <p className="section-subtitle">14+ years of excellence in designing and stitching</p>
          </div>

          <div className="grid grid-2">
            <div className="card card-gold">
              <div className="card-body">
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                  ✓ Perfect Fitting
                </h3>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Our expert tailors ensure every piece fits you perfectly with precise measurements and attention to detail.
                </p>
              </div>
            </div>

            <div className="card card-gold">
              <div className="card-body">
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                  ✓ Neat Finishing
                </h3>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Professional finishing on every garment with meticulous care for quality and durability.
                </p>
              </div>
            </div>

            <div className="card card-gold">
              <div className="card-body">
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                  ✓ Competitive Pricing
                </h3>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Premium quality at reasonable prices. Get the best value for your investment.
                </p>
              </div>
            </div>

            <div className="card card-gold">
              <div className="card-body">
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                  ✓ Friendly Staff
                </h3>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Our welcoming team is always ready to help you find the perfect design and style.
                </p>
              </div>
            </div>

            <div className="card card-gold">
              <div className="card-body">
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                  ✓ Wide Variety
                </h3>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Extensive collection of fabrics including cotton silk, Banaras, and designer materials.
                </p>
              </div>
            </div>

            <div className="card card-gold">
              <div className="card-body">
                <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-3)' }}>
                  ✓ Two Locations
                </h3>
                <p style={{ color: 'var(--color-gray-700)' }}>
                  Conveniently located in Jubilee Hills and Banjara Hills Junction for easy access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">⭐ 4.5 Rating from 87+ Happy Customers</p>
          </div>

          <div className="grid grid-3">
            <div className="card testimonial-card">
              <div className="card-body">
                <div style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="card-text">
                  "Great prices, good quality. The perfect fitting and attention to detail is amazing!"
                </p>
                <h4 style={{ color: 'var(--color-peacock)', fontSize: 'var(--text-base)', marginTop: 'var(--space-4)' }}>
                  — Deon
                </h4>
              </div>
            </div>

            <div className="card testimonial-card">
              <div className="card-body">
                <div style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="card-text">
                  "Perfect fitting & neat finishing! This is my go-to boutique for all occasions."
                </p>
                <h4 style={{ color: 'var(--color-peacock)', fontSize: 'var(--text-base)', marginTop: 'var(--space-4)' }}>
                  — Sahithi
                </h4>
              </div>
            </div>

            <div className="card testimonial-card">
              <div className="card-body">
                <div style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>
                  ⭐⭐⭐⭐⭐
                </div>
                <p className="card-text">
                  "Attention to detail is exceptional. Women Fashion never disappoints!"
                </p>
                <h4 style={{ color: 'var(--color-peacock)', fontSize: 'var(--text-base)', marginTop: 'var(--space-4)' }}>
                  — Kiranmai
                </h4>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/testimonials" className="btn btn-primary">
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer CTA */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, var(--color-maroon), var(--color-maroon-dark))',
          color: 'white',
        }}
      >
        <div className="container text-center">
          <h2 style={{ color: 'var(--color-gold)', fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-4)' }}>
            🎉 Special Aashadam Offer!
          </h2>
          <p style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)', color: 'white' }}>
            Get Up to 50% OFF on Selected Items
          </p>
          <Link href="/offers" className="btn btn-gold btn-lg">
            View All Offers
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-beige">
        <div className="container text-center">
          <h2 className="section-title">Ready to Get Started?</h2>
          <p className="section-subtitle">Visit us today or book an appointment for personalized service</p>
          <div className="flex-center gap-4" style={{ marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg">📅 Book Appointment</button>
            <Link href="/contact" className="btn btn-gold btn-lg">
              📍 Visit Our Store
            </Link>
            <button className="btn btn-outline btn-lg">📞 9030600126</button>
          </div>
        </div>
      </section>
    </div>
  );
}
