'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Download, Building2, Users, Store, Award, Clock, DollarSign, Package } from 'lucide-react';
import { CAMPUS_COLLEGES_ANALYTICS, getCollegeAnalytics, type CollegeAnalytics } from '@/lib/ml-analytics';

function AdminAnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCollegeId = searchParams?.get('college') || 'all';

  const [selectedCollegeId, setSelectedCollegeId] = useState(initialCollegeId);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [collegeData, setCollegeData] = useState<CollegeAnalytics>(() => getCollegeAnalytics(initialCollegeId));

  useEffect(() => {
    setCollegeData(getCollegeAnalytics(selectedCollegeId));
  }, [selectedCollegeId]);

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCollegeId(val);
    router.push(`/admin/analytics?college=${val}`);
  };

  const maxRevenue = Math.max(...collegeData.monthlyRevenue.map(m => m.revenue));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header with College Filter Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={24} color="var(--primary)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>College Analytics & Insights</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.875rem' }}>
            Filtered performance report for <strong>{collegeData.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* SELECT COLLEGE DROPDOWN */}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
            backgroundColor: 'var(--bg-surface)', border: '2px solid var(--primary)', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' 
          }}>
            <Building2 size={18} color="var(--primary)" />
            <select 
              value={selectedCollegeId} 
              onChange={handleCollegeChange}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}
            >
              <option value="all">🏢 All Partnered Colleges</option>
              {CAMPUS_COLLEGES_ANALYTICS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' 
          }}>
            <Calendar size={18} color="var(--text-secondary)" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            backgroundColor: 'var(--primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 800, boxShadow: 'var(--shadow-colored)', cursor: 'pointer'
          }}>
            <Download size={18} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* High-Level Key College Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Campus Revenue</span>
            <DollarSign size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)', margin: '8px 0' }}>
            ₹{collegeData.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 'bold' }}>+{collegeData.growthPct}% vs previous period</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Pre-Orders Placed</span>
            <Package size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0' }}>
            {collegeData.totalOrders.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg. ₹{collegeData.avgOrderValue.toFixed(1)} / order</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Enrolled Active Students</span>
            <Users size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0' }}>
            {collegeData.activeStudents.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 'bold' }}>Active Smart Cards</div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Canteen Stalls</span>
            <Store size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '8px 0' }}>
            {collegeData.vendorStallsCount} Vendors
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>🔥 Rush: {collegeData.peakWindow}</div>
        </div>
      </div>

      {/* College Revenue Trend Chart & Top Campus Food Items */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Monthly Revenue Chart for Selected College */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Monthly Revenue Growth</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{collegeData.name}</p>
            </div>
            <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
              <TrendingUp size={16} /> +{collegeData.growthPct}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', paddingTop: '10px' }}>
            {collegeData.monthlyRevenue.map((m, i) => {
              const heightPct = (m.revenue / maxRevenue) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '4px' }}>
                    ₹{(m.revenue / 1000).toFixed(0)}k
                  </div>
                  <div 
                    style={{ 
                      width: '100%', 
                      height: `${heightPct}%`, 
                      backgroundColor: m.revenue === maxRevenue ? 'var(--primary)' : 'rgba(252, 128, 25, 0.4)', 
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.3s ease'
                    }} 
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600 }}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Bestselling Dishes at this College */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Award size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Top Bestselling Dishes at Campus</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {collegeData.topDishes.map((dish, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-elevated)',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--primary)', width: '20px' }}>#{idx + 1}</span>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{dish.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{dish.salesCount} student orders</div>
                  </div>
                </div>
                <div style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '0.95rem' }}>
                  ₹{dish.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: 'var(--text-primary)', textAlign: 'center' }}>Loading College Analytics...</div>}>
      <AdminAnalyticsContent />
    </Suspense>
  );
}
