'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Minus, Plus, ShoppingCart, MapPin, Compass } from 'lucide-react';
import { vendors as localVendors, foodItems as localFoodItems, type FoodItem, type Vendor } from '@/data/vendors';
import { useCartStore } from '@/store/cart-store';
import { fetchVendorById, fetchVendorMenu, type VendorData, type MenuItemData } from '@/lib/api-client';
import CampusMap from '@/components/CampusMap';

export default function VendorPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [vendorItems, setVendorItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationMap, setShowLocationMap] = useState(false);

  const { items: cartItems, addItem, incrementQuantity, decrementQuantity, getTotal, getItemCount } = useCartStore();

  useEffect(() => {
    async function loadVendorData() {
      try {
        const dbVendor = await fetchVendorById(vendorId);
        const dbItems = await fetchVendorMenu(vendorId);

        if (dbVendor) {
          setVendor(dbVendor as unknown as Vendor);
        } else {
          // Fallback to local data
          const foundLocal = localVendors.find((v) => v.id === vendorId);
          if (foundLocal) setVendor(foundLocal);
        }

        if (dbItems && dbItems.length > 0) {
          setVendorItems(dbItems as unknown as FoodItem[]);
        } else {
          // Fallback to local items
          const foundLocalItems = localFoodItems.filter((i) => i.vendorId === vendorId);
          setVendorItems(foundLocalItems);
        }
      } catch (err) {
        console.error('Failed to fetch vendor from API:', err);
        const foundLocal = localVendors.find((v) => v.id === vendorId);
        if (foundLocal) setVendor(foundLocal);
        setVendorItems(localFoodItems.filter((i) => i.vendorId === vendorId));
      } finally {
        setIsLoading(false);
      }
    }

    if (vendorId) loadVendorData();
  }, [vendorId]);

  const categories = vendor?.categories ? ['All', ...vendor.categories] : ['All'];

  const filteredItems = selectedCategory === 'All'
    ? vendorItems
    : vendorItems.filter((item) => item.category === selectedCategory);

  const getQuantityInCart = (itemId: string) => {
    const found = cartItems.find((ci) => ci.foodItem.id === itemId);
    return found ? found.quantity : 0;
  };

  const totalCartCount = getItemCount();
  const grandTotal = getTotal();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
        Loading canteen menu...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
        <h2>Canteen Stall Not Found</h2>
        <button onClick={() => router.push('/home')} style={{ marginTop: '16px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '160px', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Banner & Header */}
      <div style={{ position: 'relative', height: '220px', backgroundColor: 'var(--bg-surface)' }}>
        <button
          onClick={() => router.back()}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#FFF',
            padding: '10px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex'
          }}
        >
          <ArrowLeft size={20} />
        </button>

        {vendor.coverImage && (vendor.coverImage.startsWith('http') || vendor.coverImage.startsWith('/')) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={vendor.coverImage} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
            <span style={{ fontSize: '100px' }}>{vendor.logo}</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-main) 0%, transparent 100%)' }} />
      </div>

      {/* Vendor Profile Info Card */}
      <div style={{ padding: '0 24px', marginTop: '-40px', position: 'relative', zIndex: 5 }}>
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '24px', padding: '20px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <span style={{ fontSize: '32px', display: 'inline-block', marginBottom: '4px' }}>{vendor.logo}</span>
              <h1 style={{ fontSize: '22px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>{vendor.name}</h1>
            </div>
            <div style={{ backgroundColor: 'var(--primary)', color: '#FFF', padding: '6px 12px', borderRadius: '12px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: 'var(--shadow-colored)' }}>
              <Star size={14} fill="#FFF" /> {vendor.rating}
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 16px 0', lineHeight: 1.4 }}>{vendor.tagline}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div>📍 <strong>{vendor.address}</strong></div>
            <button
              onClick={() => setShowLocationMap(!showLocationMap)}
              style={{
                backgroundColor: 'rgba(252, 128, 25, 0.1)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Compass size={12} /> {showLocationMap ? 'Hide GPS Map' : 'View Google Map Pin'}
            </button>
          </div>

          {/* Embedded Google Map location */}
          {showLocationMap && (
            <div style={{ marginTop: '14px' }}>
              <CampusMap selectedVendorId={vendor.id} />
            </div>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ padding: '24px 24px 12px 24px', overflowX: 'auto', display: 'flex', gap: '8px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '10px 18px',
              borderRadius: '9999px',
              border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border-light)',
              backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-surface)',
              color: selectedCategory === cat ? '#FFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items List */}
      <div style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '8px 0 4px 0', color: 'var(--text-primary)' }}>
          {selectedCategory === 'All' ? 'All Dishes' : selectedCategory} ({filteredItems.length})
        </h3>

        {filteredItems.map((item) => {
          const qty = getQuantityInCart(item.id);

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    border: `1.5px solid ${item.isVeg ? '#16A34A' : '#DC2626'}`,
                    position: 'relative',
                    display: 'inline-block'
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: item.isVeg ? '#16A34A' : '#DC2626'
                    }} />
                  </span>
                  <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>{item.name}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.3 }}>{item.description}</div>
                <div style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '15px' }}>₹{item.price}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '14px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)' }}>
                  {item.image && (item.image.startsWith('http') || item.image.startsWith('/')) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
                      {item.image}
                    </div>
                  )}
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => addItem(item)}
                    style={{
                      backgroundColor: 'rgba(252, 128, 25, 0.1)',
                      color: 'var(--primary)',
                      border: '1.5px solid var(--primary)',
                      padding: '6px 16px',
                      borderRadius: '10px',
                      fontWeight: '800',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    ADD
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: '10px', border: '1px solid var(--border-medium)' }}>
                    <button onClick={() => decrementQuantity(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--primary)' }}>{qty}</span>
                    <button onClick={() => incrementQuantity(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating View Cart Bar */}
      {totalCartCount > 0 && (
        <div style={{ position: 'fixed', bottom: '75px', left: 0, right: 0, padding: '14px 20px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', zIndex: 60 }}>
          <button
            onClick={() => router.push('/cart')}
            style={{
              width: '100%',
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              border: 'none',
              padding: '16px',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-colored)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} />
              <span>{totalCartCount} {totalCartCount === 1 ? 'Item' : 'Items'}</span>
            </div>
            <span>View Cart ₹{grandTotal.toFixed(2)} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
