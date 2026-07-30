import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IVendor extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
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
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>({
  slug: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  tagline: { type: String, default: '' },
  logo: { type: String, default: '🍽️' },
  coverImage: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  cuisineType: { type: String, default: '' },
  cuisine: [{ type: String }],
  college: { type: String, default: 'Elite Tech Campus' },
  openingTime: { type: String, default: '08:00' },
  closingTime: { type: String, default: '21:00' },
  isOpen: { type: Boolean, default: true },
  isAcceptingOrders: { type: Boolean, default: true },
  deliveryTypes: [{ type: String, enum: ['plate', 'parcel'] }],
  categories: [{ type: String }],
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  ownerId: { type: String, default: '' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

VendorSchema.index({ slug: 1 }, { unique: true });
VendorSchema.index({ college: 1 });
VendorSchema.index({ ownerId: 1 });

const Vendor: Model<IVendor> = mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);

export default Vendor;
