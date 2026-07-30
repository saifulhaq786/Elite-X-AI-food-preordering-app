import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  isVeg: boolean;
}

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'delivered';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  vendorSlug: string;
  vendorName: string;
  items: IOrderItem[];
  status: OrderStatus;
  pickupType: 'plate' | 'parcel';
  pickupTime: string | null;
  paymentMethod: string;
  paymentId: string;
  total: number;
  platformFee: number;
  parcelCharge: number;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

function generateOrderNumber(): string {
  const prefixes = ['AP', 'MS', 'CK', 'TT', 'RK', 'CP', 'SH', 'GB'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${prefix}${number}`;
}

const OrderItemSchema = new Schema<IOrderItem>({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  isVeg: { type: Boolean, default: true },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true, default: generateOrderNumber },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vendorSlug: { type: String, required: true, index: true },
  vendorName: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true, validate: [(v: IOrderItem[]) => v.length > 0, 'Order must have at least one item'] },
  status: {
    type: String,
    enum: ['placed', 'accepted', 'preparing', 'ready', 'completed', 'cancelled', 'delivered'],
    default: 'placed',
    index: true,
  },
  pickupType: { type: String, enum: ['plate', 'parcel'], default: 'plate' },
  pickupTime: { type: String, default: null },
  paymentMethod: { type: String, default: 'upi' },
  paymentId: { type: String, default: '' },
  total: { type: Number, required: true, min: 0 },
  platformFee: { type: Number, default: 3, min: 0 },
  parcelCharge: { type: Number, default: 0, min: 0 },
  qrCode: { type: String, default: '' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ vendorSlug: 1, status: 1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
