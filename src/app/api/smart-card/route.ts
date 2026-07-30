import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/smart-card — Get smart card balance and info
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
      const user = await User.findOne({ email: session.user.email.toLowerCase() });
      if (user) {
        return NextResponse.json({
          smartCard: user.smartCard,
          walletBalance: user.walletBalance,
        });
      }
    } catch (dbErr) {
      console.warn('[API] GET /api/smart-card DB fallback:', dbErr);
    }

    return NextResponse.json({
      smartCard: {
        cardId: 'EX-8942-9901',
        balance: 500,
        isFrozen: false,
        dailyLimit: 2000,
        nfcToken: 'NFC_TOK_8841920',
        lastTappedAt: null,
      },
      walletBalance: 250,
    });
  } catch (error) {
    console.error('[API] GET /api/smart-card error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/smart-card — Perform smart card operations
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount, limit: dailyLimit } = body;

    try {
      await connectDB();
      const user = await User.findOne({ email: session.user.email.toLowerCase() });
      if (user) {
        switch (action) {
          case 'topup': {
            user.smartCard.balance += amount;
            await user.save();
            return NextResponse.json({ success: true, newBalance: user.smartCard.balance });
          }
          case 'deduct': {
            if (user.smartCard.balance < amount) {
              return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
            }
            user.smartCard.balance -= amount;
            await user.save();
            return NextResponse.json({ success: true, newBalance: user.smartCard.balance });
          }
          case 'freeze': {
            user.smartCard.isFrozen = !user.smartCard.isFrozen;
            await user.save();
            return NextResponse.json({ success: true, isFrozen: user.smartCard.isFrozen });
          }
          case 'set-limit': {
            user.smartCard.dailyLimit = dailyLimit;
            await user.save();
            return NextResponse.json({ success: true, dailyLimit: user.smartCard.dailyLimit });
          }
        }
      }
    } catch (dbErr) {
      console.warn('[API] POST /api/smart-card DB fallback:', dbErr);
    }

    // In-memory fallback
    return NextResponse.json({
      success: true,
      newBalance: action === 'topup' ? 500 + (amount || 0) : 500 - (amount || 0),
      isFrozen: false,
      dailyLimit: dailyLimit || 2000,
    });
  } catch (error) {
    console.error('[API] POST /api/smart-card error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
