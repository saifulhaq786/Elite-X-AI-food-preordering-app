import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Paths that don't require authentication
const PUBLIC_PATHS = ['/', '/login', '/register', '/verify-otp'];
const PUBLIC_PREFIXES = ['/api/auth', '/_next', '/favicon', '/icons', '/images', '/manifest'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow public prefixes (static assets, NextAuth API, etc.)
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow API seed route (will do its own auth check)
  if (pathname.startsWith('/api/seed')) {
    return NextResponse.next();
  }

  // Get JWT token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No token = not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = (token.role as string) || 'student';

  // Admin routes — only admin role
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Vendor management routes — only vendor or admin
  const vendorManagementPaths = ['/vendor/orders', '/vendor/analytics', '/vendor/menu', '/vendor/scan'];
  const isVendorManagement = vendorManagementPaths.some((p) => pathname.startsWith(p));
  if (isVendorManagement && userRole !== 'vendor' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Authenticated user trying to access login/register → redirect to dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (userRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url));
    if (userRole === 'vendor') return NextResponse.redirect(new URL('/vendor/orders', request.url));
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|images|manifest).*)',
  ],
};
