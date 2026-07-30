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
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const sessionUser = session?.user as Record<string, unknown> | undefined;
  const defaultVendorId = (sessionUser?.vendorSlug as string) || 'campus-kitchen';

  const [selectedStall, setSelectedStall] = useState<string>(defaultVendorId);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Order updated!');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (defaultVendorId) {
      setSelectedStall(defaultVendorId);
    }
  }, [defaultVendorId]);

  // Poll orders API for selected vendor stall
  useEffect(() => {
    let isMounted = true;
    const loadOrders = async () => {
      try {
        const realtimeOrders = await fetchOrders(selectedStall);
        if (isMounted && realtimeOrders) {
          if (realtimeOrders.length > 0) {
            setOrders(realtimeOrders);
          } else if (orders.length === 0) {
            setOrders(mockOrdersFallback);
          }
        }
      } catch (err) {
        console.error('Failed to fetch vendor orders:', err);
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedStall, orders.length]);

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

      {/* Canteen Stall Selector Bar */}
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '16px', padding: '12px 16px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
          Select Canteen Stall Terminal:
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'campus-kitchen', label: '🏪 Campus Kitchen' },
            { id: 'tasty-times', label: '🍛 Tasty Times' },
            { id: 'royal-kitchen', label: '👑 Royal Kitchen' },
            { id: 'all', label: '🌐 All Campus Stalls' },
          ].map((stall) => (
            <button
              key={stall.id}
              onClick={() => setSelectedStall(stall.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: selectedStall === stall.id ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                backgroundColor: selectedStall === stall.id ? 'var(--primary)' : 'var(--bg-elevated)',
                color: selectedStall === stall.id ? '#FFF' : 'var(--text-primary)',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {stall.label}
            </button>
          ))}
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

                {/* Sequential Status Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {order.status === 'placed' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'accepted')}
                        style={{ flex: 2, backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', boxShadow: 'var(--shadow-colored)' }}
                      >
                        Accept Order
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        style={{ flex: 1, backgroundColor: 'transparent', color: '#DC2626', border: '1px solid #DC2626', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {order.status === 'accepted' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                        style={{ flex: 2, backgroundColor: '#F5A623', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                      >
                        Mark Preparing
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        style={{ flex: 1, backgroundColor: 'transparent', color: '#DC2626', border: '1px solid #DC2626', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {order.status === 'preparing' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                        style={{ flex: 2, backgroundColor: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', boxShadow: 'var(--shadow-colored)' }}
                      >
                        Ready for Pickup
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        style={{ flex: 1, backgroundColor: 'transparent', color: '#DC2626', border: '1px solid #DC2626', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      style={{ flex: 1, backgroundColor: '#16A34A', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.625rem', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                    >
                      Mark Delivered & Complete
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <div style={{ flex: 1, textAlign: 'center', color: '#16A34A', fontWeight: '800', fontSize: '0.875rem', padding: '0.5rem', backgroundColor: 'rgba(22, 163, 74, 0.1)', borderRadius: '0.5rem' }}>
                      ✓ Order Delivered & Completed
                    </div>
                  )}

                  {order.status === 'cancelled' && (
                    <div style={{ flex: 1, textAlign: 'center', color: '#DC2626', fontWeight: '800', fontSize: '0.875rem', padding: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '0.5rem' }}>
                      ✕ Order Cancelled
                    </div>
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
