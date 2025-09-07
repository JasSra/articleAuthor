import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channels = searchParams.get('channels') ?? undefined;
  const tenantId = searchParams.get('tenantId') ?? undefined;
  const organizationId = searchParams.get('organizationId') ?? undefined;
  const userId = searchParams.get('userId') ?? undefined;

  // Accept Authorization from client and forward to backend
  const authHeader = req.headers.get('authorization') || req.headers.get('x-auth-token');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader
    : authHeader
    ? `Bearer ${authHeader}`
    : undefined;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229';
  const upstreamUrl = new URL(`${baseUrl}/api/Notifications/stream`);
  if (channels) upstreamUrl.searchParams.set('channels', channels);
  if (tenantId) upstreamUrl.searchParams.set('tenantId', tenantId);
  if (organizationId) upstreamUrl.searchParams.set('organizationId', organizationId);
  if (userId) upstreamUrl.searchParams.set('userId', userId);

  try {
    const controller = new AbortController();
    req.signal.addEventListener('abort', () => controller.abort());

    const upstream = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        ...(token ? { Authorization: token } : {}),
        'User-Agent': 'articleAuthor/1.0',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return new Response(`Upstream error: ${upstream.status}`, { status: 502 });
    }

  const stream = new ReadableStream({
      start(controller) {
        const reader = upstream.body!.getReader();
    const pump: () => Promise<void> = () => reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
      return;
          }
          controller.enqueue(value!);
          return pump();
        }).catch(err => {
          controller.error(err);
        });
        return pump();
      },
      cancel() {
        controller.abort();
      }
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (e: any) {
    console.error('SSE proxy error:', e);
    const status = e?.name === 'AbortError' ? 499 : 500;
    return new Response('Failed to proxy stream', { status });
  }
}
