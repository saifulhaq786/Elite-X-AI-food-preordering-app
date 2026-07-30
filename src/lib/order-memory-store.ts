// Shared in-memory fallback store for orders across API routes
export interface InMemoryOrder {
  id: string;
  orderNumber: string;
  userId: string;
  vendorId: string;
  vendorSlug: string;
  vendorName: string;
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    isVeg?: boolean;
  }>;
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

const globalOrderStore: InMemoryOrder[] = [];

export function getInMemoryOrders(): InMemoryOrder[] {
  return globalOrderStore;
}

export function addInMemoryOrder(order: InMemoryOrder): void {
  globalOrderStore.unshift(order);
}

export function findInMemoryOrder(id: string): InMemoryOrder | undefined {
  return globalOrderStore.find((o) => o.id === id || o.orderNumber === id);
}

export function updateInMemoryOrderStatus(id: string, status: string): InMemoryOrder | undefined {
  const order = globalOrderStore.find((o) => o.id === id || o.orderNumber === id);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
  }
  return order;
}
