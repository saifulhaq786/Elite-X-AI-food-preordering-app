import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, PickupType } from './cart-store';
import {
  createOrder as apiCreateOrder,
  fetchOrders as apiFetchOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  cancelOrder as apiCancelOrder,
  fetchOrderById as apiFetchOrderById,
  type OrderData,
} from '@/lib/api-client';

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  pickupType: PickupType;
  type?: PickupType;
  pickupTime: string | null;
  paymentMethod?: 'smart_card' | 'upi' | 'card' | 'wallet';
  total: number;
  platformFee: number;
  parcelCharge: number;
  createdAt: string;
  qrCode: string;
}

// Convert API OrderData to local Order shape
function orderDataToOrder(data: OrderData): Order {
  return {
    id: data.id,
    orderNumber: data.orderNumber,
    items: data.items.map((item) => ({
      foodItem: {
        id: item.itemId,
        vendorId: data.vendorId,
        name: item.name,
        description: '',
        price: item.price,
        category: '',
        isVeg: item.isVeg,
        image: item.image,
        rating: 0,
        reviewCount: 0,
        prepTime: 0,
        isAvailable: true,
        stockCount: 0,
        ingredients: [],
      },
      quantity: item.quantity,
      vendorId: data.vendorId,
    })),
    vendorId: data.vendorId,
    vendorName: data.vendorName,
    status: data.status as OrderStatus,
    pickupType: data.pickupType,
    type: data.pickupType,
    pickupTime: data.pickupTime,
    paymentMethod: data.paymentMethod as Order['paymentMethod'],
    total: data.total,
    platformFee: data.platformFee,
    parcelCharge: data.parcelCharge,
    createdAt: data.createdAt,
    qrCode: data.qrCode,
  };
}

interface OrderState {
  orders: Order[];
  activeOrder: Order | null;
  isLoading: boolean;

  placeOrder: (
    items: CartItem[],
    vendorId: string,
    vendorName: string,
    pickupType: PickupType,
    pickupTime: string | null,
    total: number,
    platformFee: number,
    parcelCharge: number,
    paymentMethod?: string,
    paymentId?: string,
  ) => Promise<Order>;

  loadUserOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  getActiveOrders: () => Order[];
  getOrderHistory: () => Order[];
  setActiveOrder: (order: Order | null) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrder: null,
      isLoading: false,

      placeOrder: async (items, vendorId, vendorName, pickupType, pickupTime, total, platformFee, parcelCharge, paymentMethod, paymentId) => {
        set({ isLoading: true });

        try {
          const orderItems = items.map((item) => ({
            itemId: item.foodItem.id,
            name: item.foodItem.name,
            price: item.foodItem.price,
            quantity: item.quantity,
            image: item.foodItem.image,
            isVeg: item.foodItem.isVeg,
          }));

          const orderData = await apiCreateOrder({
            vendorSlug: vendorId,
            vendorName,
            items: orderItems,
            pickupType,
            pickupTime,
            paymentMethod: paymentMethod || 'upi',
            paymentId: paymentId || '',
            total,
            platformFee,
            parcelCharge,
          });

          const newOrder = orderDataToOrder(orderData);

          set((state) => ({
            orders: [newOrder, ...state.orders],
            activeOrder: newOrder,
            isLoading: false,
          }));

          return newOrder;
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to place order:', error);
          throw error;
        }
      },

      loadUserOrders: async () => {
        set({ isLoading: true });
        try {
          const apiOrders = await apiFetchOrders();
          const orders = apiOrders.map(orderDataToOrder);
          set({ orders, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to load orders:', error);
        }
      },

      updateOrderStatus: async (orderId, status) => {
        // Optimistic update
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          );
          const updatedActive =
            state.activeOrder?.id === orderId ? { ...state.activeOrder, status } : state.activeOrder;
          return { orders: updatedOrders, activeOrder: updatedActive };
        });

        try {
          await apiUpdateOrderStatus(orderId, status);
        } catch (error) {
          console.error('Failed to update order status:', error);
        }
      },

      cancelOrder: async (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: 'cancelled' as OrderStatus } : order
          ),
          activeOrder:
            state.activeOrder?.id === orderId
              ? { ...state.activeOrder, status: 'cancelled' as OrderStatus }
              : state.activeOrder,
        }));

        try {
          await apiCancelOrder(orderId);
        } catch (error) {
          console.error('Failed to cancel order:', error);
        }
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },

      getActiveOrders: () => {
        const activeStatuses: OrderStatus[] = ['placed', 'accepted', 'preparing', 'ready'];
        return get().orders.filter((order) => activeStatuses.includes(order.status));
      },

      getOrderHistory: () => {
        const historyStatuses: OrderStatus[] = ['delivered', 'completed', 'cancelled'];
        return get().orders.filter((order) => historyStatuses.includes(order.status));
      },

      setActiveOrder: (order) => {
        set({ activeOrder: order });
      },
    }),
    {
      name: 'order-storage-v3',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
              length: 0,
              clear: () => {},
              key: () => null,
            }
      ),
    }
  )
);
