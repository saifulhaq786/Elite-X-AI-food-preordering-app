'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { foodItems, vendors } from '@/data/vendors';
import { useCartStore } from '@/store/cart-store';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const addItem = useCartStore((state) => state.addItem);

  const getVendorName = (vendorId: string) => {
    const v = vendors.find((v) => v.id === vendorId);
    return v ? v.name : 'Campus Canteen';
  };

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      getVendorName(item.vendorId).toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filterType === 'all' ? true : filterType === 'veg' ? item.isVeg : !item.isVeg;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '100px', fontFamily: 'Inter, sans-serif' }}>
      {/* Search Header */}
      <header style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={() => router.back()} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', display: 'flex', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', display: 'flex', alignItems: 'center', padding: '10px 14px', border: '1px solid var(--primary)' }}>
          <Search size={18} color="var(--primary)" />
          <input
            type="text"
            placeholder="Search biryani, burgers, dosa, chai..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', padding: '0 10px', fontSize: '14px', fontWeight: '600' }}
          />
        </div>
      </header>

      {/* Filter Pills */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: '10px' }}>
        {(['all', 'veg', 'non-veg'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: filterType === type ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
              backgroundColor: filterType === type ? 'var(--primary)' : 'var(--bg-surface)',
              color: filterType === type ? '#FFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              textTransform: 'capitalize',
              boxShadow: filterType === type ? 'var(--shadow-colored)' : 'var(--shadow-sm)'
            }}
          >
            {type === 'all' ? 'All Items' : type === 'veg' ? '🥗 Pure Veg' : '🍖 Non-Veg'}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <main style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '18px',
                padding: '16px',
                display: 'flex',
                gap: '14px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                alignItems: 'center'
              }}
            >
              <Link href={`/food/${item.id}`} style={{ display: 'flex', gap: '14px', flex: 1, textDecoration: 'none', color: 'inherit', alignItems: 'center' }}>
                <div style={{ width: '74px', height: '74px', borderRadius: '14px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)', flexShrink: 0, position: 'relative', border: '1px solid var(--border-light)' }}>
                  {item.image.startsWith('http') || item.image.startsWith('/') ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                      {item.image}
                    </div>
                  )}

                  <div style={{ position: 'absolute', top: '4px', left: '4px', width: '10px', height: '10px', borderRadius: '2px', border: `1.5px solid ${item.isVeg ? '#16A34A' : '#DC2626'}`, backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: item.isVeg ? '#16A34A' : '#DC2626' }} />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 2px 0', color: 'var(--text-primary)' }}>{item.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>{getVendorName(item.vendorId)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>₹{item.price}</span>
                    <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, backgroundColor: 'rgba(22, 163, 74, 0.12)', padding: '2px 6px', borderRadius: '6px' }}>★ {item.rating}</span>
                  </div>
                </div>
              </Link>

              <button
                onClick={() => addItem(item)}
                style={{
                  backgroundColor: 'rgba(252, 128, 25, 0.12)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ADD <Plus size={14} />
              </button>
            </motion.div>
          ))}

          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              No dishes found matching &quot;{query}&quot;. Try searching for &quot;biryani&quot; or &quot;chai&quot;.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
