import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from './lib/auth';

// Define route permissions
const protectedRoutes = ['/dashboard', '/settings', '/profile/edit', '/messages'];
const adminRoutes = ['/admin'];
const publicRoutes = ['/login', '/register'];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // Verify session
  const session = await verifySession();

  // Route: Public (Login/Register)
  if (isPublicRoute && session.isAuth) {
    return NextResponse.redirect(new URL('/feed', req.nextUrl));
  }

  // Route: Admin
  if (isAdminRoute && session.role !== 'Admin') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Route: Protected
  if (isProtectedRoute && !session.isAuth) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g. images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
