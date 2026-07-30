'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Tag, Gift } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { calculateOfferDiscount, getSmartCartPairings, VENDOR_OFFERS, type SmartPairing } from '@/lib/ml-analytics';

const PLATFORM_FEE = 3;
const PARCEL_CHARGE = 8;

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, addItem } = useCartStore();
  const [orderType, setOrderType] = useState<'plate' | 'parcel'>('plate');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const itemTotal = getTotal();
  const packingCharge = orderType === 'parcel' ? PARCEL_CHARGE : 0;

  // ML Offer & Discount Calculation
  const offerDetails = calculateOfferDiscount(itemTotal, appliedCoupon);
  const discount = offerDetails.discountAmount;
  const grandTotal = Math.max(0, itemTotal + packingCharge + PLATFORM_FEE - discount);

  // ML Smart Pairings
  const itemNames = items.map(i => i.foodItem.name);
  const smartPairings = getSmartCartPairings(itemNames);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const match = VENDOR_OFFERS.find(o => o.code === code);
    if (match) {
      if (itemTotal >= match.minSpend) {
        setAppliedCoupon(code);
      } else {
        alert(`Minimum order amount for ${code} is ₹${match.minSpend}`);
      }
    } else if (code === 'NEW50' || code === 'FREEDEL') {
      setAppliedCoupon(code);
    } else {
      alert('Invalid promo code. Try ELITE10 or CAMPUS20');
    }
  };

  const handleAddPairingToCart = (pairing: SmartPairing) => {
    const dummyFoodItem = {
      id: pairing.id,
      vendorId: items[0]?.vendorId || 'tasty-times',
      name: pairing.name,
      description: pairing.reason,
      price: pairing.discountPrice || pairing.price,
      category: 'Beverages & Addons',
      isVeg: true,
      image: pairing.image,
      rating: 4.8,
      reviewCount: 120,
      prepTime: 3,
      isAvailable: true,
      stockCount: 50,
      ingredients: [],
    };
    addItem(dummyFoodItem);
  };

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-main)',
          color: 'var(--text-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          style={{ fontSize: '64px', marginBottom: '20px' }}
        >
          🛒
        </motion.div>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px', color: 'var(--text-primary)' }}>
          Your cart is empty
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', textAlign: 'center', maxWidth: '300px', fontSize: '14px' }}>
          Explore campus canteens and pre-order your favorite meals.
        </p>
        <button
          onClick={() => router.push('/home')}
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-colored)'
          }}
        >
          Browse Campus Canteens
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '160px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '20px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>Your Cart</h1>
        <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '800' }}>{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
      </div>

      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>

        {/* Vendor Offer Threshold Banner */}
        {offerDetails.nextOfferTier ? (
          <div style={{ backgroundColor: 'rgba(252, 128, 25, 0.08)', border: '1px solid var(--primary)', borderRadius: '16px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift size={20} color="var(--primary)" />
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {offerDetails.nextOfferTier.description}
            </div>
          </div>
        ) : offerDetails.appliedOffer && (
          <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', border: '1px solid #16A34A', borderRadius: '16px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#16A34A" />
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#16A34A' }}>
              🎉 10% Discount Applied! {offerDetails.complimentaryItem && `+ ${offerDetails.complimentaryItem}`}
            </div>
          </div>
        )}

        {/* Multi-Vendor Order Notice */}
        {(() => {
          const uniqueVendors = Array.from(new Set(items.map((i) => i.vendorId || i.foodItem.vendorId || 'tasty-times')));
          if (uniqueVendors.length <= 1) return null;
          const vendorNamesMap: Record<string, string> = {
            'royal-kitchen': 'Royal Kitchen',
            'campus-kitchen': 'Campus Kitchen',
            'tasty-times': 'Tasty Times',
            'chai-point': 'Chai Point',
            'shake-hub': 'Shake Hub',
            'green-bowl': 'Green Bowl',
          };
          const names = uniqueVendors.map((v) => vendorNamesMap[v] || v);
          return (
            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3B82F6', borderRadius: '16px', padding: '14px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px' }}>🏪</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#1E40AF' }}>
                  Multi-Canteen Order ({names.join(' & ')})
                </div>
                <div style={{ fontSize: '11px', color: '#1E3A8A', marginTop: '2px', lineHeight: '1.4' }}>
                  Your checkout will generate <strong>{uniqueVendors.length} separate pickup tokens & QR codes</strong>. Collect food independently at each canteen without QR expiration conflicts!
                </div>
              </div>
            </div>
          );
        })()}

        {/* Items List Grouped by Vendor */}
        <AnimatePresence>
          {(() => {
            const vendorNamesMap: Record<string, string> = {
              'royal-kitchen': 'Royal Kitchen',
              'campus-kitchen': 'Campus Kitchen',
              'tasty-times': 'Tasty Times',
              'chai-point': 'Chai Point',
              'shake-hub': 'Shake Hub',
              'green-bowl': 'Green Bowl',
            };

            const vendorGroups = new Map<string, typeof items>();
            for (const item of items) {
              const vId = item.vendorId || item.foodItem.vendorId || 'tasty-times';
              if (!vendorGroups.has(vId)) vendorGroups.set(vId, []);
              vendorGroups.get(vId)!.push(item);
            }

            return Array.from(vendorGroups.entries()).map(([vId, vItems]) => (
              <div key={vId} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🏪 {vendorNamesMap[vId] || vId} ({vItems.length} {vItems.length === 1 ? 'item' : 'items'})
                  </div>
                  <span style={{ fontSize: '10px', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                    Separate Token
                  </span>
                </div>

                {vItems.map((item) => (
                  <motion.div
                    key={item.foodItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '10px',
                      border: '1px solid var(--border-light)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)' }}>
                        {item.foodItem.image.startsWith('http') || item.foodItem.image.startsWith('/') ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={item.foodItem.image} alt={item.foodItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            {item.foodItem.image}
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '2px',
                            border: `1.5px solid ${item.foodItem.isVeg ? '#16A34A' : '#DC2626'}`,
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
                              backgroundColor: item.foodItem.isVeg ? '#16A34A' : '#DC2626'
                            }} />
                          </span>
                          <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>{item.foodItem.name}</span>
                        </div>
                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '14px', marginTop: '2px' }}>₹{item.foodItem.price}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <button
                        onClick={() => removeItem(item.foodItem.id)}
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: '10px', border: '1px solid var(--border-medium)' }}>
                        <button
                          onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: '800', minWidth: '16px', textAlign: 'center', fontSize: '14px', color: 'var(--primary)' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ));
          })()}
        </AnimatePresence>

        {/* ML SMART CART RECOMMENDATIONS / PAIRINGS */}
        {smartPairings.length > 0 && (
          <div style={{ margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Sparkles size={16} color="var(--primary)" />
              <h3 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>AI Recommended Pairings</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {smartPairings.map((pairing) => (
                <div 
                  key={pairing.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: '14px',
                    padding: '12px',
                    border: '1px dashed var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{pairing.image}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{pairing.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{pairing.reason}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddPairingToCart(pairing)}
                    style={{
                      backgroundColor: 'rgba(252, 128, 25, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add ₹{pairing.discountPrice || pairing.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Type Selection */}
        <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '20px 0 10px 0', color: 'var(--text-primary)' }}>Select Pickup Style</h3>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div
            onClick={() => setOrderType('plate')}
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-surface)',
              padding: '14px',
              borderRadius: '16px',
              border: `2px solid ${orderType === 'plate' ? 'var(--primary)' : 'var(--border-light)'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '22px' }}>🍽</span>
            <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>Plate Pickup</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Dine-in at Canteen</span>
          </div>

          <div
            onClick={() => setOrderType('parcel')}
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-surface)',
              padding: '14px',
              borderRadius: '16px',
              border: `2px solid ${orderType === 'parcel' ? 'var(--primary)' : 'var(--border-light)'}`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '22px' }}>📦</span>
            <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>Parcel Pack</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>+₹8 Packaging</span>
          </div>
        </div>

        {/* Promo Code */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Promo code (e.g. ELITE10)"
            style={{
              flex: 1,
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              padding: '12px 16px',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleApplyCoupon}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>

        {/* Bill Details */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Bill Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            <span>Item Total</span>
            <span>₹{itemTotal}</span>
          </div>
          {orderType === 'parcel' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <span>Parcel Packaging Charge</span>
              <span>₹{PARCEL_CHARGE}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
            <span>Platform Fee</span>
            <span>₹{PLATFORM_FEE}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#16A34A', fontWeight: '700' }}>
              <span>Discount ({offerDetails.appliedOffer?.code || 'OFFER'})</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '16px', color: 'var(--primary)' }}>
            <span>To Pay</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Floating Proceed Button */}
      <div style={{ position: 'fixed', bottom: '75px', left: 0, right: 0, padding: '14px 20px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', zIndex: 60 }}>
        <button
          onClick={() => router.push(`/checkout?type=${orderType}&total=${grandTotal}`)}
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
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-colored)'
          }}
        >
          Proceed to Checkout ₹{grandTotal.toFixed(2)} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
