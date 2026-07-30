'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ChefHat, Gift, Crown, ArrowDownLeft, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = [
    { id: '1', title: 'Your order is being prepared!', desc: 'Order AP0024 is now in the kitchen.', time: '2 min ago', icon: ChefHat, color: 'var(--primary)', read: false },
    { id: '2', title: 'Order AP0023 is ready for pickup!', desc: 'Head to the counter and show your QR code.', time: '15 min ago', icon: CheckCircle2, color: '#16A34A', read: true },
    { id: '3', title: 'Welcome Gift!', desc: 'Get a FREE juice on your first order above ₹149.', time: '1 hour ago', icon: Gift, color: 'var(--primary)', read: true },
    { id: '4', title: 'Try ChowMe Premium', desc: 'Subscribe to ChowMe Premium for ₹29/month to unlock COD.', time: '2 hours ago', icon: Crown, color: 'var(--primary)', read: true },
    { id: '5', title: 'Refund Processed', desc: 'Refund of ₹180 has been credited to your wallet.', time: '1 day ago', icon: ArrowDownLeft, color: 'var(--primary)', read: true },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-primary)',
            display: 'flex',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer'
          }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: 'var(--text-primary)' }}>Notifications</h1>
        </div>
        
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer'
        }}>
          <CheckCheck size={16} /> Mark all read
        </button>
      </header>

      <main style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((notif, index) => {
            const Icon = notif.icon;
            return (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  backgroundColor: notif.read ? 'var(--bg-surface)' : 'var(--bg-elevated)',
                  border: notif.read ? '1px solid var(--border-light)' : '1px solid var(--border-medium)',
                  padding: '16px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {!notif.read && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: 'var(--primary)' }} />
                )}
                
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(252, 128, 25, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={20} color={notif.color} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: notif.read ? '500' : '700', color: 'var(--text-primary)' }}>{notif.title}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginLeft: '8px' }}>{notif.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{notif.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
