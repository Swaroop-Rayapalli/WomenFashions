import Link from 'next/link';

export default function CartPage() {
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
