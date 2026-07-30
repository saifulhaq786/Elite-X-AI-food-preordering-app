import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ISmartCard {
  cardId: string;
  balance: number;
  isFrozen: boolean;
  dailyLimit: number;
  nfcToken: string;
  lastTappedAt: Date | null;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone: string;
  avatar: string;
  college: string;
  role: 'student' | 'vendor' | 'admin';
  vendorSlug?: string;
  walletBalance: number;
  orderCount: number;
  smartCard: ISmartCard;
  createdAt: Date;
  updatedAt: Date;
}

const SmartCardSchema = new Schema<ISmartCard>({
  cardId: { type: String, default: () => 'EX-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000) },
  balance: { type: Number, default: 250 },
  isFrozen: { type: Boolean, default: false },
  dailyLimit: { type: Number, default: 2000 },
  nfcToken: { type: String, default: () => 'NFC_' + Math.random().toString(36).substring(2, 12).toUpperCase() },
  lastTappedAt: { type: Date, default: null },
}, { _id: false });

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: '' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  college: { type: String, default: 'Elite Tech Campus' },
  role: { type: String, enum: ['student', 'vendor', 'admin'], default: 'student' },
  vendorSlug: { type: String, default: '' },
  walletBalance: { type: Number, default: 250, min: 0 },
  orderCount: { type: Number, default: 0, min: 0 },
  smartCard: { type: SmartCardSchema, default: () => ({}) },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
