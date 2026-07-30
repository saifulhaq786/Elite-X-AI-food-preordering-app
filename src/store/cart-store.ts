import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FoodItem } from '@/data/vendors';

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  vendorId: string;
}

export type PickupType = 'plate' | 'parcel';

interface CartState {
  items: CartItem[];
  pickupType: PickupType;
  pickupTime: string | null;
  couponCode: string | null;
  
  addItem: (item: FoodItem) => void;
  removeItem: (itemId: string) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  getTotal: () => number;
  getItemCount: () => number;
  
  setPickupType: (type: PickupType) => void;
  setPickupTime: (time: string | null) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      pickupType: 'plate',
      pickupTime: null,
      couponCode: null,

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.foodItem.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.foodItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        return { items: [...state.items, { foodItem: item, quantity: 1, vendorId: item.vendorId }] };
      }),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(i => i.foodItem.id !== itemId)
      })),
      
      incrementQuantity: (itemId) => set((state) => ({
        items: state.items.map(i => 
          i.foodItem.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      })),
      
      decrementQuantity: (itemId) => set((state) => ({
        items: state.items.map(i => 
          i.foodItem.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0)
      })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
        } else {
          set((state) => ({
            items: state.items.map(i => i.foodItem.id === itemId ? { ...i, quantity } : i)
          }));
        }
      },
      
      clearCart: () => set({ items: [], pickupTime: null, couponCode: null }),
      
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
      
      setPickupType: (type) => set({ pickupType: type }),
      setPickupTime: (time) => set({ pickupTime: time }),
      applyCoupon: (code) => set({ couponCode: code }),
      removeCoupon: () => set({ couponCode: null }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        length: 0,
        clear: () => {},
        key: () => null
      }),
    }
  )
);
