import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Vendor from '@/models/Vendor';

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || 'saifulhaqff@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

// Fast timeout helper so login never hangs if MongoDB connection is slow or invalid
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('DB Connection Timeout')), timeoutMs)
    ),
  ]);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim() || 'student@elitex.edu';
        const rawPassword = credentials?.password || '';
        const requestedRole = (credentials?.role as 'student' | 'vendor' | 'admin') || 'student';

        const isAdmin = ADMIN_EMAILS.includes(email);
        const isVendorEmail = email.includes('vendor') || email.includes('kitchen') || email.includes('canteen') || requestedRole === 'vendor';
        const role = isAdmin ? 'admin' : isVendorEmail ? 'vendor' : requestedRole;
        
        let resolvedVendorSlug = 'campus-kitchen';
        if (email.includes('royal')) resolvedVendorSlug = 'royal-kitchen';
        if (email.includes('tasty')) resolvedVendorSlug = 'tasty-times';
        if (email.includes('campus')) resolvedVendorSlug = 'campus-kitchen';

        try {
          // Attempt fast DB connection with a 2.5s timeout
          await withTimeout(connectDB(), 2500);

          let dbUser = await User.findOne({ email });

          if (dbUser) {
            // Verify password if set and provided
            if (dbUser.password && rawPassword) {
              const isValid = await bcrypt.compare(rawPassword, dbUser.password);
              if (!isValid) {
                throw new Error('Invalid email or password');
              }
            }
          } else {
            // Create user
            const hashedPassword = rawPassword ? await bcrypt.hash(rawPassword, 10) : '';
            const name = role === 'vendor' ? `${resolvedVendorSlug.replace('-', ' ').toUpperCase()} Owner` : role === 'admin' ? 'Campus Admin' : email.split('@')[0];

            dbUser = await User.create({
              name,
              email,
              password: hashedPassword,
              role,
              vendorSlug: resolvedVendorSlug,
              college: 'Elite Tech Campus',
              walletBalance: role === 'admin' ? 5000 : 250,
            });
          }

          let vendorSlug = dbUser.vendorSlug || resolvedVendorSlug;
          if (dbUser.role === 'vendor' && !vendorSlug) {
            const vendor = await Vendor.findOne({ ownerId: email });
            if (vendor) vendorSlug = vendor.slug;
          }

          return {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.avatar || '',
            role: dbUser.role,
            college: dbUser.college || 'Elite Tech Campus',
            vendorSlug,
          };
        } catch (error: unknown) {
          const err = error as Error;
          if (err.message === 'Invalid email or password') {
            throw err;
          }
          console.warn('[NextAuth] Fast login fallback activated:', err.message);

          return {
            id: role === 'vendor' ? 'v_101' : role === 'admin' ? 'a_101' : 'u_101',
            name: role === 'vendor' ? 'Campus Kitchen Owner' : role === 'admin' ? 'Campus Admin' : 'Campus Student',
            email,
            image: '',
            role,
            college: 'Elite Tech Campus',
            vendorSlug: resolvedVendorSlug,
          };
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || 'elitex-preordering-secret-key-32chars',

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          await withTimeout(connectDB(), 2500);

          const email = user.email.toLowerCase();
          const isAdmin = ADMIN_EMAILS.includes(email);

          let dbUser = await User.findOne({ email });

          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || 'Campus User',
              email,
              avatar: user.image || '',
              role: isAdmin ? 'admin' : 'student',
              walletBalance: isAdmin ? 5000 : 250,
            });
          } else if (isAdmin && dbUser.role !== 'admin') {
            dbUser.role = 'admin';
            await dbUser.save();
          }

          return true;
        } catch (error) {
          console.warn('[NextAuth] Google sign-in DB timeout fallback:', error);
          return true;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.userId = (u.id as string) || token.sub;
        token.role = (u.role as string) || 'student';
        token.college = (u.college as string) || 'Elite Tech Campus';
        token.vendorSlug = (u.vendorSlug as string) || (token.role === 'vendor' ? 'tasty-times' : '');
      }

      if (account?.provider === 'google' && user?.email) {
        try {
          await withTimeout(connectDB(), 2000);
          const dbUser = await User.findOne({ email: user.email.toLowerCase() });
          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.role = dbUser.role;
            token.college = dbUser.college;
            token.vendorSlug = dbUser.vendorSlug || '';
          }
        } catch (error) {
          console.warn('[NextAuth] JWT callback timeout fallback:', error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.userId as string;
        (session.user as Record<string, unknown>).role = token.role as string;
        (session.user as Record<string, unknown>).college = token.college as string;
        (session.user as Record<string, unknown>).vendorSlug = token.vendorSlug as string;
      }
      return session;
    },
  },
};
