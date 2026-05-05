'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
    const { user } = useAuth();

    const handleWhatsAppCheckout = () => {
        const message = cart.map(item => `- ${item.name} (${item.size ? `Size: ${item.size}, ` : ''}x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n');
        const finalMessage = `Hello Women Fashions! I'd like to place an order for:\n\n${message}\n\nTotal: ₹${totalPrice}\n\nPlease let me know the next steps.`;
        window.open(`https://wa.me/919030600126?text=${encodeURIComponent(finalMessage)}`, '_blank');
    };

    const handleRazorpayPayment = async () => {
        try {
            // 1. Create order on backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount: totalPrice })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.message);

            // 2. Open Razorpay Modal
            const options = {
                key: 'rzp_test_SkMgpMoczwzEiN',
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Women Fashion",
                description: "Purchase from Women Fashion Boutique",
                order_id: data.order.id,
                handler: async function (response: any) {
                    // ... existing verify logic ...
                    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        alert('Payment Successful!');
                        clearCart();
                        window.location.href = '/profile';
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                theme: {
                    color: "#800000"
                },
                modal: {
                    ondismiss: function() {
                        console.log('Payment modal closed');
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Could not initiate payment. Please try again or use WhatsApp.');
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{ marginTop: '70px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)' }}>🛒</div>
                <h1 className="section-title">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
                <Link href="/collections" className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '100px', paddingBottom: '50px' }}>
            <div className="container">
                <h1 className="section-title mb-8">Your Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2">
                        {cart.map((item) => (
                            <div key={item.id} className="card mb-4 overflow-hidden" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '15px' }}>
                                <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f5f5f5' }}>
                                    <Image
                                        src={item.image || '/images/placeholder.png'}
                                        alt={item.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>

                                <div style={{ flex: 1, paddingLeft: '20px' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '5px' }}>{item.name}</h3>
                                    {item.size && <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-500)', marginBottom: '5px' }}>Size: {item.size}</p>}
                                    <p style={{ color: 'var(--color-maroon)', fontWeight: 700 }}>₹{item.price}</p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: '5px', padding: '5px 10px' }}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)} className="p-1">-</button>
                                        <span style={{ margin: '0 15px', fontWeight: 600 }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)} className="p-1">+</button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        style={{ color: 'red', fontSize: '1.2rem' }}
                                        title="Remove item"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="card p-6" style={{ background: 'var(--color-beige-dark)', position: 'sticky', top: '100px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Order Summary</h2>

                            <div className="flex justify-between mb-3">
                                <span>Total Items:</span>
                                <b>{totalItems}</b>
                            </div>

                            <div className="flex justify-between mb-6">
                                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Subtotal:</span>
                                <b style={{ fontSize: '1.4rem', color: 'var(--color-maroon)' }}>₹{totalPrice}</b>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleRazorpayPayment}
                                    className="btn btn-primary w-full"
                                    style={{ padding: '15px', fontSize: '1.1rem', background: '#000' }}
                                >
                                    Pay Online (Razorpay)
                                </button>

                                <button
                                    onClick={handleWhatsAppCheckout}
                                    className="btn btn-primary w-full"
                                    style={{ padding: '15px', fontSize: '1.1rem' }}
                                >
                                    Order via WhatsApp
                                </button>

                                <button
                                    onClick={clearCart}
                                    className="btn btn-outline w-full"
                                >
                                    Clear Cart
                                </button>

                                <Link href="/collections" className="text-center mt-2 text-sm underline">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
