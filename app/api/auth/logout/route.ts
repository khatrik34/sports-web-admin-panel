import { NextResponse } from 'next/server';
import { clearTokens, getSession } from '@/lib/session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function POST() {
  const session = await getSession();
  
  if (session?.accessToken) {
    // Attempt to notify backend
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
    } catch (e) {
      // Ignore errors on logout
    }
  }

  await clearTokens();
  return NextResponse.json({ success: true });
}
