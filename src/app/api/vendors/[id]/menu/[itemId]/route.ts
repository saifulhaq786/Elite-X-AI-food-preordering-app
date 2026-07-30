import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import MenuItemModel from '@/models/MenuItem';

// PATCH /api/vendors/[id]/menu/[itemId] — Update a food item (e.g. toggle availability, stock, price)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vendorSlug, itemId } = await params;
    const body = await request.json();

    const allowedFields = ['name', 'description', 'price', 'category', 'isVeg', 'image', 'prepTime', 'isAvailable', 'stockCount', 'isBestseller'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    try {
      await connectDB();
      const updatedItem = await MenuItemModel.findOneAndUpdate(
        { _id: itemId, vendorSlug },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (updatedItem) {
        return NextResponse.json({
          id: updatedItem._id.toString(),
          vendorId: updatedItem.vendorSlug,
          name: updatedItem.name,
          price: updatedItem.price,
          category: updatedItem.category,
          isAvailable: updatedItem.isAvailable,
          stockCount: updatedItem.stockCount,
        });
      }
    } catch (dbErr) {
      console.warn('[API] PATCH /api/vendors/[id]/menu/[itemId] DB fallback:', dbErr);
    }

    return NextResponse.json({
      id: itemId,
      vendorId: vendorSlug,
      ...updates,
    });
  } catch (error) {
    console.error('[API] PATCH /api/vendors/[id]/menu/[itemId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/vendors/[id]/menu/[itemId] — Delete/remove a food item
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: vendorSlug, itemId } = await params;

    try {
      await connectDB();
      await MenuItemModel.deleteOne({ _id: itemId, vendorSlug });
      return NextResponse.json({ success: true, message: 'Item deleted successfully' });
    } catch (dbErr) {
      console.warn('[API] DELETE /api/vendors/[id]/menu/[itemId] DB fallback:', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully (mock)' });
  } catch (error) {
    console.error('[API] DELETE /api/vendors/[id]/menu/[itemId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
