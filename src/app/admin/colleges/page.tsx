'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, MapPin, Building2, Users, Store, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { CAMPUS_COLLEGES_ANALYTICS } from '@/lib/ml-analytics';

export default function CollegesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeLocation, setNewCollegeLocation] = useState('');
  const [colleges, setColleges] = useState(CAMPUS_COLLEGES_ANALYTICS);

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName || !newCollegeLocation) return;
    const newCol = {
      id: 'col-' + Date.now(),
      name: newCollegeName,
      location: newCollegeLocation,
      totalRevenue: 0,
      totalOrders: 0,
      activeStudents: 120,
      vendorStallsCount: 1,
      growthPct: 10,
      peakWindow: '12:00 PM - 1:00 PM',
      avgOrderValue: 100,
      topDishes: [],
      monthlyRevenue: [{ month: 'Jul', revenue: 0 }]
    };
    setColleges([...colleges, newCol]);
    setNewCollegeName('');
    setNewCollegeLocation('');
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>College Management & Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Manage partner institutions and view campus performance</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-colored)',
          }}
        >
          <Plus size={20} />
          Add New Partner College
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search colleges by name or city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              padding: '12px 12px 12px 42px',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Colleges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredColleges.map((college) => (
          <motion.div
            key={college.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', 
                  backgroundColor: 'rgba(252, 128, 25, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' 
                }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{college.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    <MapPin size={14} color="var(--primary)" /> {college.location}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Vendors</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{college.vendorStallsCount} Stalls</div>
                </div>
                <div style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Students</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{college.activeStudents}</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.08)', border: '1px solid rgba(252, 128, 25, 0.2)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>
                💰 Revenue: ₹{college.totalRevenue.toLocaleString()} ({college.totalOrders} Orders)
              </div>
            </div>
            
            {/* Card Action Footer */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-elevated)' }}>
              <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: '800' }}>● Active Partner</span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href={`/admin/analytics?college=${college.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: 'var(--shadow-colored)'
                  }}>
                    <BarChart3 size={14} /> View Analytics
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add College Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '16px', maxWidth: '450px', width: '100%', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Add Partner Institution</h2>
              <form onSubmit={handleAddCollege} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>College / University Name</label>
                  <input
                    type="text"
                    value={newCollegeName}
                    onChange={(e) => setNewCollegeName(e.target.value)}
                    placeholder="e.g. Indian Institute of Technology Bombay"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', marginTop: '4px', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Location / Campus City</label>
                  <input
                    type="text"
                    value={newCollegeLocation}
                    onChange={(e) => setNewCollegeLocation(e.target.value)}
                    placeholder="e.g. Powai, Mumbai"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-medium)', marginTop: '4px', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 18px', border: '1px solid var(--border-medium)', background: 'none', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 700 }}>
                    Cancel
                  </button>
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                    Save Partner College
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
