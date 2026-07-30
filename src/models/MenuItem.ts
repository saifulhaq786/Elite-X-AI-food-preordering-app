import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface INutrition {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface IMenuItem extends Document {
  _id: mongoose.Types.ObjectId;
  vendorSlug: string;
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
  nutrition?: INutrition;
  isBestseller: boolean;
  isNewItem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>({
  vendorSlug: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  isVeg: { type: Boolean, default: true },
  image: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  prepTime: { type: Number, default: 10, min: 0 },
  isAvailable: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0, min: 0 },
  ingredients: [{ type: String }],
  nutrition: {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
  },
  isBestseller: { type: Boolean, default: false },
  isNewItem: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

MenuItemSchema.index({ vendorSlug: 1, category: 1 });
MenuItemSchema.index({ vendorSlug: 1, isAvailable: 1 });

const MenuItem: Model<IMenuItem> = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
