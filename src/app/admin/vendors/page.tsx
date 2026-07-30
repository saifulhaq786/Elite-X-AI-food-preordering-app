'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Star, X, Check, Store } from 'lucide-react';
import { fetchVendors, createVendor, type VendorData } from '@/lib/api-client';
import { vendors as mockVendors } from '@/data/vendors';

export default function VendorsPage() {
  const [vendorsList, setVendorsList] = useState<VendorData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Vendor Form State
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorTagline, setNewVendorTagline] = useState('');
  const [newVendorCuisine, setNewVendorCuisine] = useState('Multi-Cuisine');
  const [newVendorCollege, setNewVendorCollege] = useState('Elite Tech Campus');
  const [newVendorAddress, setNewVendorAddress] = useState('Stall #7, Food Court');
  const [newVendorPhone, setNewVendorPhone] = useState('+91 98765 43219');
  const [newVendorOwnerEmail, setNewVendorOwnerEmail] = useState('');
  const [newVendorPassword, setNewVendorPassword] = useState('vendor123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch vendors from API
  const loadVendors = async () => {
    try {
      setIsLoading(true);
      const data = await fetchVendors();
      if (data && data.length > 0) {
        setVendorsList(data);
      } else {
        setVendorsList(mockVendors as unknown as VendorData[]);
      }
    } catch (err) {
      console.error('Failed to load vendors:', err);
      setVendorsList(mockVendors as unknown as VendorData[]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    setIsSubmitting(true);
    const vendorId = newVendorName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    try {
      await createVendor({
        slug: vendorId,
        name: newVendorName.trim(),
        tagline: newVendorTagline.trim() || 'Fresh Canteen Food & Beverages',
        logo: '🏪',
        coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
        rating: 4.8,
        reviewCount: 1,
        cuisineType: newVendorCuisine,
        cuisine: [newVendorCuisine],
        college: newVendorCollege,
        openingTime: '08:00',
        closingTime: '21:00',
        isOpen: true,
        isAcceptingOrders: true,
        deliveryTypes: ['plate', 'parcel'],
        categories: ['Main Course', 'Snacks', 'Beverages'],
        address: newVendorAddress,
        phone: newVendorPhone,
        vendorEmail: newVendorOwnerEmail.trim() || `vendor.${vendorId}@elitex.edu`,
        vendorPassword: newVendorPassword || 'vendor123',
      } as Parameters<typeof createVendor>[0] & { vendorEmail?: string; vendorPassword?: string });

      setSuccessMsg(`Vendor "${newVendorName}" and Login Account created successfully!`);
      setIsModalOpen(false);
      setNewVendorName('');
      setNewVendorTagline('');
      setNewVendorOwnerEmail('');
      setNewVendorPassword('vendor123');
      loadVendors();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to create vendor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = vendorsList.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.cuisineType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.college?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Banner & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Admin Vendor Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Create and manage canteen partner accounts across campuses</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-colored)',
            cursor: 'pointer'
          }}
        >
          <Plus size={20} />
          Add New Vendor
        </button>
      </div>

      {successMsg && (
        <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', padding: '14px 20px', borderRadius: '12px', fontWeight: '800', border: '1px solid #16A34A', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {successMsg}
        </div>
      )}

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search vendor by name, cuisine or college..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
              padding: '12px 12px 12px 40px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Vendors Table / Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map(vendor => (
          <div key={vendor.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{vendor.logo || '🏪'}</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{vendor.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{vendor.cuisineType}</div>
                </div>
              </div>
              <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} fill="var(--primary)" /> {vendor.rating || 4.5}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{vendor.tagline}</p>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>📍 Campus: <strong>{vendor.college || 'Elite Tech Campus'}</strong></div>
              <div>📞 Phone: <strong>{vendor.phone}</strong></div>
              <div>🕒 Hours: <strong>{vendor.openingTime} - {vendor.closingTime}</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vendor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ backgroundColor: 'var(--bg-surface)', width: '100%', maxWidth: '480px', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Store size={22} color="var(--primary)" />
                  <h2 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>Add New Canteen Vendor</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddVendor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Vendor Name</label>
                  <input
                    type="text"
                    required
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    placeholder="e.g. Snack Point Canteen"
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Tagline</label>
                  <input
                    type="text"
                    value={newVendorTagline}
                    onChange={(e) => setNewVendorTagline(e.target.value)}
                    placeholder="e.g. Fresh Hot Parathas & Tea"
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Cuisine Category</label>
                    <input
                      type="text"
                      value={newVendorCuisine}
                      onChange={(e) => setNewVendorCuisine(e.target.value)}
                      style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Campus College</label>
                    <input
                      type="text"
                      value={newVendorCollege}
                      onChange={(e) => setNewVendorCollege(e.target.value)}
                      style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Vendor Account Email (Google or Password Login)</label>
                  <input
                    type="email"
                    value={newVendorOwnerEmail}
                    onChange={(e) => setNewVendorOwnerEmail(e.target.value)}
                    placeholder="vendor.owner@elitex.edu"
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Vendor Account Password</label>
                  <input
                    type="text"
                    value={newVendorPassword}
                    onChange={(e) => setNewVendorPassword(e.target.value)}
                    placeholder="e.g. VendorSecret123"
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    boxShadow: 'var(--shadow-colored)',
                  }}
                >
                  {isSubmitting ? 'Creating Vendor & Account...' : 'Create Vendor & Login Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
