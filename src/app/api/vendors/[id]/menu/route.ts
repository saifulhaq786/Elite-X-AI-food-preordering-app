import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import MenuItemModel from '@/models/MenuItem';
import User from '@/models/User';
import { foodItems as mockFoodItems } from '@/data/vendors';

// GET /api/vendors/[id]/menu — Get menu items for a vendor
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();
    const items = await MenuItemModel.find({ vendorSlug: id }).sort({ isBestseller: -1, rating: -1 }).lean();

    if (items.length > 0) {
      const result = items.map((item) => ({
        id: item._id.toString(),
        vendorId: item.vendorSlug,
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
        ingredients: item.ingredients,
        nutrition: item.nutrition,
        isBestseller: item.isBestseller,
        isNewItem: item.isNewItem,
      }));

      return NextResponse.json(result);
    }
  } catch (error) {
    console.warn('[API] GET /api/vendors/[id]/menu DB error, returning mock food items:', error);
  }

  const mockItems = mockFoodItems.filter((i) => i.vendorId === id);
  return NextResponse.json(mockItems);
}

// POST /api/vendors/[id]/menu — Add a new food item to a vendor's menu
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vendorSlug } = await params;
    const body = await request.json();
    const { name, price, category, description, isVeg, image, prepTime, isAvailable, stockCount } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    try {
      await connectDB();
      const newItem = await MenuItemModel.create({
        vendorSlug,
        name: name.trim(),
        description: description || '',
        price: Number(price),
        category: category.trim(),
        isVeg: isVeg ?? true,
        image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        rating: 4.8,
        reviewCount: 1,
        prepTime: Number(prepTime) || 12,
        isAvailable: isAvailable ?? true,
        stockCount: Number(stockCount) || 50,
        ingredients: body.ingredients || [],
        isBestseller: body.isBestseller || false,
        isNewItem: true,
      });

      return NextResponse.json({
        id: newItem._id.toString(),
        vendorId: newItem.vendorSlug,
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        category: newItem.category,
        isVeg: newItem.isVeg,
        image: newItem.image,
        rating: newItem.rating,
        prepTime: newItem.prepTime,
        isAvailable: newItem.isAvailable,
        stockCount: newItem.stockCount,
      }, { status: 201 });
    } catch (dbErr) {
      console.warn('[API] POST /api/vendors/[id]/menu DB fallback:', dbErr);
    }

    return NextResponse.json({
      id: 'item_' + Date.now(),
      vendorId: vendorSlug,
      name,
      price: Number(price),
      category,
      isVeg: isVeg ?? true,
      isAvailable: isAvailable ?? true,
    }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/vendors/[id]/menu error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
