'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  BarChart3, 
  QrCode, 
  LogOut,
  Store,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { name: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
  { name: 'Menu', href: '/vendor/menu', icon: UtensilsCrossed },
  { name: 'Orders', href: '/vendor/orders', icon: ClipboardList },
  { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { name: 'Scanner', href: '/vendor/scan', icon: QrCode },
  { name: 'Profile', href: '/vendor/profile', icon: User },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const navContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', background: 'var(--bg-surface)' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Store size={22} color="#FFF" />
        </div>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: '900', margin: 0 }}>Tasty Times</h1>
          <p style={{ color: 'var(--primary)', fontSize: '12px', margin: 0, fontWeight: '700' }}>Canteen Vendor Portal</p>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
        <button
          onClick={() => router.push('/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            width: '100%',
            backgroundColor: 'transparent',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: '#DC2626',
            cursor: 'pointer',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '14px'
          }}
        >
          <LogOut size={18} />
          <span>Sign Out Vendor</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside
        className="desktop-sidebar"
        style={{
          width: '260px',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-light)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 30
        }}
      >
        {navContent}
      </aside>

      {/* Main Vendor Body */}
      <div className="dashboard-main-content" style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '70px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="mobile-menu-btn" style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={18} color="#FFF" />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Vendor Terminal <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Stall #1 Tasty Times</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={toggleTheme}
              title="Toggle Light/Dark Theme"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="var(--primary)" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <div style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
              ● Accepting Orders
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '16px', paddingBottom: '90px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (visible on mobile only) */}
      <nav className="mobile-menu-btn" style={{
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
        padding: '0 8px',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {navItems.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link key={tab.name} href={tab.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? 'var(--primary)' : 'var(--text-tertiary)',
                transition: 'color 0.2s ease',
                position: 'relative',
                padding: '4px'
              }}>
                <Icon size={22} />
                <span style={{ fontSize: '11px', fontWeight: isActive ? '800' : '500' }}>
                  {tab.name}
                </span>
                {isActive && (
                  <div style={{ position: 'absolute', top: -2, width: '20px', height: '3px', backgroundColor: 'var(--primary)', borderRadius: '4px' }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
