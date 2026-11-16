import { cookies } from 'next/headers';

export async function setTokens(accessToken: string, refreshToken: string, user: Record<string, unknown>) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === 'production';
  
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure,
    path: '/',
    maxAge: 15 * 60, // 15 mins
  });
  
  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure,
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days (adjust as needed)
  });

  // Store user context in a readable way or just HttpOnly as well.
  // We'll keep it HttpOnly and fetch it via /api/auth/me for client or directly read in server components.
  cookieStore.set('user_data', JSON.stringify(user), {
    httpOnly: true,
    secure,
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearTokens() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
  cookieStore.delete('user_data');
}

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  const userData = cookieStore.get('user_data')?.value;

  if (!accessToken && !refreshToken) return null;
  
  return {
    accessToken,
    refreshToken,
    user: userData ? JSON.parse(userData) : null,
  };
}
