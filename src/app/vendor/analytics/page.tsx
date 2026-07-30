'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Package, Clock, Award, PieChart, Sparkles } from 'lucide-react';
import { getVendorOverallSalesAnalytics } from '@/lib/ml-analytics';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('This Week');
  const ranges = ['Today', 'This Week', 'This Month', 'Custom'];
  
  const analytics = getVendorOverallSalesAnalytics();
  const maxRevenue = Math.max(...analytics.revenueByDay.map(d => d.revenue));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Overall Sales Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Real-time revenue, peak hour demand & product performance reports</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          {ranges.map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: timeRange === range ? 'var(--primary)' : 'transparent',
                color: timeRange === range ? '#FFF' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* High-Level Key Performance Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Revenue</span>
            <DollarSign size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)', margin: '0.5rem 0' }}>₹{analytics.todayRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 'bold' }}>+{analytics.revenueGrowthPct}% vs last week</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Completed Orders</span>
            <Package size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{analytics.todayOrders}</div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 'bold' }}>{analytics.fulfillmentRate}% Order Fulfillment</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Avg. Order Value</span>
            <TrendingUp size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0.5rem 0' }}>₹{analytics.avgOrderValue.toFixed(1)}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Per student transaction</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '1.25rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Peak Order Hour</span>
            <Clock size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{analytics.peakOrderHour}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>🔥 Maximum Rush Hour</div>
        </div>
      </div>

      {/* Revenue Trend Chart & Category Sales Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Weekly Revenue Bar Chart */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Daily Revenue Trend</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last 7 Days</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '180px', paddingTop: '1rem' }}>
            {analytics.revenueByDay.map((d, i) => {
              const heightPct = (d.revenue / maxRevenue) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>₹{(d.revenue / 1000).toFixed(1)}k</div>
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      backgroundColor: d.revenue === maxRevenue ? 'var(--primary)' : 'var(--bg-elevated)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s ease',
                      borderTop: '2px solid var(--primary)'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '600' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Sales Breakdown */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <PieChart size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Sales Share by Category</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {analytics.salesByCategory.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                  <span>{cat.category}</span>
                  <span style={{ color: 'var(--primary)' }}>₹{cat.revenue} ({cat.percentage}%)</span>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.percentage}%`, backgroundColor: 'var(--primary)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products Performance Table */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Award size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Top-Selling Canteen Dishes</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {analytics.topSellingDishes.map((dish, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--bg-elevated)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary)', width: '24px' }}>#{idx + 1}</span>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{dish.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{dish.salesCount} orders this week</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '1rem' }}>₹{dish.revenue.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 'bold' }}>High Margin</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
