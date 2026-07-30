'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Loader2, Sparkles, Shield, Store, User, AlertTriangle, KeyRound, Mail } from 'lucide-react';

export type UserRole = 'student' | 'vendor' | 'admin';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signingRole, setSigningRole] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'OAuthSignin' || errorParam === 'invalid_client' || errorParam === 'Callback') {
      setError('Google OAuth Client ID is missing or invalid in .env.local. Please use Email/Password or 1-Click Sign In below.');
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setError('');
    setIsSigningIn(true);
    signIn('google', { callbackUrl: '/home' });
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setIsSigningIn(true);

    try {
      const result = await signIn('credentials', {
        email: emailInput.trim(),
        password: passwordInput,
        redirect: false,
      });

      if (result?.error) {
        setError('Login failed: ' + result.error);
        setIsSigningIn(false);
      } else if (result?.url) {
        router.push('/home');
      } else {
        router.push('/home');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Login failed');
      setIsSigningIn(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setError('');
    setSigningRole(role);
    setIsSigningIn(true);

    const email = role === 'vendor' ? 'vendor@elitex.edu' : role === 'admin' ? 'admin@elitex.edu' : 'alex.m@college.edu';
    const callbackUrl = role === 'vendor' ? '/vendor/orders' : role === 'admin' ? '/admin' : '/home';

    try {
      const result = await signIn('credentials', {
        email,
        role,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError('Login failed: ' + result.error);
        setIsSigningIn(false);
        setSigningRole(null);
      } else if (result?.url) {
        router.push(result.url);
      } else {
        router.push(callbackUrl);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Login failed');
      setIsSigningIn(false);
      setSigningRole(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', boxShadow: 'var(--shadow-sm)' }}
        >
          <ArrowLeft size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={18} color="#FFF" />
          </div>
          <span style={{ fontWeight: '900', fontSize: '18px', color: 'var(--primary)' }}>Elite X</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '440px', width: '100%', margin: '0 auto' }}
      >
        <h1 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Welcome to Elite X</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 24px 0' }}>
          Campus Food Pre-Ordering & Offline Smart Card System
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', marginBottom: '20px', border: '1px solid #DC2626', lineHeight: 1.5, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Email & Password Login Section */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '24px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <KeyRound size={18} color="var(--primary)" />
              <span>Email & Password Login</span>
            </div>
            <span style={{ color: 'var(--primary)', fontSize: '12px' }}>{showPasswordForm ? '▲ Hide' : '▼ Expand'}</span>
          </button>

          {showPasswordForm && (
            <form onSubmit={handleEmailPasswordLogin} style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="user@elitex.edu or vendor@elitex.edu"
                    style={{ width: '100%', padding: '12px 12px 12px 38px', borderRadius: '12px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFF',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: isSigningIn ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-colored)',
                  marginTop: '4px',
                }}
              >
                {isSigningIn ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In with Email'}
              </button>
            </form>
          )}
        </div>

        {/* Instant Role Login Card */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '24px', border: '1px solid var(--primary)', boxShadow: 'var(--shadow-md)', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={16} /> 1-Click Fast Campus Sign In
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={isSigningIn}
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                border: 'none',
                padding: '14px 18px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: isSigningIn ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-colored)',
                opacity: isSigningIn && signingRole !== 'student' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={18} />
                <span>Student Portal</span>
              </div>
              {signingRole === 'student' ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <span>Enter →</span>}
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('vendor')}
              disabled={isSigningIn}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-medium)',
                padding: '14px 18px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: isSigningIn ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: isSigningIn && signingRole !== 'vendor' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Store size={18} color="var(--primary)" />
                <span>Vendor Dashboard</span>
              </div>
              {signingRole === 'vendor' ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <span>Enter →</span>}
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={isSigningIn}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-medium)',
                padding: '14px 18px',
                borderRadius: '14px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: isSigningIn ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: isSigningIn && signingRole !== 'admin' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} color="var(--primary)" />
                <span>Admin Panel</span>
              </div>
              {signingRole === 'admin' ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <span>Enter →</span>}
            </button>
          </div>
        </div>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or OAuth Sign In</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
        </div>

        {/* Google Sign-In Card */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <button
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            style={{
              width: '100%',
              backgroundColor: '#FFF',
              color: '#1F1F1F',
              border: '1px solid #DADCE0',
              padding: '14px 16px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isSigningIn ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              opacity: isSigningIn ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            {isSigningIn && !signingRole ? (
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            Sign in with Google Account
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', fontSize: '11px', color: 'var(--text-tertiary)' }}>
          <span>🔒 Encrypted JWT</span>
          <span>🛡️ Server Middleware</span>
          <span>⚡ NextAuth Session</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: 'var(--text-primary)', textAlign: 'center' }}>Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
