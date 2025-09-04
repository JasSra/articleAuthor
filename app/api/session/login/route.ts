import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createApiClient } from '@/lib/apiClient';

export async function POST(request: NextRequest) {
  try {
    const { externalToken } = await request.json();

    if (!externalToken) {
      return NextResponse.json(
        { error: 'External token is required' },
        { status: 400 }
      );
    }

    // Exchange external token for JWT with consolidated API
    const api = createApiClient();
    const result = await api.registerExternal(externalToken);

    // Store JWT in httpOnly cookie
    const response = NextResponse.json({ success: true, jwt: result.jwt });
    
    response.cookies.set('auth_jwt', result.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    );
  }
}
