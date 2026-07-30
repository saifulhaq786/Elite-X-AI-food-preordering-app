'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Mail, Clock, LogOut, CheckCircle2, ShieldCheck, Power } from 'lucide-react';
import { fetchVendors, type VendorData } from '@/lib/api-client';

export default function VendorProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const sessionUser = session?.user as Record<string, unknown> | undefined;
  const vendorSlug = (sessionUser?.vendorSlug as string) || 'tasty-times';
  const ownerEmail = session?.user?.email || 'vendor@elitex.edu';

  const [vendorInfo, setVendorInfo] = useState<Partial<VendorData>>({
    name: 'Tasty Times Canteen',
    tagline: 'Fresh Hot Snacks, Meals & Beverages',
    college: (sessionUser?.college as string) || 'Elite Tech Campus',
    address: 'Stall #1, Main Canteen Food Court',
    phone: '+91 98765 43210',
    openingTime: '08:00 AM',
    closingTime: '09:00 PM',
    rating: 4.8,
    isOpen: true,
  });

  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    async function loadVendorDetails() {
      try {
        const vendors = await fetchVendors();
        const found = vendors.find((v) => v.id === vendorSlug || v.name.toLowerCase().includes('tasty'));
        if (found) {
          setVendorInfo(found);
          setIsAcceptingOrders(found.isOpen ?? true);
        }
      } catch (err) {
        console.error('Failed to fetch vendor details:', err);
      }
    }
    loadVendorDetails();
  }, [vendorSlug]);

  const toggleAcceptingStatus = () => {
    const nextStatus = !isAcceptingOrders;
    setIsAcceptingOrders(nextStatus);
    setToastMsg(`Canteen status updated: ${nextStatus ? 'ONLINE (Accepting Orders)' : 'OFFLINE (Closed)'}`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
    router.push('/login');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Vendor Canteen Profile</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Manage your canteen operational status, stall details & account</p>
      </div>

      {toastMsg && (
        <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', border: '1px solid #16A34A', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* Canteen Profile Card */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(252, 128, 25, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
            🏪
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{vendorInfo.name}</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{vendorInfo.tagline}</div>
            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '800', marginTop: '4px', textTransform: 'uppercase' }}>
              Slug: {vendorSlug}
            </div>
          </div>
        </div>

        {/* Operating Status Toggle Banner */}
        <div style={{ backgroundColor: isAcceptingOrders ? 'rgba(22, 163, 74, 0.08)' : 'rgba(220, 38, 38, 0.08)', border: `1px solid ${isAcceptingOrders ? '#16A34A' : '#DC2626'}`, borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Power size={20} color={isAcceptingOrders ? '#16A34A' : '#DC2626'} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: isAcceptingOrders ? '#16A34A' : '#DC2626' }}>
                {isAcceptingOrders ? 'ONLINE • Accepting Orders' : 'OFFLINE • Canteen Closed'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {isAcceptingOrders ? 'Students can view menu & pre-order meals' : 'New pre-orders are temporarily paused'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleAcceptingStatus}
            style={{
              width: '50px',
              height: '28px',
              borderRadius: '14px',
              backgroundColor: isAcceptingOrders ? 'var(--primary)' : '#94A3B8',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            <motion.div
              initial={false}
              animate={{ left: isAcceptingOrders ? '24px' : '3px' }}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'white',
                position: 'absolute',
                top: '3px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Canteen Location & Hours Info */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Stall & Campus Information
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
          <MapPin size={18} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{vendorInfo.college}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{vendorInfo.address}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
          <Clock size={18} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Operating Hours</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{vendorInfo.openingTime} - {vendorInfo.closingTime} (Mon - Sat)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
          <Phone size={18} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Support Phone</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{vendorInfo.phone || '+91 98765 43210'}</div>
          </div>
        </div>
      </div>

      {/* Owner Login Details */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Vendor Account Security
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
          <Mail size={18} color="var(--primary)" />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Owner Email</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ownerEmail}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
          <ShieldCheck size={18} color="#16A34A" />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Session Auth Role</div>
            <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700' }}>Authenticated Vendor Terminal</div>
          </div>
        </div>
      </div>

      {/* Sign Out Action */}
      <button
        onClick={handleSignOut}
        style={{
          width: '100%',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          color: '#DC2626',
          border: '1.5px solid #DC2626',
          padding: '16px',
          borderRadius: '16px',
          fontSize: '15px',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '10px',
        }}
      >
        <LogOut size={20} />
        Sign Out Vendor Account
      </button>
    </div>
  );
}
