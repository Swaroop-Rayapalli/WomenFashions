import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* About Section */}
                    <div className="footer-section">
                        <h3>Women Fashion</h3>
                        <p>Premium Designing & Stitching Boutique</p>
                        <p>Serving Visakhapatnam since 2011</p>
                        <p style={{ marginTop: 'var(--space-4)' }}>⭐⭐⭐⭐⭐ 4.5 Rating</p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <Link href="/about">About Us</Link>
                        <Link href="/collections">Collections</Link>
                        <Link href="/services">Services</Link>
                        <Link href="/gallery">Gallery</Link>
                        <Link href="/offers">Special Offers</Link>
                    </div>

                    {/* Services */}
                    <div className="footer-section">
                        <h3>Our Services</h3>
                        <Link href="/services#maggam">Maggam Work</Link>
                        <Link href="/services#blouses">Designer Blouses</Link>
                        <Link href="/services#saree">Saree Fall & Pico</Link>
                        <Link href="/services#embroidery">Embroidery</Link>
                        <Link href="/services#custom">Custom Stitching</Link>
                    </div>

                    {/* Contact */}
                    <div className="footer-section">
                        <h3>Contact Us</h3>
                        <p>📞 9030600126</p>
                        <p>📍 MG Road, near City Center</p>
                        <p>Anand Nagar, Visakhapatnam</p>
                        <p>📍 Uppada Road, Near INS Kalinga</p>
                        <p>Uppada, Visakhapatnam, AP 531163</p>
                        <p>🕒 10:00 AM - 8:00 PM</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>
                        © 2025 Women Fashion. All rights reserved to Swaroop Rayapalli. | Designed with ❤️ for Premium Fashion
                    </p>
                </div>
            </div>
        </footer>
    );
}
