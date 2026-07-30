'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, Star, Flame, Cpu, Wifi, ChevronRight, Sparkles, Activity, Zap, Compass, Store } from 'lucide-react';
import { vendors as localVendors, foodItems as localFoodItems } from '@/data/vendors';
import { useAuthStore } from '@/store/auth-store';
import { fetchVendors, fetchVendorMenu, type VendorData, type MenuItemData } from '@/lib/api-client';
import { getCanteenRushHeatmap, getBestTimeSlotRecommendation, type RushHourData } from '@/lib/ml-analytics';
import CampusMap from '@/components/CampusMap';

const banners = [
  { id: 1, title: 'Pre-Order Campus Meals • Zero Waiting at Counters', subtitle: 'Select pickup slot & skip canteen queues', bg: 'linear-gradient(135deg, #FC8019 0%, #E5730D 100%)' },
  { id: 2, title: 'Offline Smart Tap Card Enabled', subtitle: 'Pay instantly at canteen counters with 0 network signal', bg: 'linear-gradient(135deg, #FF9A42 0%, #FC8019 100%)' },
  { id: 3, title: 'Dine-In Plate or Takeaway Packaging', subtitle: 'Freshly prepared hot food waiting at your slot', bg: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)' }
];

const categories = [
  { name: 'All' },
  { name: 'Biryani' },
  { name: 'Dosa' },
  { name: 'Burgers' },
  { name: 'Sandwiches' },
  { name: 'Thali' },
  { name: 'Tea & Coffee' },
  { name: 'Milkshakes' },
  { name: 'Protein Bowls' },
  { name: 'Chinese' },
];

