'use client';

import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: string;
    images?: { url: string }[];
}

interface AddOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddOrderModal({ isOpen, onClose, onSuccess }: AddOrderModalProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('whatsapp');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProductToOrder = (product: Product) => {
        const existing = selectedProducts.find(p => p.id === product.id);
        if (existing) {
            setSelectedProducts(selectedProducts.map(p => 
                p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { 
                ...product, 
                quantity: 1, 
                size: 'M' // Default size
            }]);
        }
    };

    const removeProductFromOrder = (id: number) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setSelectedProducts(selectedProducts.map(p => {
            if (p.id === id) {
                const newQty = Math.max(1, p.quantity + delta);
                return { ...p, quantity: newQty };
            }
            return p;
        }));
    };

    const updateSize = (id: number, size: string) => {
        setSelectedProducts(selectedProducts.map(p => 
            p.id === id ? { ...p, size } : p
        ));
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((sum, p) => sum + (parseFloat(p.price) * p.quantity), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedProducts.length === 0) {
            alert('Please add at least one product');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: selectedProducts,
                    totalAmount: calculateTotal(),
                    shippingAddress,
                    paymentMethod,
                    notes,
                    customerDetails
                })
            });

            const data = await res.json();
            if (data.success) {
                onSuccess();
                onClose();
                // Reset form
                setSelectedProducts([]);
                setCustomerDetails({ name: '', phone: '', email: '' });
                setShippingAddress({ street: '', city: '', state: '', pincode: '' });
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to create order');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="modal-content card" style={{
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '30px',
                position: 'relative',
                backgroundColor: 'white'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                }}>✕</button>

                <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Add Manual Order</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-2" style={{ gap: '30px' }}>
                        {/* Left Column: Customer & Shipping */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ borderBottom: '2px solid var(--color-gold)', paddingBottom: '5px' }}>Customer Information</h3>
                            
                            <div className="grid grid-2">
                                <div>
                                    <label className="label">Name *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={customerDetails.name}
                                        onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Phone *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={customerDetails.phone}
                                        onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Email (Optional)</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={customerDetails.email}
                                    onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})}
                                />
                            </div>

                            <h3 style={{ borderBottom: '2px solid var(--color-gold)', paddingBottom: '5px', marginTop: '10px' }}>Shipping Address</h3>
                            
                            <div>
                                <label className="label">Street Address *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={shippingAddress.street}
                                    onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-2">
                                <div>
                                    <label className="label">City *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={shippingAddress.city}
                                        onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">State *</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={shippingAddress.state}
                                        onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Pincode *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={shippingAddress.pincode}
                                    onChange={e => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Column: Products & Total */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ borderBottom: '2px solid var(--color-gold)', paddingBottom: '5px' }}>Order Items</h3>
                            
                            {/* Product Search */}
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search products..." 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && filteredProducts.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        zIndex: 10,
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        borderRadius: '0 0 8px 8px'
                                    }}>
                                        {filteredProducts.map(p => (
                                            <div 
                                                key={p.id} 
                                                onClick={() => {
                                                    addProductToOrder(p);
                                                    setSearchTerm('');
                                                }}
                                                style={{
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                                className="hover-bg-gray-50"
                                            >
                                                {p.name} - ₹{p.price}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Products List */}
                            <div style={{ 
                                backgroundColor: '#f9f9f9', 
                                padding: '15px', 
                                borderRadius: '8px',
                                minHeight: '150px'
                            }}>
                                {selectedProducts.length === 0 ? (
                                    <p style={{ color: '#999', textAlign: 'center', marginTop: '50px' }}>No items added yet</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {selectedProducts.map(p => (
                                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
                                                        <select 
                                                            value={p.size} 
                                                            onChange={e => updateSize(p.id, e.target.value)}
                                                            className="btn-sm"
                                                            style={{ padding: '2px 5px', fontSize: '0.8rem' }}
                                                        >
                                                            <option value="S">S</option>
                                                            <option value="M">M</option>
                                                            <option value="L">L</option>
                                                            <option value="XL">XL</option>
                                                            <option value="XXL">XXL</option>
                                                        </select>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <button type="button" onClick={() => updateQuantity(p.id, -1)} className="btn-sm">-</button>
                                                            <span>{p.quantity}</span>
                                                            <button type="button" onClick={() => updateQuantity(p.id, 1)} className="btn-sm">+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div>₹{parseFloat(p.price) * p.quantity}</div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeProductFromOrder(p.id)}
                                                        style={{ color: 'var(--color-error)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Total Amount:</span>
                                            <span style={{ color: 'var(--color-maroon)', fontSize: '1.2rem' }}>₹{calculateTotal()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="label">Payment Method</label>
                                <select 
                                    className="form-control" 
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                >
                                    <option value="whatsapp">WhatsApp Order</option>
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="online">Online Payment</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Admin Notes</label>
                                <textarea 
                                    className="form-control" 
                                    rows={2} 
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder="Any special instructions..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' }}>
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting ? 'Creating...' : 'Create Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
