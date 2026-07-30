'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wallet, Cpu, Clock, HelpCircle, LogOut, ChevronRight, Shield, Moon, Sun
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('chowme_theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('chowme_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleLogout = async () => {
    clearUser();
    await signOut({ callbackUrl: '/login' });
  };

  const card = user?.smartCard || { cardId: 'CHOW-8942-9901', balance: 500 };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-primary)',
      paddingBottom: '100px',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '24px 20px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '800',
              color: '#FFF',
              boxShadow: 'var(--shadow-colored)'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                {user?.name || 'Student Account'}
              </h1>
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {user?.email || 'student@college.edu'}
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(252, 128, 25, 0.1)',
                color: 'var(--primary)',
                padding: '2px 8px',
                borderRadius: '99px',
                fontSize: '11px',
                fontWeight: '700',
                border: '1px solid var(--primary)'
              }}>
                <Shield size={12} /> Elite Tech Verified
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Theme Preference Toggle */}
        <div 
          onClick={toggleTheme}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '16px 20px',
            border: '1px solid var(--border-medium)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.15)', padding: '10px', borderRadius: '12px' }}>
              {theme === 'light' ? <Sun size={22} color="var(--primary)" /> : <Moon size={22} color="var(--primary)" />}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>App Theme Mode</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {theme === 'light' ? 'Bright White & Orange (Default)' : 'Dark Theme (User Choice)'}
              </div>
            </div>
          </div>
          <div style={{
            padding: '6px 12px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#FFF',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            Switch to {theme === 'light' ? 'Dark' : 'White'}
          </div>
        </div>

        {/* Smart Tap Card Widget */}
        <div 
          onClick={() => router.push('/smart-card')}
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid var(--border-medium)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.15)', padding: '12px', borderRadius: '14px' }}>
              <Cpu size={24} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>Offline Smart Tap Card</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace', margin: '2px 0' }}>{card.cardId}</div>
              <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 800 }}>Balance: ₹{card.balance.toFixed(2)}</div>
            </div>
          </div>
          <ChevronRight size={20} color="var(--primary)" />
        </div>

        {/* Quick Links Menu */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {[
            { label: 'Smart Tap Card Management', icon: <Cpu size={20} color="var(--primary)" />, path: '/smart-card' },
            { label: 'In-App Wallet & Balance', icon: <Wallet size={20} color="var(--primary)" />, path: '/wallet' },
            { label: 'Order History & Receipts', icon: <Clock size={20} color="var(--primary)" />, path: '/orders' },
            { label: 'Support & Canteen Help', icon: <HelpCircle size={20} color="var(--primary)" />, path: '/help' },
          ].map((item, idx) => (
            <div
              key={item.label}
              onClick={() => router.push(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: idx === 3 ? 'none' : '1px solid var(--border-light)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon}
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{item.label}</span>
              </div>
              <ChevronRight size={18} color="var(--text-tertiary)" />
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#DC2626',
            padding: '16px',
            borderRadius: '16px',
            fontWeight: '800',
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <LogOut size={18} /> Sign Out of Account
        </button>
      </main>
    </div>
  );
}
