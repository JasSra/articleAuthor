import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get('auth_jwt')?.value;

    if (jwt) {
      return NextResponse.json({ jwt });
    }

    return NextResponse.json({ jwt: null });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ jwt: null });
  }
}
