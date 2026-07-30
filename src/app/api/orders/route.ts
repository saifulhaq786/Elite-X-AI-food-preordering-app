import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import QRCode from 'qrcode';

// Mock in-memory orders store for when DB is offline
const inMemoryOrders: Record<string, unknown>[] = [];

function generateOrderNumber(): string {
  const prefixes = ['AP', 'MS', 'CK', 'TT', 'RK', 'CP', 'SH', 'GB'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${prefix}${number}`;
}

// GET /api/orders — Get orders for current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
      const user = await User.findOne({ email: session.user.email.toLowerCase() });
      if (user) {
        const { searchParams } = new URL(request.url);
        const vendorSlug = searchParams.get('vendorSlug');

        let query: Record<string, unknown> = {};
        if (user.role === 'vendor' && vendorSlug) {
          query = { vendorSlug };
        } else if (user.role === 'admin') {
          if (vendorSlug) query = { vendorSlug };
        } else {
          query = { userId: user._id };
        }

        const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50).lean();
        if (orders.length > 0) {
          const result = orders.map((o) => ({
            id: o._id.toString(),
            orderNumber: o.orderNumber,
            userId: o.userId.toString(),
            vendorId: o.vendorSlug,
            vendorName: o.vendorName,
            items: o.items,
            status: o.status,
            pickupType: o.pickupType,
            pickupTime: o.pickupTime,
            paymentMethod: o.paymentMethod,
            total: o.total,
            platformFee: o.platformFee,
            parcelCharge: o.parcelCharge,
            qrCode: o.qrCode,
            createdAt: o.createdAt.toISOString(),
            updatedAt: o.updatedAt.toISOString(),
          }));
          return NextResponse.json(result);
        }
      }
    } catch (dbErr) {
      console.warn('[API] GET /api/orders DB fallback:', dbErr);
    }

    return NextResponse.json(inMemoryOrders);
  } catch (error) {
    console.error('[API] GET /api/orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders — Place a new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vendorSlug, vendorName, items, pickupType, pickupTime, paymentMethod, total, platformFee, parcelCharge, paymentId } = body;

    if (!vendorSlug || !vendorName || !items?.length || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderNum = generateOrderNumber();
    const orderId = 'ord_' + Date.now();

    // Generate QR code for this order
    let qrCode = '';
    try {
      const qrData = JSON.stringify({
        orderId,
        orderNumber: orderNum,
        vendor: vendorSlug,
        total,
      });
      qrCode = await QRCode.toDataURL(qrData, { width: 200, margin: 2 });
    } catch {
      qrCode = '';
    }

    const now = new Date().toISOString();

    const newOrderResponse = {
      id: orderId,
      orderNumber: orderNum,
      userId: 'u_101',
      vendorId: vendorSlug,
      vendorName,
      items,
      status: 'placed',
      pickupType: pickupType || 'plate',
      pickupTime: pickupTime || '12:00 PM - 12:20 PM',
      paymentMethod: paymentMethod || 'upi',
      total,
      platformFee: platformFee ?? 3,
      parcelCharge: parcelCharge ?? 0,
      qrCode,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await connectDB();
      const user = await User.findOne({ email: session.user.email.toLowerCase() });
      if (user) {
        const dbOrder = await Order.create({
          userId: user._id,
          vendorSlug,
          vendorName,
          items,
          status: 'placed',
          pickupType: pickupType || 'plate',
          pickupTime: pickupTime || null,
          paymentMethod: paymentMethod || 'upi',
          paymentId: paymentId || '',
          total,
          platformFee: platformFee ?? 3,
          parcelCharge: parcelCharge ?? 0,
          qrCode,
        });

        await User.findByIdAndUpdate(user._id, { $inc: { orderCount: 1 } });

        const createdResult = {
          id: dbOrder._id.toString(),
          orderNumber: dbOrder.orderNumber,
          userId: dbOrder.userId.toString(),
          vendorId: dbOrder.vendorSlug,
          vendorName: dbOrder.vendorName,
          items: dbOrder.items,
          status: dbOrder.status,
          pickupType: dbOrder.pickupType,
          pickupTime: dbOrder.pickupTime,
          paymentMethod: dbOrder.paymentMethod,
          total: dbOrder.total,
          platformFee: dbOrder.platformFee,
          parcelCharge: dbOrder.parcelCharge,
          qrCode: dbOrder.qrCode,
          createdAt: dbOrder.createdAt.toISOString(),
          updatedAt: dbOrder.updatedAt.toISOString(),
        };

        inMemoryOrders.unshift(createdResult);
        return NextResponse.json(createdResult, { status: 201 });
      }
    } catch (dbErr) {
      console.warn('[API] POST /api/orders DB fallback:', dbErr);
    }

    inMemoryOrders.unshift(newOrderResponse);
    return NextResponse.json(newOrderResponse, { status: 201 });
  } catch (error) {
    console.error('[API] POST /api/orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
