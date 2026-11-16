import { NextRequest, NextResponse } from 'next/server';
import { getSession, setTokens, clearTokens } from '@/lib/session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

async function handleProxy(req: NextRequest) {
  const session = await getSession();
  
  const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, '');
  const searchParams = req.nextUrl.search;
  const targetUrl = `${API_BASE_URL}${path}${searchParams}`;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('cookie');
  headers.delete('connection');
  
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  let bodyText: string | null = null;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    try {
      bodyText = await req.text();
    } catch (e) {
      bodyText = null;
    }
  }

  const makeRequest = async (token?: string) => {
    const reqHeaders = new Headers(headers);
    if (token) {
      reqHeaders.set('Authorization', `Bearer ${token}`);
    }
    return fetch(targetUrl, {
      method: req.method,
      headers: reqHeaders,
      body: bodyText || undefined,
    });
  };

  try {
    let backendRes = await makeRequest(session?.accessToken);

    if (backendRes.status === 401 && session?.refreshToken) {
      // Try refresh
      const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        // { accessToken, refreshToken, user... }
        // The API returns the new tokens. 
        await setTokens(data.accessToken, data.refreshToken, data.user || session.user);
        
        // Retry original request
        backendRes = await makeRequest(data.accessToken);
      } else {
        await clearTokens();
      }
    }

    const resHeaders = new Headers(backendRes.headers);
    resHeaders.delete('content-encoding');

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: resHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ code: 'gateway_error', detail: 'Could not reach backend API' }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
