'use client';

import React, { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cpu, Clock, UtensilsCrossed, ArrowRight, Wifi } from 'lucide-react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function LandingPage() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient Radial Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(252, 128, 25, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '440px' }}>
        {/* Brand Shield Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{
            marginBottom: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '20px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <Cpu size={28} color="var(--primary)" />
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px', color: 'var(--text-primary)', display: 'block', lineHeight: 1.1 }}>ELITE X</span>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Campus Pre-Orders & Smart Tap</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            marginBottom: '0.75rem',
            textAlign: 'center',
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)'
          }}
        >
          Zero Waiting. Zero Network Delays.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '0.95rem',
            fontWeight: '400',
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}
        >
          Pre-order campus meals in advance with scheduled pickup slots, or pay instantly at canteen counters using your offline <span style={{ color: 'var(--primary)', fontWeight: 600 }}>NFC Smart Tap Card</span>.
        </motion.p>

        {/* Feature Pill Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            width: '100%',
            marginBottom: '2rem'
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '14px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <Clock size={20} color="var(--primary)" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Scheduled Pickup</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Select exact time slot</div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '14px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <Wifi size={20} color="var(--primary)" style={{ margin: '0 auto 6px', transform: 'rotate(90deg)' }} />
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Offline Smart Tap</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Tap card at counter</div>
          </div>
        </motion.div>

        {/* Portal Entry Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              border: 'none',
              borderRadius: '14px',
              padding: '16px',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-colored)'
            }}>
              <UtensilsCrossed size={18} />
              Student Pre-Order Portal
              <ArrowRight size={18} />
            </button>
          </Link>

          <Link href="/smart-card" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--primary)',
              color: 'var(--primary)',
              borderRadius: '14px',
              padding: '14px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Cpu size={18} />
              Smart Tap Card Hub
            </button>
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
            <Link href="/vendor" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center'
              }}>
                Vendor Terminal
              </button>
            </Link>

            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center'
              }}>
                Admin Console
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
