'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { useOrderStore } from '@/store/order-store';
import { useCartStore } from '@/store/cart-store';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, items } = useCartStore();
  const { placeOrder } = useOrderStore();

  const [status, setStatus] = useState<'processing' | 'success' | 'failure'>('processing');
  const [orderId, setOrderId] = useState('');
  const [txnCode, setTxnCode] = useState('');

  const total = searchParams?.get('total') || '0';
  const method = searchParams?.get('method') || 'upi';
  const type = (searchParams?.get('type') || 'plate') as 'plate' | 'parcel';
  const time = searchParams?.get('time') || '12:00 PM - 12:20 PM';

  useEffect(() => {
    let mounted = true;

    const processPayment = async () => {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      if (!mounted) return;

      try {
        const randomTxn = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
        setTxnCode(randomTxn);

        // Create order via API
        const newOrder = await placeOrder(
          items,
          items[0]?.vendorId || 'tasty-times',
          'Campus Canteen',
          type,
          time,
          Number(total),
          3,
          type === 'parcel' ? 8 : 0,
          method,
          randomTxn,
        );

        if (mounted) {
          setOrderId(newOrder.id);
          clearCart();
          setStatus('success');
        }
      } catch (err) {
        console.error('Payment/order error:', err);
        if (mounted) {
          setStatus('failure');
        }
      }
    };

    processPayment();

    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>

      {status === 'processing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <Loader2 size={64} color="var(--primary)" />
          </motion.div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Processing Payment...</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Please do not close this window</div>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', backgroundColor: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-colored)' }}>
            <Check size={40} color="#FFF" />
          </motion.div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Payment Successful!</h2>

          <div style={{ width: '100%', padding: '20px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: '16px', margin: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              <span>Amount Paid</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>₹{Number(total).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)' }}>
              <span>Method</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '700', textTransform: 'uppercase' }}>{method}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Transaction ID</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{txnCode}</span>
            </div>
          </div>

          <button onClick={() => router.push(`/order/${orderId}`)} style={{ width: '100%', backgroundColor: 'var(--primary)', color: '#FFF', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', marginTop: '10px', boxShadow: 'var(--shadow-colored)' }}>
            View Order
          </button>
        </motion.div>
      )}

      {status === 'failure' && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', backgroundColor: 'var(--bg-surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={40} color="#FFF" />
          </motion.div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Payment Failed</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Something went wrong with your transaction. Please try again.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '20px' }}>
            <button onClick={() => router.push('/checkout')} style={{ width: '100%', backgroundColor: 'var(--primary)', color: '#FFF', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', boxShadow: 'var(--shadow-colored)' }}>
              Try Again
            </button>
            <button onClick={() => router.push('/cart')} style={{ width: '100%', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Back to Cart
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-primary)' }}>Loading payment...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
