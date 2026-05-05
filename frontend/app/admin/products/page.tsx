'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

export default function AdminProducts() {
    const { user, isLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [view, setView] = useState<'list' | 'form'>('list');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });
    const [editingId, setEditingId] = useState<number | null>(null);

    // Data states
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Form states
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [description, setDescription] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>(['']);
    const [fabric, setFabric] = useState('');
    const [occasion, setOccasion] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) setProducts(data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success && data.data) {
                console.log('Fetched Categories:', data.data);
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    useEffect(() => {
        const isAdminOrStaff = user?.role === 'admin' || user?.role === 'staff';
        if (!isLoading && (!user || !isAdminOrStaff)) {
            router.push('/');
            return;
        }

        if (user) {
            fetchProducts();
            fetchCategories();
        }
    }, [user, isLoading, router, fetchProducts, fetchCategories]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setName(product.name);
        setPrice(product.price.toString());
        setCategoryId(product.categoryId?.toString() || '');
        const cat = categories.find(c => c.id.toString() === product.categoryId?.toString());
        setCategorySearch(cat ? cat.name : '');
        setDescription(product.description || '');
        setFabric(product.fabric || '');
        setOccasion(product.occasion || '');
        setIsFeatured(product.isFeatured || false);
        setSelectedSizes(product.sizes?.map((s: any) => s.size) || []);
        setImageUrls(product.images?.map((img: any) => img.imageUrl) || ['']);
        setView('form');
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProducts(products.filter(p => p.id !== id));
                setStatus({ type: 'success', text: 'Product deleted successfully' });
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            setStatus({ type: 'error', text: 'Failed to delete product' });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setPrice('');
        setDescription('');
        setImageUrls(['']);
        setFabric('');
        setOccasion('');
        setIsFeatured(false);
        setCategoryId('');
        setCategorySearch('');
        setSelectedSizes([]);
        setStatus({ type: '', text: '' });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                const newUrls = [...imageUrls];
                newUrls[index] = data.data.path;
                setImageUrls(newUrls);
                setStatus({ type: 'success', text: 'Image uploaded successfully!' });
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            setStatus({ type: 'error', text: error.message || 'Image upload failed' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId) {
            setStatus({ type: 'error', text: 'Please select a category' });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        const payload = {
            name,
            price: parseFloat(price),
            categoryId: parseInt(categoryId),
            description,
            fabric,
            occasion,
            isFeatured,
            images: imageUrls.filter(url => url.trim() !== ''),
            sizes: selectedSizes,
            stockQuantity: 100
        };

        try {
            const token = localStorage.getItem('token');
            const url = editingId 
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
            
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', text: editingId ? 'Product updated!' : 'Product added!' });
                if (!editingId) resetForm();
                fetchProducts();
                setTimeout(() => setView('list'), 1500);
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            setStatus({ type: 'error', text: error.message || 'Failed to save product' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (categories.length > 0 && categoryId) {
            const cat = categories.find(c => c.id.toString() === categoryId.toString());
            if (cat && !categorySearch) setCategorySearch(cat.name);
        }
    }, [categories, categoryId]);

    const filteredCategories = !categorySearch || categorySearch === (categories.find(c => c.id.toString() === categoryId)?.name || '')
        ? categories 
        : categories.filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()));

    if (isLoading) return <div className="text-center p-20">Loading...</div>;

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
                            {view === 'list' ? 'Inventory' : editingId ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '15px' }}>
                            {view === 'list' ? 'Manage your boutique collection' : 'Fill in the details to publish a new item'}
                        </p>
                    </div>
                    <button 
                        onClick={() => {
                            if (view === 'form') resetForm();
                            setView(view === 'list' ? 'form' : 'list');
                        }} 
                        style={{ 
                            backgroundColor: view === 'list' ? '#f97316' : '#fff',
                            color: view === 'list' ? '#fff' : '#374151',
                            border: view === 'list' ? 'none' : '1px solid #e5e7eb',
                            borderRadius: '10px',
                            padding: '12px 24px',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {view === 'list' ? '+ Add Product' : 'Cancel'}
                    </button>
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

                {view === 'list' ? (
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Product</th>
                                    <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Category</th>
                                    <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Price</th>
                                    <th style={{ textAlign: 'left', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Sizes</th>
                                    <th style={{ textAlign: 'right', padding: '20px 24px', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="flex items-center gap-4">
                                                <img src={product.images?.[0]?.imageUrl || '/images/placeholder.png'} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#111827' }}>{product.name}</div>
                                                    {product.isFeatured && <span style={{ fontSize: '10px', color: '#f97316', fontWeight: 700 }}>FEATURED</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', color: '#4b5563', fontSize: '14px' }}>{product.category?.name}</td>
                                        <td style={{ padding: '20px 24px', fontWeight: 600, color: '#111827' }}>₹{product.price}</td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="flex flex-wrap gap-1">
                                                {product.sizes?.map((s: any) => (
                                                    <span key={s.id} style={{ fontSize: '10px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#4b5563', fontWeight: 600 }}>{s.size}</span>
                                                ))}
                                                {(!product.sizes || product.sizes.length === 0) && <span style={{ fontSize: '11px', color: '#9ca3af' }}>No sizes</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <button onClick={() => handleEdit(product)} style={{ color: '#4f46e5', fontWeight: 600, fontSize: '13px', marginRight: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleDelete(product.id)} style={{ color: '#dc2626', fontWeight: 600, fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* Media Section */}
                        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Product Images</h3>
                            <div className="flex flex-wrap gap-4">
                                {imageUrls.filter(u => u !== '').map((u, i) => (
                                    <div key={i} style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                        <img src={u} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}>×</button>
                                    </div>
                                ))}
                                <div 
                                    onClick={() => document.getElementById('image-upload')?.click()}
                                    style={{ width: '120px', height: '120px', borderRadius: '12px', border: '2px dashed #d1d5db', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', backgroundColor: '#f9fafb' }}
                                >
                                    <span style={{ fontSize: '24px' }}>+</span>
                                    <span style={{ fontSize: '12px', fontWeight: 500 }}>Upload</span>
                                </div>
                                <input id="image-upload" type="file" multiple accept="image/*" onChange={(e) => {
                                    if (e.target.files) {
                                        Array.from(e.target.files).forEach((file, idx) => {
                                            const fakeE = { target: { files: [file] } } as any;
                                            handleImageUpload(fakeE, Math.min(imageUrls.length + idx, 4));
                                        });
                                    }
                                }} style={{ display: 'none' }} />
                            </div>
                        </div>

                        {/* Form Details */}
                        <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Product Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Designer Silk Saree" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }} />
                                </div>
                                <div className="flex flex-col gap-2" ref={dropdownRef}>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Category</label>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="text" 
                                            value={categorySearch} 
                                            onChange={(e) => { setCategorySearch(e.target.value); setShowCategoryDropdown(true); }} 
                                            onFocus={(e) => {
                                                setShowCategoryDropdown(true);
                                                e.target.select();
                                            }}
                                            placeholder="Search categories..." 
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }} 
                                        />
                                        {showCategoryDropdown && (
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: 'calc(100% + 4px)', 
                                                left: 0, 
                                                width: '100%', 
                                                zIndex: 9999, 
                                                backgroundColor: '#fff', 
                                                border: '1px solid #e5e7eb', 
                                                borderRadius: '8px', 
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                                                maxHeight: '250px', 
                                                overflowY: 'auto' 
                                            }}>
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map(cat => (
                                                        <div key={cat.id} onClick={() => { setCategoryId(cat.id.toString()); setCategorySearch(cat.name); setShowCategoryDropdown(false); }} style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>{cat.name}</div>
                                                    ))
                                                ) : (
                                                    <div style={{ padding: '12px 16px', fontSize: '14px', color: '#9ca3af' }}>No categories found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Price (₹)</label>
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Fabric</label>
                                    <input type="text" value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="e.g. Silk" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Occasion</label>
                                    <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="e.g. Wedding" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px' }} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the product details..." rows={4} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '15px', resize: 'none' }} />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map(size => (
                                        <div 
                                            key={size}
                                            onClick={() => {
                                                if (selectedSizes.includes(size)) {
                                                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                                                } else {
                                                    setSelectedSizes([...selectedSizes, size]);
                                                }
                                            }}
                                            style={{ 
                                                padding: '8px 20px', 
                                                borderRadius: '8px', 
                                                border: selectedSizes.includes(size) ? '2px solid #111827' : '1px solid #d1d5db',
                                                backgroundColor: selectedSizes.includes(size) ? '#111827' : '#fff',
                                                color: selectedSizes.includes(size) ? '#fff' : '#374151',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="featured-box" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#f97316' }} />
                                    <label htmlFor="featured-box" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>Show in Featured Section</label>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    style={{ 
                                        backgroundColor: '#111827', 
                                        color: '#fff', 
                                        padding: '12px 40px', 
                                        borderRadius: '8px', 
                                        fontWeight: 600, 
                                        border: 'none', 
                                        cursor: 'pointer',
                                        transition: 'opacity 0.2s'
                                    }}
                                >
                                    {isSubmitting ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
