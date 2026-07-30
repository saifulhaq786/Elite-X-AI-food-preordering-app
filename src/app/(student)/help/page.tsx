'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PhoneCall, Mail, ShieldCheck } from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '100px', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => router.back()} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Canteen Support & FAQs</h1>
      </header>

      <main style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} /> Smart Tap Card Support
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Need help with your Smart Tap Card top-up or counter payment? Contact our campus helpdesk 24/7 or report a frozen card instantly inside the Smart Card Hub.
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Frequently Asked Questions</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>How do I pay offline at canteen counters?</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Show your Smart Card ID or present the NFC card to the vendor counter scanner. No mobile data or internet is needed!</div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>What happens if an item is out of stock?</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>If the vendor cannot prepare an item, your money is 100% refunded to your Smart Card balance instantly.</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="tel:+919876543210" style={{ flex: 1, textDecoration: 'none', backgroundColor: 'var(--primary)', color: '#FFF', padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'var(--shadow-colored)' }}>
            <PhoneCall size={18} /> Call Support
          </a>
          <a href="mailto:support@chowme.in" style={{ flex: 1, textDecoration: 'none', backgroundColor: 'var(--bg-surface)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '14px', borderRadius: '16px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Mail size={18} /> Email Us
          </a>
        </div>
      </main>
    </div>
  );
}
