import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url', { status: 400 });
  }
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'articleAuthor/1.0 (+https://example.com)'
      },
      // Avoid caching issues
      cache: 'no-store',
    });
    if (!res.ok) {
      return new NextResponse(`Upstream error: ${res.status}`, { status: 502 });
    }
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const arrayBuffer = await res.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
