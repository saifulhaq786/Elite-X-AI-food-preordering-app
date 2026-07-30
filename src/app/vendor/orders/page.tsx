'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Check, 
  ChevronDown, 
  QrCode,
  Bell
} from 'lucide-react';
import { fetchOrders, updateOrderStatus, type OrderData } from '@/lib/api-client';

type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';

const mockOrdersFallback: OrderData[] = [
  {
    id: 'ord_demo_1',
    orderNumber: '002481',
    userId: 'u_101',
    vendorId: 'tasty-times',
    vendorName: 'Tasty Times',
    items: [
      { itemId: 'tt-001', name: 'Hyderabadi Chicken Biryani', price: 180, quantity: 1, image: '', isVeg: false },
      { itemId: 'tt-004', name: 'Ghee Podi Masala Dosa', price: 95, quantity: 1, image: '', isVeg: true }
    ],
    status: 'placed',
    pickupType: 'parcel',
    pickupTime: '12:35 PM',
    paymentMethod: 'smart_card',
    total: 275,
    platformFee: 3,
    parcelCharge: 8,
    qrCode: 'qr_demo_1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>(mockOrdersFallback);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Order updated!');
  const [searchQuery, setSearchQuery] = useState('');

  // Default vendor ID for demo/logged-in vendor
  const vendorId = 'tasty-times';

  // Poll orders API for this vendor
  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      try {
        const realtimeOrders = await fetchOrders(vendorId);
        if (isMounted && realtimeOrders && realtimeOrders.length > 0) {
          setOrders(realtimeOrders);
        }
      } catch (err) {
        console.error('Failed to fetch vendor orders:', err);
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [vendorId]);

  const filters = ['All', 'placed', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    // Optimistic local UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    triggerToast(`Order status set to: ${nextStatus.toUpperCase()}`);

    try {
      await updateOrderStatus(orderId, nextStatus);
    } catch (err) {
      console.error('Failed to update order status in API:', err);
    }
  };

  const filteredOrders = orders
    .filter(o => activeFilter === 'All' ? true : o.status === activeFilter)
    .filter(o => searchQuery ? (o.orderNumber.includes(searchQuery) || o.id.includes(searchQuery)) : true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'var(--primary)';
      case 'accepted': case 'preparing': return '#F5A623';
      case 'ready': return 'var(--primary)';
      case 'completed': return '#16A34A';
      case 'cancelled': return '#DC2626';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: '#16A34A',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 'bold',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100
            }}
          >
            <Check size={24} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Order Management</h1>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Real-time live incoming orders for canteen</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search Token / Order ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', marginLeft: '0.5rem' }} 
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: activeFilter === filter ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
              backgroundColor: activeFilter === filter ? 'var(--primary)' : 'var(--bg-surface)',
              color: activeFilter === filter ? 'white' : 'var(--text-secondary)',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '1rem', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}>
            No orders found matching filter <strong>{activeFilter}</strong>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '1rem',
                border: '1px solid var(--border-medium)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Token #{order.orderNumber}</span>
                      <span 
                        style={{ 
                          backgroundColor: `${getStatusColor(order.status)}20`, 
                          color: getStatusColor(order.status),
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}
                      >
                        {order.status}
                      </span>
                      <span style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid var(--border-medium)' }}>
                        {order.pickupType?.toUpperCase() || 'PLATE'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', gap: '1rem' }}>
                      <span>Pickup Time: <strong>{order.pickupTime || 'Immediate'}</strong></span>
                      <span>Payment: <strong>{order.paymentMethod?.toUpperCase() || 'SMART_CARD'}</strong></span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{order.total}</div>
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Status Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                  {order.status === 'placed' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'accepted')}
                      style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                    >
                      Accept Order
                    </button>
                  )}

                  {(order.status === 'placed' || order.status === 'accepted') && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'preparing')}
                      style={{ flex: 1, backgroundColor: '#F5A623', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                    >
                      Mark Preparing
                    </button>
                  )}

                  {(order.status === 'preparing' || order.status === 'accepted') && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ready')}
                      style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-colored)' }}
                    >
                      Mark Ready for Pickup
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      style={{ flex: 1, backgroundColor: '#16A34A', color: 'white', border: 'none', padding: '0.65rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                    >
                      Complete & Handover
                    </button>
                  )}

                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                      style={{ backgroundColor: 'transparent', color: '#DC2626', border: '1px solid #DC2626', padding: '0.65rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
