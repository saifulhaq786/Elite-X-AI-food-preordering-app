'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, MapPin, Clock, ArrowLeft } from 'lucide-react';
import QRCode from 'qrcode';
import { useOrderStore } from '@/store/order-store';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { getOrderById } = useOrderStore();
  const [qrUrl, setQrUrl] = useState<string>('');
  
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.id;
  const order = getOrderById(orderId);

  useEffect(() => {
    if (order) {
      const qrData = {
        orderId: order.id,
        items: order.items.map(i => `${i.quantity}x ${i.foodItem ? i.foodItem.name : 'Item'}`).join(', '),
        total: order.total,
        pickupTime: order.pickupTime
      };
      
      QRCode.toDataURL(JSON.stringify(qrData), {
        color: { dark: '#0F172A', light: '#FFFFFF' },
        margin: 2
      }).then(url => setQrUrl(url));
    }
  }, [order]);

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', padding: '20px', paddingBottom: '100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <motion.div 
          initial={{ scale: 0, rotate: -180 }} 
          animate={{ scale: 1, rotate: 0 }} 
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', boxShadow: 'var(--shadow-colored)' }}
        >
          <Check size={32} color="#FFF" />
        </motion.div>
        
        {/* Simple floating emojis for confetti effect */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: -50, opacity: 0 }} transition={{ duration: 2, repeat: Infinity }} style={{ position: 'absolute', fontSize: '24px', left: '20%' }}>🎉</motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: -80, opacity: 0 }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} style={{ position: 'absolute', fontSize: '24px', right: '30%' }}>✨</motion.div>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, textAlign: 'center', color: 'var(--text-primary)' }}>Order Placed Successfully!</h1>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '2px' }}>{order.id}</div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)' }}>Preparing your food...</span>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
        {qrUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={qrUrl} alt="Order QR Code" style={{ width: '180px', height: '180px', marginBottom: '16px' }} />
        ) : (
          <div style={{ width: '180px', height: '180px', backgroundColor: 'var(--bg-elevated)', marginBottom: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Generating QR...</span>
          </div>
        )}
        <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px', margin: 0 }}>Show this QR at the counter</p>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', marginBottom: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', color: 'var(--text-primary)' }}>Order Details</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {order.items.map((item, idx) => (
            <div key={item.foodItem ? item.foodItem.id : idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-primary)' }}>{item.quantity}x {item.foodItem ? item.foodItem.name : 'Item'}</span>
              <span style={{ color: 'var(--text-secondary)' }}>₹{((item.foodItem ? item.foodItem.price : 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div style={{ borderTop: '1px dashed var(--border-medium)', margin: '8px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
            <span>Total Amount</span>
            <span style={{ color: 'var(--primary)' }}>₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '20px', backgroundColor: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> Type</span>
            <span style={{ fontWeight: '600', fontSize: '14px', textTransform: 'capitalize', color: 'var(--text-primary)' }}>{order.type || order.pickupType}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--border-medium)' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Pickup Time</span>
            <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{order.pickupTime}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={() => router.push(`/order/${order.id}`)} style={{ width: '100%', backgroundColor: 'var(--primary)', color: '#FFF', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: 'var(--shadow-colored)' }}>
          Track Order
        </button>
        <button onClick={() => router.push('/')} style={{ width: '100%', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
