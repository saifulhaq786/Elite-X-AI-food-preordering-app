import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import { vendors as mockVendors } from '@/data/vendors';

// GET /api/vendors/[id] — Get vendor details by slug
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();
    const vendor = await Vendor.findOne({ slug: id }).lean();

    if (vendor) {
      return NextResponse.json({
        id: vendor.slug,
        name: vendor.name,
        tagline: vendor.tagline,
        logo: vendor.logo,
        coverImage: vendor.coverImage,
        rating: vendor.rating,
        reviewCount: vendor.reviewCount,
        cuisineType: vendor.cuisineType,
        cuisine: vendor.cuisine,
        college: vendor.college,
        openingTime: vendor.openingTime,
        closingTime: vendor.closingTime,
        isOpen: vendor.isOpen,
        isAcceptingOrders: vendor.isAcceptingOrders,
        deliveryTypes: vendor.deliveryTypes,
        categories: vendor.categories,
        address: vendor.address,
        phone: vendor.phone,
      });
    }
  } catch (error) {
    console.warn('[API] GET /api/vendors/[id] DB error, using fallback:', error);
  }

  const foundMock = mockVendors.find((v) => v.id === id);
  if (foundMock) {
    return NextResponse.json(foundMock);
  }

  return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
}