export default function StudentHomePage() {
  const { user } = useAuthStore();
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dbVendors, setDbVendors] = useState<VendorData[]>([]);
  const [dbFoodItems, setDbFoodItems] = useState<MenuItemData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showMap, setShowMap] = useState(false);

  // ML Data
  const [heatmapData, setHeatmapData] = useState<RushHourData[]>([]);
  const [bestSlot, setBestSlot] = useState<{
    slot: string;
    estimatedWaitMinutes: number;
    confidenceScore: number;
    badge: string;
  }>({
    slot: '12:20 PM - 12:40 PM',
    estimatedWaitMinutes: 3,
    confidenceScore: 94,
    badge: '⚡ Fast Track Pickup Slot',
  });
  const [selectedHeatmapHour, setSelectedHeatmapHour] = useState<RushHourData | null>(null);

  useEffect(() => {
    setHeatmapData(getCanteenRushHeatmap());
    setBestSlot(getBestTimeSlotRecommendation());
  }, []);

  // Fetch vendors from API
  useEffect(() => {
    async function loadData() {
      try {
        let vendorsList = await fetchVendors();
        if (vendorsList.length === 0) {
          await fetch('/api/seed').catch(console.error);
          vendorsList = await fetchVendors();
        }

        if (vendorsList.length > 0) {
          setDbVendors(vendorsList);
          const allItemsPromises = vendorsList.map(v => fetchVendorMenu(v.id));
          const allItemsArrays = await Promise.all(allItemsPromises);
          setDbFoodItems(allItemsArrays.flat());
        }
      } catch (err) {
        console.error('Failed to load vendors from API, fallback to local data:', err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const card = user?.smartCard || { cardId: 'EX-8942-9901', balance: 500 };

  const displayVendors = dbVendors.length > 0 ? dbVendors : localVendors;
  const displayFoodItems = dbFoodItems.length > 0 ? dbFoodItems : localFoodItems;

  const popularFoods = (activeCategory === 'All' 
    ? displayFoodItems 
    : displayFoodItems.filter(item => item.category === activeCategory)).slice(0, 10);

  const getVendorName = (vendorId: string) => {
    const v = displayVendors.find(v => v.id === vendorId);
    return v ? v.name : '';
  };

  return (
    <div style={{ padding: '1.5rem', paddingBottom: '120px', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Cpu size={22} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Elite X</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
              <MapPin size={12} color="var(--primary)" />
              <span>{user?.college || 'Elite Tech Campus'} Canteens ▾</span>
            </div>
          </div>
        </div>

        {/* Smart Tap Balance Pill */}
        <Link href="/smart-card" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: '9999px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Wifi size={14} color="var(--primary)" style={{ transform: 'rotate(90deg)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-tertiary)', textTransform: 'uppercase', lineHeight: 1 }}>Smart Card</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>₹{card.balance.toFixed(2)}</span>
            </div>
            <ChevronRight size={14} color="var(--text-tertiary)" />
          </div>
        </Link>
      </header>

      {/* Swiggy Search Bar */}
      <Link href="/search" style={{ textDecoration: 'none' }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid var(--border-light)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Search size={20} color="var(--primary)" />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Search biryani, burgers, dosa, kulhad chai...</span>
        </div>
      </Link>

      {/* 1. CAMPUS CANTEENS / VENDORS SECTION (DISPLAYED FIRST AS REQUESTED) */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>Select Campus Canteen</h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800', backgroundColor: 'rgba(252, 128, 25, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
            {displayVendors.length} Stalls Open
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {displayVendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendor/${vendor.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                transition: 'transform 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ position: 'relative', height: '140px', backgroundColor: 'var(--bg-elevated)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={vendor.coverImage} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }} />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={12} fill="#FFF" /> {vendor.rating}
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>{vendor.name}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{vendor.tagline}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                    <span>🕒 {vendor.openingTime} - {vendor.closingTime}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Order Ahead →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hero Banners */}
      <div style={{ position: 'relative', height: '140px', borderRadius: '20px', overflow: 'hidden', marginBottom: '1.75rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBanner}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: banners[activeBanner].bg,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#FFF'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.95, backgroundColor: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: '6px', width: 'fit-content', marginBottom: '6px' }}>
              CAMPUS PRE-ORDERING
            </span>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800' }}>{banners[activeBanner].title}</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.95 }}>{banners[activeBanner].subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Categories Filter */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Explore Categories</h2>
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '4px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: activeCategory === cat.name ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                backgroundColor: activeCategory === cat.name ? 'var(--primary)' : 'var(--bg-surface)',
                color: activeCategory === cat.name ? '#FFF' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Food Items Grid */}
      <section style={{ marginBottom: '2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Flame size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Popular Pre-Order Dishes</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {popularFoods.map((item) => (
            <Link key={item.id} href={`/food/${item.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '10px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ width: '100%', height: '110px', borderRadius: '12px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--bg-elevated)' }}>
                  {item.image.startsWith('http') || item.image.startsWith('/') ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                      {item.image}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    border: `1.5px solid ${item.isVeg ? '#16A34A' : '#DC2626'}`,
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: item.isVeg ? '#16A34A' : '#DC2626' }} />
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>{getVendorName(item.vendorId)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>₹{item.price}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, backgroundColor: 'rgba(252, 128, 25, 0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                      ★ {item.rating}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. AI ANALYTICS & RUSH INTELLIGENCE SECTION (PRESENTED IN ORDERING / BOTTOM) */}
      <section style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
          🧠 AI Queue & Rush Intelligence
        </div>

        {/* ML AI BEST TIME SLOT RECOMMENDATION CARD */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '20px',
          padding: '16px',
          border: '1px solid var(--primary)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(252, 128, 25, 0.08) 0%, rgba(255, 255, 255, 0) 100%)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={18} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>AI Recommended 20-Min Slot</span>
            </div>
            <span suppressHydrationWarning style={{ fontSize: '10px', fontWeight: '800', backgroundColor: 'var(--primary)', color: '#FFF', padding: '2px 8px', borderRadius: '6px' }}>
              {bestSlot.badge}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div suppressHydrationWarning style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>{bestSlot.slot}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Est. Queue Wait: <strong style={{ color: '#16A34A' }}>&lt; {bestSlot.estimatedWaitMinutes} min</strong> • Confidence: <strong>{bestSlot.confidenceScore}%</strong>
              </div>
            </div>
            <Link href="/checkout?type=plate" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: 'var(--primary)',
                color: '#FFF',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: 'var(--shadow-colored)'
              }}>
                <Zap size={14} /> Reserve Slot
              </button>
            </Link>
          </div>
        </div>

        {/* ML CANTEEN CROWD HEATMAP */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={18} color="var(--primary)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Canteen Crowd Heatmap</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '10px', fontWeight: '700' }}>
              <span style={{ color: '#16A34A' }}>● Low</span>
              <span style={{ color: '#F5A623' }}>● Moderate</span>
              <span style={{ color: '#DC2626' }}>● Peak</span>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'thin' }}>
              <div style={{ display: 'flex', gap: '14px', minWidth: '780px', alignItems: 'flex-end', height: '110px', paddingTop: '10px' }}>
                {heatmapData.map((data, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedHeatmapHour(data)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div style={{ fontSize: '9px', fontWeight: '800', color: data.color, marginBottom: '4px' }}>
                      {data.score}%
                    </div>
                    <div 
                      style={{
                        width: '100%',
                        height: `${data.score * 0.65}%`,
                        backgroundColor: data.color,
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s ease',
                        opacity: selectedHeatmapHour?.hour === data.hour ? 1 : 0.85,
                        boxShadow: data.rushLevel === 'Peak' ? '0 0 8px rgba(220, 38, 38, 0.4)' : 'none',
                      }}
                    />
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                      marginTop: '8px',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      lineHeight: 1,
                    }}>
                      {data.hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedHeatmapHour ? (
              <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: 'var(--bg-elevated)', borderRadius: '12px', fontSize: '12px', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-light)' }}>
                <span>Timing Slot: <strong>{selectedHeatmapHour.hour}</strong></span>
                <span>Rush Density: <strong style={{ color: selectedHeatmapHour.color }}>{selectedHeatmapHour.rushLevel} ({selectedHeatmapHour.score}%)</strong></span>
              </div>
            ) : (
              <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                💡 Tap any 20-min timing bar above to view exact crowd density prediction.
              </div>
            )}
          </div>
        </div>

        {/* GPS MAP TOGGLE */}
        <div>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              width: '100%',
              backgroundColor: showMap ? 'var(--bg-surface)' : 'rgba(252, 128, 25, 0.1)',
              color: 'var(--primary)',
              border: '1.5px solid var(--primary)',
              padding: '12px 18px',
              borderRadius: '16px',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="var(--primary)" />
              <span>{showMap ? 'Hide Campus GPS Map' : 'Explore Campus Google Maps & Distances'}</span>
            </div>
            <span style={{ fontSize: '12px', backgroundColor: 'var(--primary)', color: '#FFF', padding: '3px 10px', borderRadius: '8px' }}>
              📍 GPS Live
            </span>
          </button>

          {showMap && (
            <div style={{ marginTop: '12px' }}>
              <CampusMap />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
