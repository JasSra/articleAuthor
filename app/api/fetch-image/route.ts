import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url', { status: 400 });
  }
  // Basic scheme validation (allow http/https only)
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return new NextResponse('Unsupported protocol', { status: 400 });
    }
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'articleAuthor/1.0',
        'Accept': '*/*',
      },
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!upstream.ok || !upstream.body) {
      return new NextResponse(`Upstream error: ${upstream.status}`, { status: 502 });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    // Stream body directly without buffering to handle large files
    return new NextResponse(upstream.body as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e: any) {
    console.error('Proxy fetch error:', e);
    return new NextResponse('Failed to fetch resource', { status: 500 });
  }
}
