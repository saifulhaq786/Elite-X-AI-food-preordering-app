'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Cpu
} from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { name: 'Home', path: '/admin', icon: LayoutDashboard },
  { name: 'Colleges', path: '/admin/colleges', icon: Building2 },
  { name: 'Vendors', path: '/admin/vendors', icon: Store },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Stats', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color="#FFF" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>ChowMe Admin</h2>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>College Super Console</span>
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#FFF' : 'var(--text-secondary)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                <span>{item.name === 'Home' ? 'Dashboard' : item.name === 'Stats' ? 'Analytics' : item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: 'auto' }}>
        <button
          onClick={() => router.push('/login')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            backgroundColor: 'transparent',
            color: '#DC2626',
            fontWeight: '800',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Desktop Sidebar */}
      <div 
        className="desktop-sidebar"
        style={{ 
          width: '260px', 
          backgroundColor: 'var(--bg-surface)', 
          borderRight: '1px solid var(--border-light)',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 30
        }}
      >
        {navContent}
      </div>

      {/* Main Admin Area */}
      <div className="dashboard-main-content" style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Admin Header */}
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
              <Shield size={18} color="#FFF" />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Admin Console <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Elite Tech</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(252, 128, 25, 0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, border: '1px solid var(--primary)' }}>
            <Cpu size={12} /> System Active
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
        padding: '0 4px',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {NAV_ITEMS.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;
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
                padding: '4px'
              }}>
                <Icon size={20} />
                <span style={{ fontSize: '10px', fontWeight: isActive ? '800' : '500' }}>
                  {tab.name}
                </span>
                {isActive && (
                  <div style={{ position: 'absolute', top: -2, width: '16px', height: '3px', backgroundColor: 'var(--primary)', borderRadius: '4px' }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
