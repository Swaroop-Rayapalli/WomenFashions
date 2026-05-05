'use client';

import Testimonials from '../components/Testimonials';
import FeedbackForm from '../components/FeedbackForm';

export default function TestimonialsPage() {
    return (
        <div style={{ marginTop: '70px' }}>
            <section className="hero" style={{ minHeight: '50vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Client Love</h1>
                    <p className="hero-subtitle">What Our Happy Customers Say</p>
                </div>
            </section>

            {/* Dynamic Testimonials Section */}
            <Testimonials />

            {/* Feedback Form Section (Added here too as per "add them back") */}
            <FeedbackForm />

            <section className="section bg-white">
                <div className="container">
                    <div className="text-center mt-8">
                        <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-4)' }}>Have you visited us?</h3>
                        <a href="https://g.page/r/example" target="_blank" className="btn btn-outline">Write a Review on Google</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
