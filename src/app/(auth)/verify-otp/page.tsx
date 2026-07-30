"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit
    if (index === 5 && value && newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (code = otp.join('')) => {
    if (code.length !== 6) return;
    
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/home'); // Redirect to student dashboard
      }, 1500);
    }, 1500);
  };

  return (
    <div className="page" style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <button 
          onClick={() => router.back()}
          className="btn btn-ghost"
          style={{ padding: 'var(--space-2)', marginLeft: 'calc(var(--space-2) * -1)' }}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '400px', width: '100%', margin: '0 auto' }}
      >
        <h1 className="heading-1">Verify OTP</h1>
        <p className="body-text" style={{ marginBottom: 'var(--space-8)' }}>
          We sent a 6-digit code to <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>+91 98765 43210</span>
        </p>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)', justifyContent: 'space-between' }}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="input-field"
                    style={{ 
                      width: '48px', 
                      height: '56px', 
                      textAlign: 'center', 
                      fontSize: 'var(--text-2xl)',
                      padding: 0,
                      fontWeight: 600
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={() => handleVerify()}
                disabled={otp.some(d => d === '') || isVerifying}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: 'var(--space-6)', opacity: (otp.some(d => d === '') || isVerifying) ? 0.7 : 1 }}
              >
                {isVerifying ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Verifying...
                  </div>
                ) : 'Verify'}
              </button>

              <div style={{ textAlign: 'center' }}>
                {countdown > 0 ? (
                  <p className="body-text">
                    Resend OTP in <span style={{ color: 'var(--primary)', fontWeight: 600 }}>00:{countdown.toString().padStart(2, '0')}</span>
                  </p>
                ) : (
                  <button 
                    onClick={() => { setCountdown(60); setOtp(['', '', '', '', '', '']); }}
                    className="btn btn-ghost"
                    style={{ color: 'var(--primary)' }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: 'var(--space-8) 0'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--success-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)'
                }}
              >
                <CheckCircle2 size={48} color="#10B981" />
              </motion.div>
              <h2 className="heading-2">Verified!</h2>
              <p className="body-text">Taking you to home...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {!isSuccess && (
        <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: 'var(--space-8)' }}>
          <Link href="/login" className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)' }}>
            Change Mobile Number
          </Link>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
