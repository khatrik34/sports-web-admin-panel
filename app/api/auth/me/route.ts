import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ code: 'unauthorized', detail: 'Not logged in' }, { status: 401 });
  }
  return NextResponse.json({ user: session.user });
}
