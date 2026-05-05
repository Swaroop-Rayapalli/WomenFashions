'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Feedback {
    id: number;
    name: string;
    message: string;
    rating: number;
    images: string[] | string | null | any;
    likes?: number;
    dislikes?: number;
}

interface TestimonialsProps {
    limit?: number;
    showTitle?: boolean;
}

export default function Testimonials({ limit, showTitle = true }: TestimonialsProps) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
                cache: 'no-store'
            });
            const data = await res.json();
            if (data.success) {
                setFeedbacks(data.data);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleLike = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}/like`, { 
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const data = await res.json();
            if (res.ok) {
                setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, likes: data.likes, dislikes: data.dislikes } : f));
            } else if (res.status !== 400) {
                console.error('Like failed:', data.message);
            }
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    const handleDislike = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}/dislike`, { 
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            const data = await res.json();
            if (res.ok) {
                setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, likes: data.likes, dislikes: data.dislikes } : f));
            } else if (res.status !== 400) {
                console.error('Dislike failed:', data.message);
            }
        } catch (err) {
            console.error('Dislike failed:', err);
        }
    };

    // Default testimonials if none from database
    const defaultTestimonials = [
        { id: -1, name: 'Deon', message: 'Great prices, good quality. The perfect fitting and attention to detail is amazing!', rating: 5, images: null, likes: 12, dislikes: 0 },
        { id: -2, name: 'Sahithi', message: 'Perfect fitting & neat finishing! This is my go-to boutique for all occasions.', rating: 5, images: null, likes: 8, dislikes: 0 },
        { id: -3, name: 'Kiranmai', message: 'Attention to detail is exceptional. Women Fashion never disappoints!', rating: 5, images: null, likes: 15, dislikes: 0 },
    ];

    const displayFeedbacks = feedbacks.length > 0 ? feedbacks : defaultTestimonials;
    const limitedFeedbacks = limit ? displayFeedbacks.slice(0, limit) : displayFeedbacks;

    if (isLoading) return <div className="text-center p-8">Loading testimonials...</div>;

    return (
        <section className="section bg-white" style={{ backgroundColor: 'var(--color-white)' }}>
            <div className="container">
                {showTitle && (
                    <div className="section-header">
                        <h2 className="section-title">What Our Customers Say</h2>
                        <p className="section-subtitle" style={{ color: 'var(--color-gray-600)' }}>⭐ 4.5 Rating from 87+ Happy Customers</p>
                    </div>
                )}

                <div className="grid grid-3">
                    {limitedFeedbacks.map((item) => (
                        <div key={item.id} className="card testimonial-card h-full" style={{ backgroundColor: 'var(--color-gray-100)', borderColor: 'var(--color-gray-200)' }}>
                            <div className="card-body flex flex-col h-full">
                                <div style={{ color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: 'var(--space-3)' }}>
                                    {'⭐'.repeat(item.rating)}
                                </div>
                                <p className="card-text flex-grow" style={{ fontStyle: 'italic', color: 'var(--color-gray-800)' }}>
                                    "{item.message}"
                                </p>

                                {(() => {
                                    let images = item.images;
                                    
                                    // Handle cases where JSON might be returned as a string
                                    if (typeof images === 'string' && (images.startsWith('[') || images.startsWith('{'))) {
                                        try {
                                            images = JSON.parse(images);
                                        } catch (e) {
                                            console.error('Error parsing images JSON:', e);
                                        }
                                    }

                                    const imageList = (() => {
                                        if (Array.isArray(images)) return images;
                                        if (typeof images !== 'string') return [];
                                        
                                        // Handle JSON string
                                        if (images.startsWith('[') || images.startsWith('{')) {
                                            try {
                                                return JSON.parse(images);
                                            } catch (e) {
                                                console.error('Error parsing images JSON:', e);
                                            }
                                        }
                                        
                                        // Handle comma-separated strings
                                        if (images.includes(',')) {
                                            return images.split(',').map(s => s.trim());
                                        }
                                        
                                        return [images];
                                    })().filter((img: any) => typeof img === 'string' && img.trim().startsWith('http'));
                                    
                                    if (imageList.length === 0) return null;

                                    return (
                                        <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                            {imageList.map((img: string, idx: number) => (
                                                <div 
                                                    key={idx} 
                                                    onClick={() => setSelectedImage(img)}
                                                    style={{ 
                                                        position: 'relative', 
                                                        width: imageList.length === 1 ? '100%' : 'calc(50% - 4px)', 
                                                        height: imageList.length === 1 ? '200px' : '120px', 
                                                        borderRadius: 'var(--radius-md)', 
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        border: '1px solid var(--color-gray-300)'
                                                    }}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`Feedback ${idx} from ${item.name}`}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                <div className="flex flex-between" style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-gray-200)', paddingTop: 'var(--space-4)' }}>
                                    <h4 style={{ color: 'var(--color-peacock)', fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
                                        — {item.name}
                                    </h4>
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleLike(item.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gray-600)', fontSize: '14px' }}
                                        >
                                            👍 {item.likes || 0}
                                        </button>
                                        <button 
                                            onClick={() => handleDislike(item.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-gray-600)', fontSize: '14px' }}
                                        >
                                            👎 {item.dislikes || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {limit && (
                    <div className="text-center mt-12">
                        <Link href="/testimonials" className="btn btn-outline" style={{ borderColor: 'var(--color-maroon)', color: 'var(--color-maroon)' }}>
                            ✨ View All Reviews & Feedback
                        </Link>
                    </div>
                )}
            </div>

            {/* Lightbox / Wide View */}
            {selectedImage && (
                <div 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        width: '100vw', 
                        height: '100vh', 
                        backgroundColor: 'rgba(0,0,0,0.9)', 
                        zIndex: 2000, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '40px'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        style={{ position: 'absolute', top: '20px', right: '20px', color: 'white', fontSize: '30px', background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => setSelectedImage(null)}
                    >
                        ✕
                    </button>
                    <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '1000px' }}>
                        <Image
                            src={selectedImage}
                            alt="Wide view"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

