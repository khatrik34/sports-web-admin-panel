import { NextResponse } from 'next/server';
import { setTokens } from '@/lib/session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return NextResponse.json(errorData || { code: 'unknown_error', detail: 'Login failed' }, { status: res.status });
    }

    const data = await res.json();
    // { accessToken, tokenType, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, user }
    await setTokens(data.accessToken, data.refreshToken, data.user);

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ code: 'internal_error', detail: 'Internal Server Error' }, { status: 500 });
  }
}
