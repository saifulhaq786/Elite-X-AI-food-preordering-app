'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight, Package, Clock } from 'lucide-react';
import { useOrderStore } from '@/store/order-store';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const defaultMockOrders = [
    { id: 'ORD8829', vendorName: 'Tasty Times', itemsStr: 'Chicken Biryani x1, Filter Coffee x1', total: 210, status: 'preparing', pickupTime: 'Today, 12:30 PM', active: true },
    { id: 'ORD8712', vendorName: 'Campus Kitchen', itemsStr: 'Classic Chicken Burger x2', total: 240, status: 'ready', pickupTime: 'Today, 11:45 AM', active: true },
    { id: 'ORD8654', vendorName: 'Royal Kitchen', itemsStr: 'Paneer Butter Masala x1, Naan x2', total: 210, status: 'completed', pickupTime: 'Yesterday, 01:15 PM', active: false },
  ];

  const allOrders = orders.length > 0 ? orders.map(o => ({
    id: o.id,
    vendorName: o.vendorName || 'Campus Canteen',
    itemsStr: o.items.map(i => `${i.quantity}x ${i.foodItem ? i.foodItem.name : 'Item'}`).join(', '),
    total: o.total,
    status: o.status,
    pickupTime: o.pickupTime || 'Today, 01:00 PM',
    active: ['placed', 'accepted', 'preparing', 'ready'].includes(o.status)
  })) : defaultMockOrders;

  const filteredOrders = allOrders.filter(order => activeTab === 'active' ? order.active : !order.active);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'var(--primary)';
      case 'preparing': return '#F5A623';
      case 'placed': return 'var(--primary)';
      case 'completed': return '#16A34A';
      case 'cancelled': return '#DC2626';
      default: return 'var(--text-tertiary)';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      paddingBottom: '100px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <header style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
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
        <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>My Pre-Orders</h1>
      </header>

      <div style={{
        display: 'flex',
        padding: '4px',
        margin: '20px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <button 
          onClick={() => setActiveTab('active')}
          style={{
            flex: 1,
            padding: '10px 0',
            backgroundColor: activeTab === 'active' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'active' ? '#FFF' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
        >
          Active Orders
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          style={{
            flex: 1,
            padding: '10px 0',
            backgroundColor: activeTab === 'past' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'past' ? '#FFF' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
        >
          Past Orders
        </button>
      </div>

      <main style={{ padding: '0 20px' }}>
        {filteredOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredOrders.map(order => {
              const statusColor = getStatusColor(order.status);
              return (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => router.push(`/order/${order.id}`)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '18px',
                    padding: '20px',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{order.vendorName}</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>ID: {order.id}</span>
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(252, 128, 25, 0.12)',
                      color: statusColor,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      border: `1px solid ${statusColor}`
                    }}>
                      {order.status}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {order.itemsStr}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="var(--primary)" />
                      <span>{order.pickupTime}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--primary)' }}>₹{order.total}</span>
                      <ChevronRight size={18} color="var(--text-tertiary)" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px 0', fontSize: '16px' }}>No orders in this section</h3>
            <p style={{ fontSize: '13px', margin: 0 }}>Browse canteen menus and pre-order your meals.</p>
          </div>
        )}
      </main>
    </div>
  );
}
