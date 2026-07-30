'use client';

import React, { useState } from 'react';
import { Cpu, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState('3');
  const [parcelFee, setParcelFee] = useState('8');
  const [smartCardMaxBonus, setSmartCardMaxBonus] = useState('50');
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Platform Settings</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Configure campus pre-ordering parameters & Smart Card settings</p>
        </div>
      </div>

      {savedToast && (
        <div style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '12px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', boxShadow: 'var(--shadow-colored)' }}>
          ✓ Platform settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} /> Smart Card System Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Default Smart Card Cashback Bonus (₹)</label>
              <input type="number" value={smartCardMaxBonus} onChange={(e) => setSmartCardMaxBonus(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Platform Service Fee (₹)</label>
              <input type="number" value={platformFee} onChange={(e) => setPlatformFee(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Takeaway Packaging Charge (₹)</label>
              <input type="number" value={parcelFee} onChange={(e) => setParcelFee(e.target.value)} style={{ width: '100%', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>
        </div>

        <button type="submit" style={{ backgroundColor: 'var(--primary)', color: '#FFF', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: 'var(--shadow-colored)' }}>
          <Save size={18} /> Save Settings
        </button>
      </form>
    </div>
  );
}
