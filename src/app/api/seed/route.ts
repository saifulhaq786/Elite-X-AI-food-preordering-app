import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import MenuItemModel from '@/models/MenuItem';
import { vendors, foodItems } from '@/data/vendors';

// GET /api/seed — Seed MongoDB with vendor and menu data
export async function GET() {
  try {
    await connectDB();

    // Check if already seeded
    const existingVendors = await Vendor.countDocuments();
    if (existingVendors > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded',
        stats: { vendors: existingVendors, menuItems: await MenuItemModel.countDocuments() },
      });
    }

    // Seed Vendors
    const vendorDocs = vendors.map((v) => ({
      slug: v.id,
      name: v.name,
      tagline: v.tagline,
      logo: v.logo,
      coverImage: v.coverImage,
      rating: v.rating,
      reviewCount: v.reviewCount,
      cuisineType: v.cuisineType,
      cuisine: v.cuisine || [v.cuisineType],
      college: v.college || 'Elite Tech Campus',
      openingTime: v.openingTime,
      closingTime: v.closingTime,
      isOpen: v.isOpen,
      isAcceptingOrders: v.isAcceptingOrders ?? true,
      deliveryTypes: v.deliveryTypes,
      categories: v.categories,
      address: v.address,
      phone: v.phone,
      ownerId: 'admin_seeded',
    }));

    await Vendor.insertMany(vendorDocs);

    // Seed Menu Items
    const menuDocs = foodItems.map((item) => ({
      vendorSlug: item.vendorId,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVeg: item.isVeg,
      image: item.image,
      rating: item.rating,
      reviewCount: item.reviewCount,
      prepTime: item.prepTime,
      isAvailable: item.isAvailable,
      stockCount: item.stockCount,
      ingredients: item.ingredients || [],
      nutrition: item.nutrition,
      isBestseller: item.isBestseller || false,
      isNewItem: item.isNew || false,
    }));

    await MenuItemModel.insertMany(menuDocs);

    return NextResponse.json({
      success: true,
      message: 'MongoDB seeded successfully!',
      stats: {
        vendors: vendorDocs.length,
        menuItems: menuDocs.length,
      },
    });
  } catch (error) {
    console.error('[API] Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
