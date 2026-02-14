export default function TestimonialsPage() {
    const reviews = [
        { name: 'Deon', rating: 5, text: "Great prices, good quality. The perfect fitting and attention to detail is amazing! Totally recommend for anyone looking for custom stitching." },
        { name: 'Sahithi', rating: 5, text: "Perfect fitting & neat finishing! This is my go-to boutique for all occasions. They understood exactly what I wanted for my wedding blouse." },
        { name: 'Kiranmai', rating: 5, text: "Attention to detail is exceptional. Women Fashion never disappoints! The Maggam work was exquisite and completed on time." },
        { name: 'Priya', rating: 5, text: "Very friendly staff and professional service. They have a huge collection of fabrics too which makes it convenient." },
        { name: 'Lakshmi', rating: 4, text: "Good stitching and timely delivery. Prices are reasonable compared to other boutiques in Jubilee Hills." },
        { name: 'Anusha', rating: 5, text: "Best boutique in Vizag! I get all my kids' clothes stitched here. The designs are unique and the kids find them very comfortable." },
    ];

    return (
        <div style={{ marginTop: '70px' }}>
            <section className="hero" style={{ minHeight: '50vh' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Client Love</h1>
                    <p className="hero-subtitle">What Our Happy Customers Say</p>
                </div>
            </section>

            <section className="section bg-white">
                <div className="container">
                    <div className="grid grid-3">
                        {reviews.map((review, index) => (
                            <div key={index} className="card testimonial-card">
                                <div className="card-body">
                                    <div style={{ color: 'var(--color-gold)', fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>
                                        {'⭐'.repeat(review.rating)}
                                    </div>
                                    <p className="card-text">"{review.text}"</p>
                                    <h4 style={{ color: 'var(--color-peacock)', fontSize: 'var(--text-base)', marginTop: 'var(--space-4)' }}>
                                        — {review.name}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <h3 style={{ color: 'var(--color-maroon)', marginBottom: 'var(--space-4)' }}>Have you visited us?</h3>
                        <a href="https://g.page/r/example" target="_blank" className="btn btn-outline">Write a Review on Google</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
