'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Cpu, ShieldCheck, Loader2 } from 'lucide-react';

const PUBLIC_PATHS = ['/', '/login', '/register', '/verify-otp'];

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, userRole } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublicPath =
    PUBLIC_PATHS.some((path) => pathname === path) || pathname.startsWith('/api/');

  useEffect(() => {
    if (!mounted || isLoading) return;

    // Unauthenticated users accessing protected routes
    if (!isAuthenticated && !isPublicPath) {
      router.replace('/login');
      return;
    }

    // Authenticated users on login/register → redirect to dashboard
    if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
      if (userRole === 'admin') router.replace('/admin');
      else if (userRole === 'vendor') router.replace('/vendor/orders');
      else router.replace('/home');
      return;
    }

    // Admin-only routes
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      router.replace('/home');
      return;
    }

    // Vendor management routes
    const vendorManagement = ['/vendor/orders', '/vendor/analytics', '/vendor/menu', '/vendor/scan'];
    if (vendorManagement.some((p) => pathname.startsWith(p)) && userRole !== 'vendor' && userRole !== 'admin') {
      router.replace('/home');
      return;
    }
  }, [mounted, isLoading, isAuthenticated, isPublicPath, pathname, router, userRole]);

  // SSR / public paths: render immediately
  if (!mounted || isPublicPath) {
    return <>{children}</>;
  }

  // Loading state while auth resolves
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-primary)',
          fontFamily: 'Inter, sans-serif',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <Cpu size={32} color="#FFF" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Loader2 size={20} color="var(--primary)" className="animate-spin" />
          <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Verifying Campus Credentials...
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated → show redirect message
  if (!isAuthenticated && !isPublicPath) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-primary)',
          fontFamily: 'Inter, sans-serif',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShieldCheck size={32} color="#EF4444" />
        </div>
        <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
          Login Required. Redirecting to Portal...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
