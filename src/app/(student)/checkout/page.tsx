'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, CreditCard, QrCode, Cpu, ChevronDown, ChevronUp, Loader2, Wallet, CheckCircle2, AlertCircle, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCartStore, type PickupType } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { generate20MinTimeSlots, getBestTimeSlotRecommendation, type TimeSlot } from '@/lib/ml-analytics';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clearCart } = useCartStore();
  const { user, deductSmartCardBalance } = useAuthStore();
  const { placeMultiVendorOrders } = useOrderStore();

  const pickupType = (searchParams?.get('type') as PickupType) || 'plate';
  const totalNum = parseFloat(searchParams?.get('total') || '0');

  const smartBalance = user?.smartCard?.balance ?? 0;
  const walletBalance = user?.walletBalance ?? 250;

  const [expandedSummary, setExpandedSummary] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('smart_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [timeSlots] = useState<TimeSlot[]>(generate20MinTimeSlots);
  const [selectedTime, setSelectedTime] = useState<string | null>(() => {
    const slots = generate20MinTimeSlots();
    return slots.find(s => s.available)?.timeRange || '12:00 PM - 12:20 PM';
  });

  const uniqueVendorIds = Array.from(new Set(items.map(i => i.vendorId || i.foodItem?.vendorId || 'tasty-times')));
  const isMultiVendor = uniqueVendorIds.length > 1;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    const platformFee = 3;
    const parcelCharge = pickupType === 'parcel' ? 8 : 0;
    const grandTotal = totalNum > 0 ? totalNum : 150;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      if (selectedPayment === 'smart_card') {
        // Smart Card Payment Flow
        if (smartBalance < grandTotal) {
          setErrorMsg(`Insufficient Smart Card balance (₹${smartBalance.toFixed(2)}). Please top up or choose online payment.`);
          setIsProcessing(false);
          return;
        }

        const success = await deductSmartCardBalance(grandTotal);
        if (!success) {
          setErrorMsg('Smart Card payment failed. Please check your daily limit or freeze status.');
          setIsProcessing(false);
          return;
        }

        const createdOrders = await placeMultiVendorOrders(
          items,
          pickupType,
          selectedTime,
          platformFee,
          parcelCharge,
          'smart_card'
        );

        clearCart();
        if (createdOrders.length > 1) {
          router.push('/orders');
        } else {
          router.push(`/order/${createdOrders[0].id}`);
        }
      } else if (selectedPayment === 'wallet') {
        // Inbuilt Wallet Payment Flow
        if (walletBalance < grandTotal) {
          setErrorMsg(`Insufficient Wallet balance (₹${walletBalance.toFixed(2)}). Please top up or choose another payment method.`);
          setIsProcessing(false);
          return;
        }

        const createdOrders = await placeMultiVendorOrders(
          items,
          pickupType,
          selectedTime,
          platformFee,
          parcelCharge,
          'wallet'
        );

        clearCart();
        if (createdOrders.length > 1) {
          router.push('/orders');
        } else {
          router.push(`/order/${createdOrders[0].id}`);
        }
      } else {
        // Online Razorpay Payment Flow (UPI / Cards / Wallets)
        await openRazorpayCheckout({
          amount: grandTotal,
          name: 'Campus Canteen Order',
          description: `Pre-order (${items.length} items)`,
          userName: user?.name,
          userEmail: user?.email,
          userPhone: user?.mobile,
          onSuccess: async (paymentId: string) => {
            try {
              const createdOrders = await placeMultiVendorOrders(
                items,
                pickupType,
                selectedTime,
                platformFee,
                parcelCharge,
                selectedPayment,
                paymentId
              );

              clearCart();
              if (createdOrders.length > 1) {
                router.push('/orders');
              } else {
                router.push(`/order/${createdOrders[0].id}`);
              }
            } catch (err) {
              console.error('Order creation error after payment:', err);
              setErrorMsg('Payment succeeded but order creation failed. Contact support.');
            } finally {
              setIsProcessing(false);
            }
          },
          onDismiss: () => {
            setIsProcessing(false);
          },
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const groupMorning = timeSlots.filter(s => s.windowGroup === 'Morning (8-9 AM)');
  const groupLunch = timeSlots.filter(s => s.windowGroup === 'Lunch (12-2 PM)');
  const groupSnacks = timeSlots.filter(s => s.windowGroup === 'Snacks (3:30-5 PM)');

  const paymentMethods = [
    {
      id: 'smart_card',
      icon: <Cpu size={22} color="var(--primary)" />,
      title: 'Smart Tap Card (Offline NFC)',
      subtitle: `Available Balance: ₹${smartBalance.toFixed(2)}`,
      badge: smartBalance >= (totalNum > 0 ? totalNum : 150) ? 'Instant Tap' : 'Low Balance',
      badgeColor: smartBalance >= (totalNum > 0 ? totalNum : 150) ? '#16A34A' : '#DC2626',
    },
    {
      id: 'wallet',
      icon: <Wallet size={22} color="var(--primary)" />,
      title: 'Campus Inbuilt Wallet',
      subtitle: `Available Balance: ₹${walletBalance.toFixed(2)}`,
      badge: walletBalance >= (totalNum > 0 ? totalNum : 150) ? 'Ready' : 'Low Balance',
      badgeColor: walletBalance >= (totalNum > 0 ? totalNum : 150) ? '#16A34A' : '#DC2626',
    },
    {
      id: 'upi',
      icon: <QrCode size={22} color="var(--primary)" />,
      title: 'UPI / GPay / PhonePe / Paytm',
      subtitle: 'Online Instant Payment via Razorpay Gateway',
      badge: 'Razorpay UPI',
      badgeColor: 'var(--primary)',
    },
    {
      id: 'card',
      icon: <CreditCard size={22} color="var(--primary)" />,
      title: 'Credit / Debit Card / NetBanking',
      subtitle: 'Visa, MasterCard, RuPay, Amazon Pay',
      badge: 'Cards',
      badgeColor: '#475569',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '160px', fontFamily: 'Inter, sans-serif' }}>
      {/* Sticky Header */}
      <div style={{ padding: '16px 20px', position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => router.back()} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Checkout Pre-Order</h1>
      </div>

      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errorMsg && (
          <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', padding: '14px', borderRadius: '14px', fontSize: '13px', fontWeight: '700', border: '1px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="#DC2626" />
              <span>{errorMsg}</span>
            </div>
            <Link href="/smart-card" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '11px', backgroundColor: '#DC2626', color: '#FFF', padding: '4px 10px', borderRadius: '8px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                Top Up
              </span>
            </Link>
          </div>
        )}

        {/* Accordion Order Summary */}
        <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border-medium)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div
            onClick={() => setExpandedSummary(!expandedSummary)}
            style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-elevated)' }}
          >
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>Items ({items.length})</div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--primary)' }}>₹{totalNum.toFixed(2)} Total</div>
            </div>
            {expandedSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSummary && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map((i) => (
                <div key={i.foodItem.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>{i.quantity}x {i.foodItem.name}</span>
                  <span style={{ fontWeight: '700' }}>₹{i.foodItem.price * i.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 20-Minute Time Slot Selection */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Select 20-Min Pickup Slot</h3>
            </div>
            <span style={{ fontSize: '10px', backgroundColor: 'rgba(252, 128, 25, 0.1)', color: 'var(--primary)', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
              🤖 AI Predicted
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
            Operating Canteen Windows: 8-9 AM | 12-2 PM | 3:30-5 PM
          </p>

          {/* AI PREDICTED SLOT RECOMMENDATION CARD */}
          {(() => {
            const aiSlot = getBestTimeSlotRecommendation();
            const isSelectedAI = selectedTime === aiSlot.slot;
            return (
              <div style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '16px',
                padding: '14px',
                border: isSelectedAI ? '2px solid #16A34A' : '1px solid var(--primary)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, rgba(252, 128, 25, 0.08) 0%, rgba(255, 255, 255, 0) 100%)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="var(--primary)" />
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>AI Recommended Slot</span>
                  </div>
                  <span suppressHydrationWarning style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#16A34A', color: '#FFF', padding: '2px 8px', borderRadius: '6px' }}>
                    Est. Wait &lt; {aiSlot.estimatedWaitMinutes} min ({aiSlot.confidenceScore}% confidence)
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div suppressHydrationWarning style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>{aiSlot.slot}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Fast-track counter queue for minimal wait
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTime(aiSlot.slot)}
                    style={{
                      backgroundColor: isSelectedAI ? '#16A34A' : 'var(--primary)',
                      color: '#FFF',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {isSelectedAI ? <><CheckCircle2 size={14} /> Selected</> : <><Zap size={14} /> Select AI Slot</>}
                  </button>
                </div>
              </div>
            );
          })()}

          {[
            { label: '🌅 Morning Window (8:00 AM - 9:00 AM)', slots: groupMorning, suffix: ' AM' },
            { label: '☀️ Lunch Window (12:00 PM - 2:00 PM)', slots: groupLunch, suffix: ' PM' },
            { label: '🌆 Evening Snacks (3:30 PM - 5:00 PM)', slots: groupSnacks, suffix: ' PM' },
          ].map(({ label, slots, suffix }) => (
            <div key={label} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', marginBottom: '6px', textTransform: 'uppercase' }}>{label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {slots.map((slot) => {
                  const isAI = slot.timeRange === getBestTimeSlotRecommendation().slot;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTime(slot.timeRange)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '12px',
                        border: selectedTime === slot.timeRange ? '2px solid var(--primary)' : isAI ? '1px solid #16A34A' : '1px solid var(--border-light)',
                        backgroundColor: selectedTime === slot.timeRange ? 'var(--primary)' : 'var(--bg-surface)',
                        color: selectedTime === slot.timeRange ? '#FFF' : 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <span>{slot.timeRange.replace(suffix, '')}</span>
                      {isAI ? (
                        <span style={{ fontSize: '8px', color: selectedTime === slot.timeRange ? '#FFF' : '#16A34A', fontWeight: '800' }}>🤖 AI BEST</span>
                      ) : slot.isPeak ? (
                        <span style={{ fontSize: '8px', opacity: 0.9 }}>PEAK</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0 }}>Select Payment Method</h3>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700' }}>4 Methods Available</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paymentMethods.map((method) => {
              const isSelected = selectedPayment === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? '6px solid var(--primary)' : '2px solid var(--border-medium)',
                    backgroundColor: '#FFF',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }} />

                  <div style={{ backgroundColor: isSelected ? 'rgba(252, 128, 25, 0.1)' : 'var(--bg-elevated)', padding: '10px', borderRadius: '12px' }}>
                    {method.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>{method.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{method.subtitle}</div>
                  </div>

                  <span style={{ fontSize: '10px', fontWeight: '800', color: method.badgeColor, backgroundColor: 'rgba(0,0,0,0.04)', padding: '3px 8px', borderRadius: '6px' }}>
                    {method.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Bottom Pay Action Bar */}
      <div style={{ position: 'fixed', bottom: '75px', left: 0, right: 0, padding: '14px 20px', backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', zIndex: 60 }}>
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          style={{
            width: '100%',
            backgroundColor: 'var(--primary)',
            color: '#FFF',
            border: 'none',
            padding: '16px',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: '800',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            boxShadow: 'var(--shadow-colored)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isProcessing ? 0.7 : 1,
          }}
        >
          {isProcessing ? (
            <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Processing Order...</>
          ) : (
            `Confirm & Pay ₹${(totalNum > 0 ? totalNum : 150).toFixed(2)} via ${selectedPayment === 'smart_card' ? 'Smart Card' : selectedPayment === 'wallet' ? 'Campus Wallet' : 'Razorpay'}`
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: 'var(--text-primary)', textAlign: 'center' }}>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
