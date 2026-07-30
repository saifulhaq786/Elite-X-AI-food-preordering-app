'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Ban, X, Wifi } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  college: string;
  smartCardId: string;
  smartCardBalance: number;
  orders: number;
  joined: string;
  status: string;
}

const MOCK_USERS: UserItem[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `U00${i+1}`,
  name: ['Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Neha Gupta', 'Rohit Verma', 'Sneha Reddy', 'Vikas Yadav', 'Pooja Joshi', 'Karan Mehta', 'Anjali Desai'][i],
  email: `user${i+1}@college.edu`,
  college: ['DTU', 'NSUT', 'IIITD'][i % 3],
  smartCardId: `CHOW-${8940 + i}-99${i}1`,
  smartCardBalance: (i + 1) * 150,
  orders: (i + 1) * 4,
  joined: `2026-01-${(i + 1).toString().padStart(2, '0')}`,
  status: i === 8 ? 'Blocked' : 'Active'
}));

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Student & Smart Card Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Manage student accounts, Smart Tap Cards, and balances</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search students by name, email, card ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
              padding: '12px 12px 12px 40px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none'
            }}
          />
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px',
          backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer'
        }}>
          <Filter size={18} /> Filter
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.875rem', backgroundColor: 'var(--bg-elevated)' }}>
              <th style={{ padding: '16px', fontWeight: 600 }}>Student</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>College</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Smart Tap Card</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Pre-orders</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.smartCardId.toLowerCase().includes(searchQuery.toLowerCase())).map((user, idx) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-elevated)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: user.status === 'Blocked' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.college}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Wifi size={12} style={{ transform: 'rotate(90deg)' }} /> {user.smartCardId}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Bal: ₹{user.smartCardBalance}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>{user.orders} orders</td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: user.status === 'Active' ? 'rgba(252, 128, 25, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                    color: user.status === 'Active' ? 'var(--primary)' : '#DC2626'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setSelectedUser(user)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-elevated)', color: 'var(--primary)', cursor: 'pointer' }} 
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-elevated)', color: '#DC2626', cursor: 'pointer' }} title="Block User">
                      <Ban size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-xl)', padding: '24px', width: '100%', maxWidth: '420px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Student Profile</h3>
                <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedUser.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{selectedUser.email}</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>{selectedUser.college}</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-medium)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Offline Smart Tap Card</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace', margin: '4px 0' }}>{selectedUser.smartCardId}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Live Card Balance: <strong style={{ color: 'var(--primary)' }}>₹{selectedUser.smartCardBalance}</strong></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
