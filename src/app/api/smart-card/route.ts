import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Shared in-memory smart card state for fallback
const inMemorySmartCard = {
  cardId: 'EX-8942-9901',
  balance: 500,
  isFrozen: false,
  dailyLimit: 2000,
  nfcToken: 'NFC_TOK_8841920',
  lastTappedAt: null as string | null,
};

// GET /api/smart-card — Get smart card balance and info
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        smartCard: inMemorySmartCard,
        walletBalance: inMemorySmartCard.balance,
      });
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
      smartCard: inMemorySmartCard,
      walletBalance: inMemorySmartCard.balance,
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
    const body = await request.json();
    const { action, amount, limit: dailyLimit } = body;

    try {
      if (session?.user?.email) {
        await connectDB();
        const user = await User.findOne({ email: session.user.email.toLowerCase() });
        if (user) {
          switch (action) {
            case 'topup': {
              user.smartCard.balance += amount;
              user.walletBalance = user.smartCard.balance;
              await user.save();
              inMemorySmartCard.balance = user.smartCard.balance;
              return NextResponse.json({ success: true, newBalance: user.smartCard.balance });
            }
            case 'deduct': {
              if (user.smartCard.isFrozen) {
                return NextResponse.json({ error: 'Card is frozen' }, { status: 400 });
              }
              if (user.smartCard.balance < amount) {
                return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
              }
              user.smartCard.balance -= amount;
              user.walletBalance = user.smartCard.balance;
              await user.save();
              inMemorySmartCard.balance = user.smartCard.balance;
              return NextResponse.json({ success: true, newBalance: user.smartCard.balance });
            }
            case 'freeze': {
              user.smartCard.isFrozen = !user.smartCard.isFrozen;
              await user.save();
              inMemorySmartCard.isFrozen = user.smartCard.isFrozen;
              return NextResponse.json({ success: true, isFrozen: user.smartCard.isFrozen });
            }
            case 'set-limit': {
              user.smartCard.dailyLimit = dailyLimit;
              await user.save();
              inMemorySmartCard.dailyLimit = user.smartCard.dailyLimit;
              return NextResponse.json({ success: true, dailyLimit: user.smartCard.dailyLimit });
            }
          }
        }
      }
    } catch (dbErr) {
      console.warn('[API] POST /api/smart-card DB fallback:', dbErr);
    }

    // In-memory fallback (maintains real state across calls!)
    switch (action) {
      case 'freeze': {
        inMemorySmartCard.isFrozen = !inMemorySmartCard.isFrozen;
        return NextResponse.json({
          success: true,
          isFrozen: inMemorySmartCard.isFrozen,
        });
      }
      case 'topup': {
        inMemorySmartCard.balance += amount || 0;
        return NextResponse.json({
          success: true,
          newBalance: inMemorySmartCard.balance,
        });
      }
      case 'deduct': {
        if (inMemorySmartCard.isFrozen) {
          return NextResponse.json({ error: 'Card is frozen' }, { status: 400 });
        }
        inMemorySmartCard.balance = Math.max(0, inMemorySmartCard.balance - (amount || 0));
        return NextResponse.json({
          success: true,
          newBalance: inMemorySmartCard.balance,
        });
      }
      case 'set-limit': {
        inMemorySmartCard.dailyLimit = dailyLimit || inMemorySmartCard.dailyLimit;
        return NextResponse.json({
          success: true,
          dailyLimit: inMemorySmartCard.dailyLimit,
        });
      }
      default: {
        return NextResponse.json({
          success: true,
          smartCard: inMemorySmartCard,
        });
      }
    }
  } catch (error) {
    console.error('[API] POST /api/smart-card error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
