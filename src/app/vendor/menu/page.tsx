'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  fetchVendorMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItemData,
} from '@/lib/api-client';
import { foodItems as fallbackItems } from '@/data/vendors';

export default function MenuManagement() {
  const { data: session } = useSession();
  const sessionUser = session?.user as Record<string, unknown> | undefined;
  const vendorSlug = (sessionUser?.vendorSlug as string) || 'tasty-times';

  const [items, setItems] = useState<MenuItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  // Add Item Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('140');
  const [category, setCategory] = useState('Main Course');
  const [description, setDescription] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [prepTime, setPrepTime] = useState('12');
  const [stockCount, setStockCount] = useState('50');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadMenu = async () => {
    try {
      setIsLoading(true);
      const data = await fetchVendorMenu(vendorSlug);
      if (data && data.length > 0) {
        setItems(data);
      } else {
        const fallbacks = fallbackItems.filter((i) => i.vendorId === vendorSlug) as unknown as MenuItemData[];
        setItems(fallbacks.length > 0 ? fallbacks : (fallbackItems.slice(0, 4) as unknown as MenuItemData[]));
      }
    } catch (err) {
      console.error('Failed to load menu:', err);
      const fallbacks = fallbackItems.filter((i) => i.vendorId === vendorSlug) as unknown as MenuItemData[];
      setItems(fallbacks.length > 0 ? fallbacks : (fallbackItems.slice(0, 4) as unknown as MenuItemData[]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [vendorSlug]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category || 'Main Course')))];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Optimistic UI update
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, isAvailable: nextStatus } : item));
    triggerToast(`Item marked as ${nextStatus ? 'Available (In Stock)' : 'Unavailable (Out of Stock)'}`);

    try {
      await updateMenuItem(vendorSlug, id, { isAvailable: nextStatus });
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setDeleteModalId(null);
    triggerToast('Item removed from menu');

    try {
      await deleteMenuItem(vendorSlug, id);
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    setIsSubmitting(true);

    try {
      const newItem = await createMenuItem(vendorSlug, {
        name: name.trim(),
        price: Number(price),
        category: category.trim() || 'Main Course',
        description: description.trim(),
        isVeg,
        prepTime: Number(prepTime) || 12,
        stockCount: Number(stockCount) || 50,
        isAvailable: true,
      });

      setItems((prev) => [newItem, ...prev]);
      setIsAddModalOpen(false);
      setName('');
      setDescription('');
      triggerToast(`"${newItem.name}" added to canteen menu!`);
    } catch (err) {
      console.error('Failed to create menu item:', err);
      triggerToast('Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Menu & Food Availability</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
            Manage menu items, prices, and instant stock toggles for {vendorSlug.replace('-', ' ').toUpperCase()}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-colored)',
          }}
        >
          <Plus size={20} />
          Add Food Item
        </button>
      </div>

      {toastMsg && (
        <div style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16A34A', padding: '14px 20px', borderRadius: '12px', fontWeight: '800', border: '1px solid #16A34A', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {toastMsg}
        </div>
      )}

      {/* Categories */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeCategory === cat ? 'var(--primary)' : 'var(--bg-surface)',
              color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ marginTop: '12px', fontWeight: '700' }}>Loading Canteen Menu...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '1.25rem',
                  border: `1px solid ${!item.isAvailable ? '#DC262650' : 'var(--border-light)'}`,
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {!item.isAvailable && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.65)', zIndex: 10, pointerEvents: 'none' }} />
                )}

                <div style={{ height: '140px', backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={48} color="var(--primary)" />
                  )}
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: item.isVeg ? '#16A34A' : '#DC2626',
                    color: 'white',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    zIndex: 20,
                  }}>
                    {item.isVeg ? 'VEG' : 'NON-VEG'}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', zIndex: 20 }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.name}</h3>
                    <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{item.price}</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>{item.description || 'Fresh canteen preparation.'}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', zIndex: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: item.isAvailable ? '#16A34A' : '#DC2626' }}>
                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAvailability(item.id, item.isAvailable)}
                        style={{
                          width: '44px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: item.isAvailable ? 'var(--primary)' : '#94A3B8',
                          border: 'none',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <motion.div
                          initial={false}
                          animate={{ left: item.isAvailable ? '22px' : '2px' }}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            position: 'absolute',
                            top: '2px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          }}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteModalId(item.id)}
                      style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', border: 'none', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700' }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Food Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ backgroundColor: 'var(--bg-surface)', width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>Add New Food Item</h2>
                <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Item Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Paneer Butter Masala"
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Category</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Main Course"
                      style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Served with 2 Butter Naan"
                    style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-medium)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '4px 0' }}>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>
                    <input type="radio" checked={isVeg} onChange={() => setIsVeg(true)} style={{ marginRight: '6px' }} />
                    🥦 Veg
                  </label>
                  <label style={{ fontSize: '13px', fontWeight: '700' }}>
                    <input type="radio" checked={!isVeg} onChange={() => setIsVeg(false)} style={{ marginRight: '6px' }} />
                    🍗 Non-Veg
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#FFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    marginTop: '8px',
                    boxShadow: 'var(--shadow-colored)',
                  }}
                >
                  {isSubmitting ? 'Saving Food Item...' : 'Save & Publish to Canteen Menu'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalId && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '1.25rem', maxWidth: '400px', width: '100%', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-xl)' }}
            >
              <h2 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Remove Item?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to remove this food item from your canteen menu?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button onClick={() => setDeleteModalId(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteModalId)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.5rem', backgroundColor: '#DC2626', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Remove Item</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
