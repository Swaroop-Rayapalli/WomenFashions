'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminFeedback() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', text: '' });

    const fetchFeedbacks = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`);
            const data = await res.json();
            if (data.success) {
                setFeedbacks(data.data);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setStatus({ type: 'error', text: 'Failed to load feedback' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
        if (!authLoading && (!user || !isAdminOrStaff)) {
            router.push('/');
            return;
        }

        if (user) {
            fetchFeedbacks();
        }
    }, [user, authLoading, router, fetchFeedbacks]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setFeedbacks(feedbacks.filter(f => f.id !== id));
                setStatus({ type: 'success', text: 'Feedback deleted' });
            }
        } catch (error) {
            console.error('Error deleting feedback:', error);
            setStatus({ type: 'error', text: 'Delete failed' });
        }
    };

    if (authLoading || isLoading) return <div className="text-center p-20">Loading...</div>;

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="mb-12">
                    <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>Customer Feedback</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>Manage and review all customer reviews and feedback</p>
                </div>
                {status.text && (
                    <div style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        marginBottom: '32px', 
                        backgroundColor: status.type === 'success' ? '#ecfdf5' : '#fff1f2',
                        color: status.type === 'success' ? '#065f46' : '#9f1239',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: `1px solid ${status.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                    }}>
                        {status.text}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    {feedbacks.length > 0 ? feedbacks.map(feedback => (
                        <div key={feedback.id} style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', gap: '24px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ color: '#f97316', fontSize: '18px', marginBottom: '4px' }}>{'⭐'.repeat(feedback.rating)}</div>
                                        <div style={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>{feedback.name}</div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(feedback.created_at || feedback.createdAt).toLocaleString()}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(feedback.id)}
                                        style={{ backgroundColor: '#fff', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '15px', fontStyle: 'italic' }}>"{feedback.message}"</p>
                                
                                {(() => {
                                    let images = feedback.images;
                                    
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
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                                            {imageList.map((img: string, idx: number) => (
                                                <div key={idx} style={{ width: '180px', height: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #e5e7eb' }}>
                            No feedback entries yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
