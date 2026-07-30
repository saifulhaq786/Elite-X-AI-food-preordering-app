import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

// POST /api/orders/[id]/cancel — Cancel an order
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const user = await User.findOne({ email: session.user.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify ownership (students can cancel their own, vendors/admins can cancel any)
    if (user.role === 'student' && order.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only cancel orders that are not already completed/delivered/cancelled
    const nonCancellable = ['completed', 'delivered', 'cancelled'];
    if (nonCancellable.includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot cancel order with status "${order.status}"` },
        { status: 400 }
      );
    }

    order.status = 'cancelled';
    await order.save();

    return NextResponse.json({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('[API] POST /api/orders/[id]/cancel error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
