import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_AUTH_SECRET || 'acemen_ultra_luxury_secret_session_jwt_token_2026'
);

const COOKIE_NAME = 'acemen_admin_token';

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const { pathname, search } = req.nextUrl;

  // Permanent 301 redirect from acemen.uk -> acemen.co.uk
  if (host === 'acemen.uk' || host === 'www.acemen.uk') {
    return NextResponse.redirect(`https://acemen.co.uk${pathname}${search}`, {
      status: 301,
    });
  }

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    // Allow public access to admin login page
    if (pathname === '/admin/login') {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      if (token) {
        try {
          await jwtVerify(token, JWT_SECRET);
          // If already logged in, redirect to /admin dashboard
          return NextResponse.redirect(new URL('/admin', req.url));
        } catch {
          // Token invalid, proceed to login page
        }
      }
      return setSecurityHeaders(NextResponse.next());
    }

    // Check token for all other /admin routes
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  const response = NextResponse.next();
  return setSecurityHeaders(response);
}

function setSecurityHeaders(response: NextResponse) {
  // Security headers for luxury commerce
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
