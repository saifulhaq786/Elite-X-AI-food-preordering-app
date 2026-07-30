'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Cpu, Plus, ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function StudentWalletPage() {
  const router = useRouter();
  const { user, topUpSmartCard } = useAuthStore();
  const [topUpModal, setTopUpModal] = useState(false);
  const [amount, setAmount] = useState('200');

  const card = user?.smartCard || { cardId: 'CHOW-8942-9901', balance: 500, status: 'Active' };
  const walletBalance = user?.walletBalance ?? 250;

  const transactions = [
    { id: '1', title: 'Top-up via UPI / Card', date: 'Today, 10:30 AM', amount: 200, type: 'credit' },
    { id: '2', title: 'Pre-order Tasty Times #ORD8829', date: 'Today, 12:15 PM', amount: 210, type: 'debit' },
    { id: '3', title: 'Offline Smart Tap - Canteen Stall 1', date: 'Yesterday, 01:20 PM', amount: 90, type: 'debit' },
    { id: '4', title: 'Smart Card Promo Bonus', date: '25 Jan 2026', amount: 50, type: 'credit' },
  ];

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      try {
        await topUpSmartCard(val);
        setTopUpModal(false);
      } catch (err) {
        console.error('Failed to top up:', err);
      }
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
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: 'var(--bg-surface)',
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
        <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>Campus Wallet & Card</h1>
      </header>

      <main style={{ padding: '20px' }}>
        {/* Smart Tap Card Banner Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => router.push('/smart-card')}
          style={{
            background: 'linear-gradient(135deg, #1F5067 0%, #15394A 100%)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
            color: '#FFF',
            cursor: 'pointer'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="#FFF" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFF', letterSpacing: '1px' }}>SMART TAP CARD</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>
                Manage <ChevronRight size={16} />
              </div>
            </div>

            <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>Smart Card Balance (Offline Tap Ready)</p>
            <h2 style={{ margin: '0 0 20px', fontSize: '36px', fontWeight: '800', color: '#FFF' }}>
              ₹{card.balance.toFixed(2)}
            </h2>
          </div>
        </motion.div>

        {/* Regular Online Wallet Card */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--text-secondary)' }}>App Online Wallet</p>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>₹{walletBalance.toFixed(2)}</h3>
            </div>
            <button
              onClick={() => setTopUpModal(true)}
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-colored)'
              }}
            >
              <Plus size={16} /> Top Up
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: 'var(--text-primary)' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(252, 128, 25, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  {item.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.date}</div>
                </div>
              </div>

              <div style={{
                fontWeight: '700',
                fontSize: '15px',
                color: 'var(--primary)'
              }}>
                {item.type === 'credit' ? '+' : '-'}₹{item.amount}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Quick Topup Modal */}
      {topUpModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000
        }}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{
            backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '360px', boxShadow: 'var(--shadow-xl)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Top Up Wallet / Smart Card</h3>
            <form onSubmit={handleAddFunds}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Amount (₹)</label>
                <input
                  type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600 }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setTopUpModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: 'var(--primary)', border: 'none', color: '#FFF', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Top Up</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
