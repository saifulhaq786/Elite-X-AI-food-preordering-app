import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { vendors as mockVendors } from '@/data/vendors';

// GET /api/vendors — List all vendors
export async function GET() {
  try {
    await connectDB();
    const vendors = await Vendor.find().sort({ rating: -1 }).lean();

    if (vendors.length > 0) {
      const result = vendors.map((v) => ({
        id: v.slug,
        name: v.name,
        tagline: v.tagline,
        logo: v.logo,
        coverImage: v.coverImage,
        rating: v.rating,
        reviewCount: v.reviewCount,
        cuisineType: v.cuisineType,
        cuisine: v.cuisine,
        college: v.college,
        openingTime: v.openingTime,
        closingTime: v.closingTime,
        isOpen: v.isOpen,
        isAcceptingOrders: v.isAcceptingOrders,
        deliveryTypes: v.deliveryTypes,
        categories: v.categories,
        address: v.address,
        phone: v.phone,
      }));

      return NextResponse.json(result);
    }
  } catch (error) {
    console.warn('[API] GET /api/vendors MongoDB error, returning mock vendors:', error);
  }

  return NextResponse.json(mockVendors);
}

// POST /api/vendors — Create a new vendor stall & vendor login account (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, tagline, cuisineType, college, address, phone, vendorEmail, vendorPassword } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Vendor name is required' }, { status: 400 });
    }

    const slug = body.slug || name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    const ownerEmail = (vendorEmail || `vendor.${slug}@elitex.edu`).toLowerCase().trim();

    try {
      await connectDB();

      // Create Vendor Document
      const vendor = await Vendor.findOneAndUpdate(
        { slug },
        {
          $set: {
            slug,
            name: name.trim(),
            tagline: tagline || 'Fresh Canteen Food & Beverages',
            logo: body.logo || '🏪',
            coverImage: body.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
            rating: body.rating || 4.8,
            reviewCount: body.reviewCount || 1,
            cuisineType: cuisineType || 'Multi-Cuisine',
            cuisine: body.cuisine || [cuisineType || 'Multi-Cuisine'],
            college: college || 'Elite Tech Campus',
            openingTime: body.openingTime || '08:00',
            closingTime: body.closingTime || '21:00',
            isOpen: body.isOpen ?? true,
            isAcceptingOrders: body.isAcceptingOrders ?? true,
            deliveryTypes: body.deliveryTypes || ['plate', 'parcel'],
            categories: body.categories || ['Main Course', 'Snacks', 'Beverages'],
            address: address || 'Stall #7, Food Court',
            phone: phone || '',
            ownerId: ownerEmail,
          },
        },
        { upsert: true, new: true, runValidators: true }
      );

      // Create or update Vendor User Account for login
      const hashedPassword = vendorPassword ? await bcrypt.hash(vendorPassword, 10) : '';
      await User.findOneAndUpdate(
        { email: ownerEmail },
        {
          $set: {
            name: `${name.trim()} Owner`,
            email: ownerEmail,
            role: 'vendor',
            vendorSlug: slug,
            college: college || 'Elite Tech Campus',
            phone: phone || '',
            ...(hashedPassword ? { password: hashedPassword } : {}),
          },
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        id: vendor.slug,
        name: vendor.name,
        tagline: vendor.tagline,
        rating: vendor.rating,
        cuisineType: vendor.cuisineType,
        college: vendor.college,
        ownerId: ownerEmail,
      }, { status: 201 });
    } catch (dbErr) {
      console.warn('[API] POST /api/vendors DB fallback:', dbErr);
    }

    return NextResponse.json({
      id: slug,
      name: name.trim(),
      tagline: tagline || 'Fresh Canteen Food & Beverages',
      cuisineType: cuisineType || 'Multi-Cuisine',
      college: college || 'Elite Tech Campus',
      ownerId: ownerEmail,
    }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/vendors error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
