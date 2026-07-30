import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || 'saifulhaqff@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

// GET /api/users/me — Fetch current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(email);
    const sessionUser = session.user as Record<string, unknown>;

    try {
      await connectDB();
      let user = await User.findOne({ email });

      if (!user) {
        // Auto-create user if not found in DB
        user = await User.create({
          name: session.user.name || (isAdmin ? 'Campus Admin' : 'Alex Mercer'),
          email,
          avatar: session.user.image || '',
          college: (sessionUser.college as string) || 'Elite Tech Campus',
          role: isAdmin ? 'admin' : (sessionUser.role as 'student' | 'vendor' | 'admin') || 'student',
          walletBalance: isAdmin ? 5000 : 250,
        });
      }

      return NextResponse.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '9876543210',
        avatar: user.avatar,
        college: user.college || 'Elite Tech Campus',
        role: user.role,
        walletBalance: user.walletBalance,
        orderCount: user.orderCount,
        smartCard: user.smartCard || {
          cardId: 'EX-8942-9901',
          balance: isAdmin ? 5000 : 500,
          isFrozen: false,
          dailyLimit: 2000,
          nfcToken: 'NFC_TOK_8841920',
          lastTappedAt: null,
        },
        createdAt: user.createdAt,
      });
    } catch (dbError) {
      console.warn('[API] MongoDB unavailable, returning session fallback user profile:', dbError);

      // Fallback response when MongoDB is not connected/available
      return NextResponse.json({
        id: (sessionUser.id as string) || (isAdmin ? 'a_101' : 'u_101'),
        name: session.user.name || (isAdmin ? 'Campus Admin' : 'Alex Mercer'),
        email,
        phone: '9876543210',
        avatar: session.user.image || '',
        college: (sessionUser.college as string) || 'Elite Tech Campus',
        role: isAdmin ? 'admin' : (sessionUser.role as string) || 'student',
        walletBalance: isAdmin ? 5000 : 250,
        orderCount: 12,
        smartCard: {
          cardId: 'EX-8942-9901',
          balance: isAdmin ? 5000 : 500,
          isFrozen: false,
          dailyLimit: 2000,
          nfcToken: 'NFC_TOK_8841920',
          lastTappedAt: null,
        },
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('[API] GET /api/users/me fatal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/users/me — Update current user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const email = session.user.email.toLowerCase();

    // Whitelist allowed fields
    const allowedFields = ['name', 'phone', 'college', 'avatar'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    try {
      await connectDB();
      const user = await User.findOneAndUpdate(
        { email },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (user) {
        return NextResponse.json({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          college: user.college,
          role: user.role,
          walletBalance: user.walletBalance,
          orderCount: user.orderCount,
          smartCard: user.smartCard,
        });
      }
    } catch (dbErr) {
      console.warn('[API] MongoDB patch fallback:', dbErr);
    }

    return NextResponse.json({
      id: 'u_101',
      name: body.name || session.user.name || 'Campus User',
      email,
      phone: body.phone || '9876543210',
      avatar: body.avatar || session.user.image || '',
      college: body.college || 'Elite Tech Campus',
      role: 'student',
      walletBalance: 250,
      orderCount: 12,
      smartCard: {
        cardId: 'EX-8942-9901',
        balance: 500,
        isFrozen: false,
        dailyLimit: 2000,
        nfcToken: 'NFC_TOK_8841920',
        lastTappedAt: null,
      },
    });
  } catch (error) {
    console.error('[API] PATCH /api/users/me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
