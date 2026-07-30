'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, Cpu, Wallet, User } from 'lucide-react';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', path: '/home', icon: <Home size={22} /> },
    { name: 'Orders', path: '/orders', icon: <ClipboardList size={22} /> },
    { name: 'Smart Card', path: '/smart-card', icon: <Cpu size={22} /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet size={22} /> },
    { name: 'Profile', path: '/profile', icon: <User size={22} /> },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--bg-main)',
      minHeight: '100vh',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ flex: 1, paddingBottom: '80px', overflowY: 'auto' }}>
        {children}
      </div>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '75px',
        background: 'var(--bg-surface-glass-heavy)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 0.5rem',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path === '/home' && pathname === '/');
          return (
            <Link key={tab.name} href={tab.path} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
                transition: 'color 0.2s ease',
                position: 'relative',
                padding: '0.4rem 0.6rem'
              }}>
                {tab.icon}
                <span style={{ fontSize: '11px', fontWeight: isActive ? '700' : '500' }}>
                  {tab.name}
                </span>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    width: '20px',
                    height: '2.5px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '2px'
                  }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
