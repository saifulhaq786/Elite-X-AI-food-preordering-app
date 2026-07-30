'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Brain,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { getVendorDemandPredictions, type DemandPrediction } from '@/lib/ml-analytics';

export default function VendorDashboard() {
  const demandPredictions: DemandPrediction[] = getVendorDemandPredictions();

  const stats = [
    { label: "Today's Orders", value: "124", trend: "+18%", icon: Package, color: 'var(--primary)' },
    { label: "Today's Revenue", value: "₹14,850", trend: "+22%", icon: TrendingUp, color: 'var(--primary)' },
    { label: "Active Orders", value: "12", trend: "Live", icon: Clock, color: 'var(--primary)' },
    { label: "Items Available", value: "14/15", trend: "98%", icon: CheckCircle, color: 'var(--primary)' },
  ];

  const recentOrders = [
    { id: '002481', items: '1x Hyderabadi Biryani, 1x Podi Dosa', time: '12:35 PM', status: 'Preparing', total: '₹275' },
    { id: '002480', items: '2x Crunchy Chicken Burger, 1x Fries', time: '12:30 PM', status: 'Accepted', total: '₹335' },
    { id: '002478', items: '1x Shahi Paneer Thali', time: '12:15 PM', status: 'Ready', total: '₹165' },
    { id: '002475', items: '3x Kulhad Masala Chai, 2x Samosa', time: '12:10 PM', status: 'Completed', total: '₹90' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Inter, sans-serif' }}
    >
      <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Welcome, Tasty Times! 👋</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>Canteen Kitchen Command Center & ML Analytics</p>
        </div>
        <Link href="/vendor/orders" style={{ textDecoration: 'none' }}>
          <button style={{
            backgroundColor: 'var(--primary)',
            color: '#FFF',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-colored)'
          }}>
            Manage Live Orders →
          </button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants} 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '1.5rem' 
        }}
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.25rem 0', color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 'bold' }}>{stat.trend}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.1)', padding: '12px', borderRadius: '14px' }}>
                <Icon size={24} color="var(--primary)" />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ML FOOD DEMAND PREDICTION SECTION */}
      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Brain size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>ML Food Demand Forecasting</h2>
          <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: 'rgba(252, 128, 25, 0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '6px' }}>
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} /> AI Kitchen Prep Assistant
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {demandPredictions.map((pred) => (
            <div 
              key={pred.foodId}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                border: pred.recommendation.includes('Deficit') ? '1.5px solid #F5A623' : '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{pred.foodName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Peak Surge: <strong>{pred.peakHour}</strong></div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: 'var(--bg-elevated)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px' }}>
                  {pred.confidenceScore}% AI Confidence
                </span>
              </div>

              {/* Progress gauge */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  <span>Current Prepared: {pred.currentStock}</span>
                  <span>Predicted Demand: {pred.predictedDemand}</span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${Math.min(100, (pred.currentStock / pred.predictedDemand) * 100)}%`,
                      backgroundColor: pred.currentStock < pred.predictedDemand ? '#F5A623' : '#16A34A',
                      borderRadius: '4px'
                    }} 
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600', backgroundColor: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: '10px' }}>
                {pred.recommendation}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Live Orders Preview */}
      <motion.div variants={itemVariants} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Recent Live Orders</h2>
          <Link href="/vendor/orders" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All Orders <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentOrders.map((order) => (
            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Token #{order.id}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.items}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.total}</div>
                <div style={{ fontSize: '0.8rem', color: '#F5A623', fontWeight: 'bold' }}>{order.status}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
