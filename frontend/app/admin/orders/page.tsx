'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import AddOrderModal from './components/AddOrderModal';

interface OrderItem {
    id: number;
    productName: string;
    product_name?: string; // Support both naming conventions
    size: string;
    quantity: number;
    price: string;
}

interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customer?: { name: string; phone: string }; // Handle legacy format
    totalAmount: string;
    total_amount?: string; // Support both naming conventions
    status: string;
    paymentStatus: string;
    payment_status?: string; // Support both naming conventions
    items: OrderItem[];
    createdAt: string;
}

export default function AdminOrders() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const updateStatus = async (orderId: number, newStatus: string, field: 'status' | 'paymentStatus') => {
        setUpdatingId(orderId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ [field]: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(orders.map(o => 
                    o.id === orderId ? { 
                        ...o, 
                        [field]: newStatus,
                        [field === 'status' ? 'status' : 'payment_status']: newStatus 
                    } : o
                ));
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'confirmed': return '#3b82f6';
            case 'processing': return '#8b5cf6';
            case 'completed': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    if (isFetching) return (
        <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
            <div className="loader"></div>
            <p style={{ color: 'var(--color-gray-500)', fontWeight: 500 }}>Loading Orders...</p>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Order Management</h1>
                    <p style={{ color: 'var(--color-gray-500)', marginTop: '5px' }}>Track and manage your boutique orders</p>
                </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <select 
                            className="form-control" 
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            ➕ Add Manual Order
                        </button>
                    </div>
                </div>

                <div className="card shadow-sm overflow-hidden" style={{ border: 'none', borderRadius: '12px' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '20px 15px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>ORDER INFO</th>
                                    <th style={{ padding: '20px 15px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CUSTOMER</th>
                                    <th style={{ padding: '20px 15px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>ITEMS</th>
                                    <th style={{ padding: '20px 15px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>TOTAL</th>
                                    <th style={{ padding: '20px 15px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>STATUS</th>
                                    <th style={{ padding: '20px 15px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>PAYMENT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '50px', textAlign: 'center', color: '#94a3b8' }}>
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="hover-bg-slate-50">
                                            <td style={{ padding: '20px 15px' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--color-maroon)' }}>{order.orderNumber || `#${order.id}`}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 15px' }}>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{order.customerName || order.customer?.name || 'Walk-in'}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{order.customerPhone || order.customer?.phone}</div>
                                            </td>
                                            <td style={{ padding: '20px 15px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} style={{ fontSize: '0.85rem', color: '#475569' }}>
                                                            <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.productName || item.product_name} <span style={{ color: '#94a3b8' }}>({item.size})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 15px' }}>
                                                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>₹{order.totalAmount || order.total_amount}</div>
                                            </td>
                                            <td style={{ padding: '20px 15px' }}>
                                                <div style={{ position: 'relative' }}>
                                                    <select 
                                                        value={order.status} 
                                                        onChange={(e) => updateStatus(order.id, e.target.value, 'status')}
                                                        disabled={updatingId === order.id}
                                                        style={{ 
                                                            padding: '6px 12px', 
                                                            borderRadius: '20px', 
                                                            border: `1px solid ${getStatusColor(order.status)}`,
                                                            backgroundColor: 'white',
                                                            color: getStatusColor(order.status),
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            outline: 'none'
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 15px' }}>
                                                <select 
                                                    value={order.paymentStatus || order.payment_status} 
                                                    onChange={(e) => updateStatus(order.id, e.target.value, 'paymentStatus')}
                                                    disabled={updatingId === order.id}
                                                    style={{ 
                                                        padding: '6px 12px', 
                                                        borderRadius: '20px', 
                                                        border: '1px solid #e2e8f0',
                                                        backgroundColor: (order.paymentStatus === 'paid' || order.payment_status === 'paid') ? '#dcfce7' : '#f1f5f9',
                                                        color: (order.paymentStatus === 'paid' || order.payment_status === 'paid') ? '#166534' : '#475569',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <option value="pending">Unpaid</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                </div>
            </div>

            <AddOrderModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => {
                    fetchOrders();
                    // Optional: show toast notification
                }}
            />
        </div>
    );
}
