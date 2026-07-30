'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Check, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { updateUserProfile } from '@/lib/api-client';

function RegisterContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, loadProfile } = useAuthStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('Elite Tech Campus');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
    }
    if (user) {
      if (user.mobile) setPhone(user.mobile);
      if (user.college) setCollege(user.college);
    }
  }, [session, user]);

  const handleGoogleSignUp = async () => {
    setIsSigningIn(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/home' });
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Sign up failed');
      setIsSigningIn(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        college: college.trim(),
      });
      await loadProfile();
      router.push('/home');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button
          onClick={() => router.push('/login')}
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
        <h1 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Complete Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 32px 0' }}>
          Set up your campus details for smooth meal pre-ordering
        </p>

        {session?.user ? (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: '600', border: '1px solid #DC2626' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Campus College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Elite Tech Campus"
                style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-medium)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                width: '100%',
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                border: 'none',
                padding: '16px',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-colored)',
                opacity: isSaving ? 0.7 : 1,
                marginTop: '12px',
              }}
            >
              {isSaving ? (
                <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Saving Profile...</>
              ) : (
                <><Check size={20} /> Save & Proceed to Home</>
              )}
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '32px 24px', borderRadius: '24px', border: '1px solid var(--border-medium)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>Sign in to continue</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>You must sign in with Google first before setting up your profile.</p>

            <button
              onClick={handleGoogleSignUp}
              disabled={isSigningIn}
              style={{
                width: '100%',
                backgroundColor: '#FFF',
                color: '#1F1F1F',
                border: '1px solid #DADCE0',
                padding: '16px',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              Continue with Google
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: 'var(--text-primary)', textAlign: 'center' }}>Loading register...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
