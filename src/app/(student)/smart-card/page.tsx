'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Cpu, Wifi, Lock, ShieldCheck, Zap, Plus, 
  CheckCircle2, History
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function SmartCardPage() {
  const router = useRouter();
  const { user, topUpSmartCard, toggleCardFreeze, setDailyLimit } = useAuthStore();

  const [topUpAmount, setTopUpAmount] = useState<string>('200');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState<string>('1000');
  const [isSuccessToast, setIsSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const card = user?.smartCard || {
    cardId: 'CHOW-8942-9901',
    balance: 500,
    isFrozen: false,
    dailyLimit: 1000,
    nfcToken: 'NFC_TOK_8841920',
    lastTappedAt: '2026-07-28T12:30:00Z',
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (!isNaN(amt) && amt > 0) {
      topUpSmartCard(amt);
      setShowTopUpModal(false);
      triggerToast(`Added ₹${amt.toFixed(2)} to Smart Tap Card!`);
    }
  };

  const handleSaveLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const lim = parseFloat(newLimit);
    if (!isNaN(lim) && lim >= 100) {
      setDailyLimit(lim);
      setShowLimitModal(false);
      triggerToast(`Daily spend limit updated to ₹${lim.toFixed(2)}`);
    }
  };

  const handleFreezeToggle = () => {
    toggleCardFreeze();
    triggerToast(card.isFrozen ? 'Smart Card Unfrozen' : 'Smart Card Frozen for Security');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      paddingBottom: '120px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Sticky Header */}
      <header style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-surface)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={() => router.back()} 
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              display: 'flex',
              padding: '8px',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
            Smart Tap Card Hub
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(252, 128, 25, 0.15)', border: '1px solid var(--primary)', padding: '4px 10px', borderRadius: '12px' }}>
          <Wifi size={14} color="var(--primary)" style={{ transform: 'rotate(90deg)' }} />
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)' }}>Offline Ready</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '20px' }}>
        
        {/* Toast Notification */}
        <AnimatePresence>
          {isSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                padding: '12px 16px',
                borderRadius: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: '700',
                fontSize: '14px',
                boxShadow: 'var(--shadow-colored)'
              }}
            >
              <CheckCircle2 size={18} /> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Swiggy Metallic Smart Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            borderRadius: '24px',
            background: card.isFrozen 
              ? 'linear-gradient(135deg, #64748B 0%, #334155 100%)' 
              : 'linear-gradient(135deg, #FC8019 0%, #E5730D 50%, #FC8019 100%)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '24px',
            color: '#FFF'
          }}
        >
          {/* Card Ambient Glow */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.15)', filter: 'blur(30px)' }} />

          {/* Top Bar of Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={24} color="#FFF" />
              <span style={{ fontWeight: '900', fontSize: '18px', color: '#FFF', letterSpacing: '0.5px' }}>ChowMe TAP</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '12px' }}>
              <Wifi size={14} color="#FFF" style={{ transform: 'rotate(90deg)' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFF' }}>NFC Prepaid</span>
            </div>
          </div>

          {/* Golden EMV Chip Symbol */}
          <div style={{ width: '45px', height: '34px', borderRadius: '6px', background: 'linear-gradient(135deg, #F5A623 0%, #D97706 100%)', border: '1px solid #FFF', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '30px', height: '20px', border: '1px solid rgba(0,0,0,0.3)', borderRadius: '3px' }} />
          </div>

          {/* Bottom Info of Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '1px' }}>CARD NUMBER</div>
              <div style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'monospace', color: '#FFF', letterSpacing: '2px' }}>
                {card.cardId}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.95)', marginTop: '2px', fontWeight: 600 }}>
                {user?.name || 'Student Account'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '1px' }}>LIVE BALANCE</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#FFF' }}>
                ₹{card.balance.toFixed(2)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setShowTopUpModal(true)}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              border: 'none',
              padding: '16px 12px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-colored)'
            }}
          >
            <Plus size={22} />
            <span style={{ fontSize: '13px', fontWeight: '800' }}>In-App Top Up</span>
          </button>

          <button
            onClick={handleFreezeToggle}
            style={{
              backgroundColor: card.isFrozen ? '#16A34A' : 'var(--bg-surface)',
              color: card.isFrozen ? '#FFF' : '#DC2626',
              border: `1px solid ${card.isFrozen ? '#16A34A' : 'rgba(220, 38, 38, 0.3)'}`,
              padding: '16px 12px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Lock size={22} />
            <span style={{ fontSize: '13px', fontWeight: '800' }}>{card.isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
          </button>

          <button
            onClick={() => setShowLimitModal(true)}
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              padding: '16px 12px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Zap size={22} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: '800' }}>Daily Limit</span>
          </button>
        </div>

        {/* Offline Smart Tap Info Banner */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.12)', padding: '10px', borderRadius: '12px' }}>
              <ShieldCheck size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>How Offline Tapping Works</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Zero Internet Required at Counters</span>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Your Smart Tap Card is loaded with an encrypted hardware token (<strong>{card.nfcToken}</strong>). Show this card or tap your mobile at any canteen counter. The vendor scanner approves transactions instantly offline!
          </p>
        </div>

        {/* Tap History Log */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="var(--primary)" /> Recent Counter Taps
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>Tasty Times Counter #1</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>NFC Tap • Today, 12:30 PM</div>
              </div>
              <div style={{ fontWeight: '800', color: '#DC2626', fontSize: '15px' }}>-₹180.00</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>In-App UPI Top-Up</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>UPI Ref #9941 • Yesterday</div>
              </div>
              <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '15px' }}>+₹500.00</div>
            </div>
          </div>
        </div>
      </main>

      {/* Top-Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-xl)' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Top Up Smart Card</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Load money into your card for offline counter taps.</p>
              
              <form onSubmit={handleTopUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} placeholder="Amount in ₹" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '14px', borderRadius: '14px', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '700', outline: 'none' }} />
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['100', '200', '500', '1000'].map(val => (
                    <button key={val} type="button" onClick={() => setTopUpAmount(val)} style={{ flex: 1, backgroundColor: topUpAmount === val ? 'var(--primary)' : 'var(--bg-elevated)', border: 'none', color: topUpAmount === val ? '#FFF' : 'var(--text-primary)', padding: '8px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>+₹{val}</button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowTopUpModal(false)} style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '14px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, backgroundColor: 'var(--primary)', border: 'none', color: '#FFF', padding: '14px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Pay & Top Up</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Daily Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-xl)' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Set Daily Spend Limit</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Maximum amount that can be tapped per day.</p>
              
              <form onSubmit={handleSaveLimit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} placeholder="Limit in ₹" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '14px', borderRadius: '14px', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '700', outline: 'none' }} />

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowLimitModal(false)} style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '14px', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, backgroundColor: 'var(--primary)', border: 'none', color: '#FFF', padding: '14px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer' }}>Save Limit</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
