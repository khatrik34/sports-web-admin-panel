import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

async function handleProxy(req: NextRequest) {
  const session = await getSession();
  
  // Extract path
  const path = req.nextUrl.pathname.replace(/^\/api\/proxy/, '');
  const searchParams = req.nextUrl.search;
  const targetUrl = `${API_BASE_URL}${path}${searchParams}`;

  const headers = new Headers(req.headers);
  // Remove host to avoid conflicts
  headers.delete('host');
  headers.delete('cookie');
  headers.delete('connection');
  
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  // Handle body
  let body = null;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // If it's application/json we can read it, or just forward as stream?
    // In Next 15, we can forward req.body
    if (req.body) {
      body = req.body;
    }
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body,
      // @ts-expect-error - duplex is needed for streaming body in Node
      duplex: body ? 'half' : undefined,
    });

    const resHeaders = new Headers(backendRes.headers);
    // Don't forward some headers
    resHeaders.delete('content-encoding');

    // NOTE: Refresh token logic on 401 could go here, but for simplicity we return 401 and let client redirect or retry
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
