import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client configured for server use
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define protected routes
const protectedRoutes = ['/dashboard', '/goals', '/profile'];
const authRoutes = ['/auth/login', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route needs protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get the session from cookies - Supabase uses multiple cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseId = new URL(supabaseUrl).hostname.split('.')[0];
  
  // Check for any of the Supabase auth cookies
  const authToken = request.cookies.get(`sb-${supabaseId}-auth-token`);
  const accessToken = request.cookies.get(`sb-access-token`);
  const refreshToken = request.cookies.get(`sb-refresh-token`);
  
  const hasSession = authToken || accessToken || refreshToken;
  
  if (isProtectedRoute) {
    // If no session cookie, redirect to login
    if (!hasSession) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Optionally validate the session with Supabase
    // This adds an extra layer of security but increases latency
    // You can enable this for critical routes
    /*
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    */
  }
  
  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};