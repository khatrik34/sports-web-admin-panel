import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/api/auth/login'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ code: 'unauthorized', detail: 'Missing token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Force change password if needed
  if (!pathname.startsWith('/change-password') && !pathname.startsWith('/api/auth/logout')) {
    const userDataStr = request.cookies.get('user_data')?.value;
    if (userDataStr) {
      try {
        const user = JSON.parse(userDataStr);
        if (user.mustChangePassword) {
          // Allow proxy calls if needed? The backend api doesn't block, but panel does. Let's block UI paths.
          if (!pathname.startsWith('/api/')) {
            return NextResponse.redirect(new URL('/change-password', request.url));
          }
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
