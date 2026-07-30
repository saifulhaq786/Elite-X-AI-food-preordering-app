'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Clock, Package, ChefHat, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import QRCode from 'qrcode';
import { fetchOrderById, type OrderData } from '@/lib/api-client';

const stages = [
  { id: 'placed', label: 'Order Placed', icon: Package },
  { id: 'accepted', label: 'Accepted by Vendor', icon: Check },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'ready', label: 'Ready for Pickup', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export default function OrderTrackingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Generate QR Code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(id || 'ORDER123', {
          color: { dark: '#FC8019', light: '#FFFFFF' },
          width: 200,
        });
        setQrCodeData(url);
      } catch (err) {
        console.error('Failed to generate QR:', err);
      }
    };
    if (id) generateQR();
  }, [id]);

  // Fetch Order via API (with 5-second polling for status updates)
  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(id);
        if (isMounted) {
          setOrder(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadOrder();
    const interval = setInterval(loadOrder, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [id]);

  const statusToStageIndex = (status?: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'completed': case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStageIndex = statusToStageIndex(order?.status);

  const getStatusText = () => {
    if (order?.status === 'cancelled') {
      return '❌ Order was cancelled by vendor or user.';
    }
    switch (currentStageIndex) {
      case 0: return "Your order has been placed. Waiting for vendor to accept.";
      case 1: return "Vendor has accepted your order!";
      case 2: return "Your food is being prepared in the kitchen. Please wait...";
      case 3: return "🎉 Your food is ready! Head to the counter and show your QR code.";
      case 4: return "Order completed. Enjoy your meal!";
      default: return "";
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-primary)', paddingBottom: '120px', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button 
          onClick={() => router.push('/orders')} 
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', boxShadow: 'var(--shadow-sm)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>Order Tracker</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Order #{order?.orderNumber || id?.substring(0, 8)}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Loading real-time order status...
        </div>
      ) : (
        <>
          {/* Real-time Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              backgroundColor: order?.status === 'cancelled' ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-surface)', 
              borderRadius: '20px', 
              padding: '20px', 
              border: order?.status === 'cancelled' ? '1px solid #DC2626' : '1px solid var(--border-medium)', 
              marginBottom: '24px', 
              boxShadow: 'var(--shadow-md)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: order?.status === 'cancelled' ? '#DC2626' : 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }} />
              <div style={{ fontWeight: '800', fontSize: '15px', color: order?.status === 'cancelled' ? '#DC2626' : 'var(--text-primary)' }}>
                {order?.status === 'cancelled' ? 'Order Cancelled' : order?.vendorName || 'Campus Canteen'}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {getStatusText()}
            </div>
          </motion.div>

          {/* QR Code Section for Counter Pickup */}
          {order?.status !== 'cancelled' && (
            <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-medium)', textAlign: 'center', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                SHOW THIS QR CODE AT CANTEEN COUNTER
              </div>

              {qrCodeData && (
                <div style={{ backgroundColor: '#FFF', padding: '16px', borderRadius: '20px', display: 'inline-block', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeData} alt="Order QR Code" style={{ width: '180px', height: '180px', display: 'block' }} />
                </div>
              )}

              <div style={{ marginTop: '12px', fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                Token #{order?.orderNumber || '000000'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Pickup Type: <strong style={{ color: 'var(--primary)' }}>{order?.pickupType?.toUpperCase() || 'PLATE'}</strong>
              </div>
            </div>
          )}

          {/* Live Progress Timeline */}
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Live Timeline</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              {stages.map((stage, index) => {
                const isPassed = index <= currentStageIndex && order?.status !== 'cancelled';
                const isCurrent = index === currentStageIndex && order?.status !== 'cancelled';
                const Icon = stage.icon;

                return (
                  <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isPassed ? 'var(--primary)' : 'var(--bg-elevated)',
                        color: isPassed ? '#FFF' : 'var(--text-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isCurrent ? 'var(--shadow-colored)' : 'none',
                        zIndex: 2,
                        transition: 'all 0.3s'
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: isPassed ? '800' : '600', color: isPassed ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                        {stage.label}
                      </div>
                      {isCurrent && (
                        <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>● Current Status</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          {order?.items && order.items.length > 0 && (
            <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '16px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 12px 0', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ordered Items</h4>
              {order.items.map((i, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <span>{i.quantity}x {i.name}</span>
                  <span style={{ fontWeight: '800' }}>₹{i.price * i.quantity}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '15px', color: 'var(--primary)' }}>
                <span>Total Paid</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
