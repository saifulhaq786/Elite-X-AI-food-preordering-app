'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Search, Check, Cpu, Wifi, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

interface OrderItem {
  name: string;
  qty: number;
}

interface ScannedOrder {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  pickupType: string;
  status: string;
  paymentMode?: string;
}

export default function CounterTerminal() {
  const { deductSmartCardBalance } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'qr' | 'nfc'>('nfc');
  const [orderId, setOrderId] = useState('');
  const [scannedOrder, setScannedOrder] = useState<ScannedOrder | null>(null);
  const [isDelivering, setIsDelivering] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tapSuccessMessage, setTapSuccessMessage] = useState('');

  const mockVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    
    setScannedOrder({
      id: orderId.toUpperCase(),
      customerName: 'Rahul Kumar',
      items: [{ name: 'Chicken Biryani', qty: 2 }, { name: 'Coke', qty: 1 }],
      total: 450,
      pickupType: 'Plate',
      status: 'Ready',
      paymentMode: 'App Pre-Order'
    });
  };

  const handleSimulateNFCTap = async () => {
    const tapAmount = 180;
    const successDeduct = await deductSmartCardBalance(tapAmount);
    
    if (successDeduct) {
      setScannedOrder({
        id: 'TAP-ORD-' + Math.floor(1000 + Math.random() * 9000),
        customerName: 'Alex Mercer (Smart Tap)',
        items: [{ name: 'Masala Dosa', qty: 2 }, { name: 'Filter Coffee', qty: 2 }],
        total: tapAmount,
        pickupType: 'Plate',
        status: 'Paid via Offline Smart Card',
        paymentMode: 'Offline NFC Card Tap'
      });
      setTapSuccessMessage(`NFC Tap Successful! ₹${tapAmount} deducted from Card CHOW-8942-9901`);
    } else {
      alert('Smart Card Tap Failed! Insufficient balance or Card is Frozen.');
    }
  };

  const handleDeliver = () => {
    setIsDelivering(true);
    setTimeout(() => {
      setIsDelivering(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setScannedOrder(null);
        setOrderId('');
        setTapSuccessMessage('');
      }, 2500);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%', fontFamily: 'Inter, sans-serif' }}>
      
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{
              position: 'fixed',
              top: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#16A34A',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100
            }}
          >
            <Check size={24} /> Order Verified & Complete!
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Counter Terminal & NFC Reader</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Verify pre-order QR codes or accept instant offline Smart Card NFC taps at counter.</p>
      </div>

      {/* Terminal Mode Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button
          onClick={() => setActiveTab('nfc')}
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: activeTab === 'nfc' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
            backgroundColor: activeTab === 'nfc' ? 'rgba(252, 128, 25, 0.12)' : 'var(--bg-surface)',
            color: activeTab === 'nfc' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Cpu size={18} />
          Smart Card NFC Reader (Offline)
        </button>

        <button
          onClick={() => setActiveTab('qr')}
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            border: activeTab === 'qr' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
            backgroundColor: activeTab === 'qr' ? 'rgba(252, 128, 25, 0.12)' : 'var(--bg-surface)',
            color: activeTab === 'qr' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <QrCode size={18} />
          Pre-Order QR Scanner
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* Terminal Input Box */}
        {activeTab === 'nfc' ? (
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'rgba(252, 128, 25, 0.12)',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-md)'
            }}>
              <Wifi size={48} color="var(--primary)" style={{ transform: 'rotate(90deg)' }} />
            </div>

            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700 }}>Ready for NFC Smart Tap</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1.5rem', maxWidth: '280px' }}>
              Students tap physical Smart Card against counter terminal. No internet required on student device!
            </p>

            <button
              onClick={handleSimulateNFCTap}
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-colored)'
              }}
            >
              <Cpu size={18} /> Simulate Smart Card Tap (₹180)
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-medium)', borderRadius: '1rem', marginBottom: '1.5rem' }}>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                <QrCode size={70} color="var(--primary)" />
              </motion.div>
            </div>
            
            <form onSubmit={mockVerify} style={{ width: '100%', display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter Pre-order ID (e.g. AP0023)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Search size={18} /> Verify
              </button>
            </form>
          </div>
        )}

        {/* Verification Result Panel */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {scannedOrder ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{scannedOrder.paymentMode || 'Order ID'}</span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--primary)' }}>{scannedOrder.id}</h2>
                </div>
                <span style={{
                  backgroundColor: 'rgba(252, 128, 25, 0.12)',
                  color: 'var(--primary)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={14} /> Verified
                </span>
              </div>

              {tapSuccessMessage && (
                <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.12)', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, marginBottom: '1rem' }}>
                  {tapSuccessMessage}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Customer</span>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{scannedOrder.customerName}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Items</span>
                  <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '1rem', borderRadius: '0.75rem', marginTop: '0.25rem' }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {scannedOrder.items.map((item, idx: number) => (
                        <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                          <span>{item.qty}x {item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pickup Type</span>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{scannedOrder.pickupType}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Amount</span>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.25rem' }}>₹{scannedOrder.total}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDeliver}
                disabled={isDelivering}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: isDelivering ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isDelivering ? 'Updating Order...' : 'Hand Over Order / Complete'}
              </button>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', minHeight: '300px' }}>
              <ShieldCheck size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>No Order or Tap Loaded</p>
              <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>Scan a QR code or simulate an NFC Smart Card tap on the left terminal.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
