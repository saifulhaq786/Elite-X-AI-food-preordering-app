'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ClipboardList, Cpu, Wallet, User, Bell, CheckCircle2, ChefHat, Sparkles } from 'lucide-react';
import { fetchOrders, type OrderData } from '@/lib/api-client';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [notification, setNotification] = useState<{
    id: string;
    title: string;
    message: string;
    orderId: string;
    type: 'ready' | 'preparing' | 'accepted';
  } | null>(null);

  const [previousStatuses, setPreviousStatuses] = useState<Record<string, string>>({});

  // Poll orders API every 3 seconds to trigger student notifications when vendor updates order status
  useEffect(() => {
    let isMounted = true;

    const checkOrderNotifications = async () => {
      try {
        const orders: OrderData[] = await fetchOrders();
        if (!isMounted || !orders) return;

        orders.forEach((order) => {
          const prevStatus = previousStatuses[order.id];
          if (prevStatus && prevStatus !== order.status) {
            if (order.status === 'ready') {
              setNotification({
                id: Date.now().toString(),
                title: `🎉 Order #${order.orderNumber} is READY!`,
                message: `${order.vendorName} has completed your food. Head to the counter with your QR Code to collect!`,
                orderId: order.id,
                type: 'ready',
              });
            } else if (order.status === 'preparing') {
              setNotification({
                id: Date.now().toString(),
                title: `👨‍🍳 Order #${order.orderNumber} is Preparing!`,
                message: `${order.vendorName} is now cooking your fresh meal.`,
                orderId: order.id,
                type: 'preparing',
              });
            } else if (order.status === 'accepted') {
              setNotification({
                id: Date.now().toString(),
                title: `✅ Order #${order.orderNumber} Accepted!`,
                message: `${order.vendorName} has accepted your pre-order.`,
                orderId: order.id,
                type: 'accepted',
              });
            }
          }
        });

        // Cache status map
        const statusMap: Record<string, string> = {};
        orders.forEach((o) => {
          statusMap[o.id] = o.status;
        });
        setPreviousStatuses(statusMap);
      } catch (err) {
        console.error('Failed to poll student order notifications:', err);
      }
    };

    checkOrderNotifications();
    const interval = setInterval(checkOrderNotifications, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [previousStatuses]);

  const tabs = [
    { name: 'Home', path: '/home', icon: <Home size={22} /> },
    { name: 'Orders', path: '/orders', icon: <ClipboardList size={22} /> },
    { name: 'Smart Card', path: '/smart-card', icon: <Cpu size={22} /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet size={22} /> },
    { name: 'Profile', path: '/profile', icon: <User size={22} /> },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--bg-main)',
      minHeight: '100vh',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Live Order Status Change Banner Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '16px',
              left: '16px',
              right: '16px',
              zIndex: 999,
              maxWidth: '480px',
              margin: '0 auto',
              backgroundColor: notification.type === 'ready' ? '#16A34A' : notification.type === 'preparing' ? '#FC8019' : '#3B82F6',
              color: '#FFF',
              padding: '16px 20px',
              borderRadius: '20px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '14px', display: 'flex' }}>
                {notification.type === 'ready' ? <CheckCircle2 size={24} /> : notification.type === 'preparing' ? <ChefHat size={24} /> : <Sparkles size={24} />}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '900', marginBottom: '2px' }}>{notification.title}</div>
                <div style={{ fontSize: '12px', opacity: 0.95, lineHeight: '1.4' }}>{notification.message}</div>
              </div>
            </div>

            <Link href={`/order/${notification.orderId}`} style={{ textDecoration: 'none' }}>
              <button
                onClick={() => setNotification(null)}
                style={{
                  backgroundColor: '#FFF',
                  color: notification.type === 'ready' ? '#16A34A' : 'var(--primary)',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                View QR →
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ flex: 1, paddingBottom: '80px', overflowY: 'auto' }}>
        {children}
      </div>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '75px',
        background: 'var(--bg-surface-glass-heavy)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 0.5rem',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path === '/home' && pathname === '/');
          return (
            <Link key={tab.name} href={tab.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
                transition: 'color 0.2s ease',
                position: 'relative',
                padding: '0.4rem 0.6rem'
              }}>
                {tab.icon}
                <span style={{ fontSize: '11px', fontWeight: isActive ? '700' : '500' }}>
                  {tab.name}
                </span>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    width: '20px',
                    height: '2.5px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '2px'
                  }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
