/**
 * API Client — Typed fetch wrappers for all backend API routes.
 * Used by client components instead of direct Firestore calls.
 */

// ============================================================
// TYPES (matching API response shapes)
// ============================================================

export interface SmartCardData {
  cardId: string;
  balance: number;
  isFrozen: boolean;
  dailyLimit: number;
  nfcToken: string;
  lastTappedAt: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  college: string;
  role: 'student' | 'vendor' | 'admin';
  walletBalance: number;
  orderCount: number;
  smartCard: SmartCardData;
}

export interface VendorData {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  cuisineType: string;
  cuisine: string[];
  college: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  isAcceptingOrders: boolean;
  deliveryTypes: ('plate' | 'parcel')[];
  categories: string[];
  address: string;
  phone: string;
}

export interface MenuItemData {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  rating: number;
  reviewCount: number;
  prepTime: number;
  isAvailable: boolean;
  stockCount: number;
  ingredients: string[];
  nutrition?: { calories: number; protein: string; carbs: string; fat: string };
  isBestseller?: boolean;
  isNewItem?: boolean;
}

export interface OrderItemData {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId: string;
  vendorId: string;
  vendorName: string;
  items: OrderItemData[];
  status: string;
  pickupType: 'plate' | 'parcel';
  pickupTime: string | null;
  paymentMethod: string;
  total: number;
  platformFee: number;
  parcelCharge: number;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// HELPER
// ============================================================

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorBody.error || `API error ${res.status}`);
  }

  return res.json();
}

// ============================================================
// USER PROFILE
// ============================================================

export async function fetchUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/users/me');
}

export async function updateUserProfile(data: Partial<Pick<UserProfile, 'name' | 'phone' | 'college' | 'avatar'>>): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ============================================================
// VENDORS
// ============================================================

export async function fetchVendors(): Promise<VendorData[]> {
  return apiFetch<VendorData[]>('/api/vendors');
}

export async function createVendor(data: Partial<VendorData> & { name: string; slug?: string }): Promise<VendorData> {
  return apiFetch<VendorData>('/api/vendors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchVendorById(id: string): Promise<VendorData> {
  return apiFetch<VendorData>(`/api/vendors/${id}`);
}

export async function fetchVendorMenu(vendorId: string): Promise<MenuItemData[]> {
  return apiFetch<MenuItemData[]>(`/api/vendors/${vendorId}/menu`);
}

export async function createMenuItem(
  vendorId: string,
  data: {
    name: string;
    price: number;
    category: string;
    description?: string;
    isVeg?: boolean;
    image?: string;
    prepTime?: number;
    isAvailable?: boolean;
    stockCount?: number;
  }
): Promise<MenuItemData> {
  return apiFetch<MenuItemData>(`/api/vendors/${vendorId}/menu`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMenuItem(
  vendorId: string,
  itemId: string,
  data: Partial<MenuItemData>
): Promise<MenuItemData> {
  return apiFetch<MenuItemData>(`/api/vendors/${vendorId}/menu/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteMenuItem(vendorId: string, itemId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/api/vendors/${vendorId}/menu/${itemId}`, {
    method: 'DELETE',
  });
}

// ============================================================
// ORDERS
// ============================================================

export async function fetchOrders(vendorSlug?: string): Promise<OrderData[]> {
  const url = vendorSlug ? `/api/orders?vendorSlug=${vendorSlug}` : '/api/orders';
  return apiFetch<OrderData[]>(url);
}

export async function fetchOrderById(id: string): Promise<OrderData> {
  return apiFetch<OrderData>(`/api/orders/${id}`);
}

export async function createOrder(data: {
  vendorSlug: string;
  vendorName: string;
  items: OrderItemData[];
  pickupType: 'plate' | 'parcel';
  pickupTime: string | null;
  paymentMethod: string;
  paymentId?: string;
  total: number;
  platformFee: number;
  parcelCharge: number;
}): Promise<OrderData> {
  return apiFetch<OrderData>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(orderId: string, status: string): Promise<{ id: string; status: string }> {
  return apiFetch<{ id: string; status: string }>(`/api/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function cancelOrder(orderId: string): Promise<{ id: string; status: string; message: string }> {
  return apiFetch<{ id: string; status: string; message: string }>(`/api/orders/${orderId}/cancel`, {
    method: 'POST',
  });
}

// ============================================================
// SMART CARD
// ============================================================

export async function fetchSmartCard(): Promise<{ smartCard: SmartCardData; walletBalance: number }> {
  return apiFetch<{ smartCard: SmartCardData; walletBalance: number }>('/api/smart-card');
}

export async function topUpSmartCard(amount: number): Promise<{ success: boolean; newBalance: number }> {
  return apiFetch<{ success: boolean; newBalance: number }>('/api/smart-card', {
    method: 'POST',
    body: JSON.stringify({ action: 'topup', amount }),
  });
}

export async function deductSmartCard(amount: number): Promise<{ success: boolean; newBalance: number }> {
  return apiFetch<{ success: boolean; newBalance: number }>('/api/smart-card', {
    method: 'POST',
    body: JSON.stringify({ action: 'deduct', amount }),
  });
}

export async function toggleSmartCardFreeze(): Promise<{ success: boolean; isFrozen: boolean }> {
  return apiFetch<{ success: boolean; isFrozen: boolean }>('/api/smart-card', {
    method: 'POST',
    body: JSON.stringify({ action: 'freeze' }),
  });
}

export async function setSmartCardDailyLimit(limit: number): Promise<{ success: boolean; dailyLimit: number }> {
  return apiFetch<{ success: boolean; dailyLimit: number }>('/api/smart-card', {
    method: 'POST',
    body: JSON.stringify({ action: 'set-limit', limit }),
  });
}

// ============================================================
// SEED
// ============================================================

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>('/api/seed');
}
