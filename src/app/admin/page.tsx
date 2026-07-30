'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Users, Store, BarChart3, Clock, XCircle, CreditCard, Cpu
} from 'lucide-react';

const STATS = [
  { title: 'Total Orders', value: '1,247', change: '+12%', isPositive: true, icon: BarChart3 },
  { title: 'Total Revenue', value: '₹2,34,500', change: '+8%', isPositive: true, icon: CreditCard },
  { title: 'Active Users', value: '856', change: '+5%', isPositive: true, icon: Users },
  { title: 'Active Vendors', value: '3', change: '0%', isPositive: true, icon: Store },
  { title: 'Smart Tap Cards', value: '842', change: '+15%', isPositive: true, icon: Cpu },
  { title: 'Cancellation Rate', value: '3.2%', change: '-1.1%', isPositive: true, icon: XCircle },
];

const RECENT_ORDERS = [
  { id: '#ORD-001', student: 'Rahul Sharma', vendor: 'Amul Canteen', amount: '₹145', status: 'Completed', time: '10 mins ago' },
  { id: '#ORD-002', student: 'Priya Singh', vendor: 'Nescafe', amount: '₹65', status: 'Preparing', time: '15 mins ago' },
  { id: '#ORD-003', student: 'Amit Kumar', vendor: 'Main Canteen', amount: '₹220', status: 'Pending', time: '22 mins ago' },
  { id: '#ORD-004', student: 'Neha Gupta', vendor: 'Amul Canteen', amount: '₹90', status: 'Completed', time: '1 hour ago' },
  { id: '#ORD-005', student: 'Rohit Verma', vendor: 'Nescafe', amount: '₹150', status: 'Cancelled', time: '2 hours ago' },
];

const TOP_VENDORS = [
  { name: 'Amul Canteen', orders: 456, revenue: '₹98,500', rating: 4.8 },
  { name: 'Main Canteen', orders: 412, revenue: '₹85,200', rating: 4.6 },
  { name: 'Nescafe', orders: 379, revenue: '₹50,800', rating: 4.9 },
];

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Platform Overview</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Welcome back! Here&apos;s what&apos;s happening on ChowMe today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px' 
      }}>
        {STATS.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(252, 128, 25, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <stat.icon size={24} />
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                color: stat.isPositive ? 'var(--primary)' : '#DC2626',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                {stat.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {stat.change}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Recent Orders Table */}
        <div style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderRadius: '16px', 
          padding: '24px', 
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          gridColumn: '1 / -1'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Recent Orders</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Order ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Student</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Vendor</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{order.id}</td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{order.student}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{order.vendor}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{order.amount}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: 'rgba(252, 128, 25, 0.12)',
                        color: 'var(--primary)'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} /> {order.time}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Vendors */}
        <div style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderRadius: '16px', 
          padding: '24px', 
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Top Performing Vendors</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {TOP_VENDORS.map((vendor, idx) => (
              <div key={vendor.name} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: '12px',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'var(--primary)'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{vendor.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{vendor.orders} orders</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{vendor.revenue}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>⭐ {vendor.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Revenue Chart (CSS based) */}
        <div style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderRadius: '16px', 
          padding: '24px', 
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 20px 0', color: 'var(--text-primary)' }}>Revenue (Last 7 Days)</h2>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between',
            gap: '8px',
            paddingTop: '20px'
          }}>
            {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{ 
                  width: '100%', 
                  height: `${height}%`, 
                  backgroundColor: 'var(--primary)', 
                  borderRadius: '6px 6px 0 0',
                  minHeight: '20px'
                }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
