'use client';

import { useState } from 'react';

export default function FeedbackForm() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
            
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('message', message);
            formData.append('rating', rating.toString());
            
            images.forEach(img => {
                formData.append('images', img);
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', text: 'Thank you for your feedback! It will be visible after approval.' });
                setName('');
                setMessage('');
                setRating(5);
                setImages([]);
                setPreviews([]);
            } else {
                throw new Error(data.message || 'Feedback submission failed');
            }
        } catch (error: any) {
            console.error('Feedback Error:', error);
            setStatus({ type: 'error', text: error.message || 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="section bg-beige" style={{ backgroundColor: 'var(--color-beige)' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="section-header">
                    <h2 className="section-title">Share Your Experience</h2>
                    <p className="section-subtitle" style={{ color: 'var(--color-gray-600)' }}>We value your feedback and love hearing from our customers!</p>
                </div>

                <div className="card" style={{ padding: 'var(--space-8)', backgroundColor: 'var(--color-white)', borderColor: 'var(--color-gray-200)' }}>
                    {status.text && (
                        <div style={{ 
                            padding: 'var(--space-4)', 
                            backgroundColor: status.type === 'success' ? 'var(--color-success-light, #dcfce7)' : 'var(--color-error-light, #fee2e2)', 
                            color: status.type === 'success' ? 'var(--color-success, #166534)' : 'var(--color-error, #991b1b)', 
                            borderRadius: 'var(--radius-md)', 
                            marginBottom: 'var(--space-6)',
                            textAlign: 'center',
                            border: `1px solid ${status.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'}`
                        }}>
                            {status.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div className="grid grid-2">
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--color-gray-800)' }}>Your Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    className="form-control"
                                    placeholder="Enter your name"
                                    style={{ 
                                        width: '100%', 
                                        padding: 'var(--space-3)', 
                                        border: '1px solid var(--color-gray-300)', 
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--color-gray-100)',
                                        color: 'var(--color-gray-800)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--color-gray-800)' }}>Rating</label>
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    className="form-control"
                                    style={{ 
                                        width: '100%', 
                                        padding: 'var(--space-3)', 
                                        border: '1px solid var(--color-gray-300)', 
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--color-gray-100)',
                                        color: 'var(--color-gray-800)'
                                    }}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                                    <option value="4">⭐⭐⭐⭐ (Good)</option>
                                    <option value="3">⭐⭐⭐ (Average)</option>
                                    <option value="2">⭐⭐ (Fair)</option>
                                    <option value="1">⭐ (Poor)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--color-gray-800)' }}>Your Message</label>
                            <textarea 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                required 
                                rows={4}
                                className="form-control"
                                placeholder="Tell us what you liked about our service..."
                                style={{ 
                                    width: '100%', 
                                    padding: 'var(--space-3)', 
                                    border: '1px solid var(--color-gray-300)', 
                                    borderRadius: 'var(--radius-md)', 
                                    resize: 'vertical',
                                    backgroundColor: 'var(--color-gray-100)',
                                    color: 'var(--color-gray-800)'
                                }}
                            ></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--color-gray-800)' }}>Upload Photos (Up to 5)</label>
                            <div className="flex flex-col gap-4">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    onChange={handleImageChange}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px dashed var(--color-gray-300)', 
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--color-gray-50)',
                                        color: 'var(--color-gray-600)'
                                    }}
                                />
                                
                                {previews.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {previews.map((preview, index) => (
                                            <div key={index} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-gray-300)' }}>
                                                <img src={preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    style={{ 
                                                        position: 'absolute', 
                                                        top: '2px', 
                                                        right: '2px', 
                                                        background: 'rgba(220, 38, 38, 0.9)', 
                                                        color: 'white', 
                                                        borderRadius: '50%', 
                                                        width: '20px', 
                                                        height: '20px', 
                                                        fontSize: '12px', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: 'var(--space-2)' }}>
                                Share photos of your custom outfit! You can select up to 5 images.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="btn btn-primary btn-lg"
                            style={{ 
                                marginTop: 'var(--space-4)',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
