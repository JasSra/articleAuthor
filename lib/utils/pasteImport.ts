// HTML→Markdown converter
import { createTurndown } from './markdown';
import { uploadBase64, uploadFile, uploadFileAnonymous } from '@/lib/upload';

// Basic HTML -> Markdown conversion with turndown
const td = createTurndown();

export type AnalyzedItem = {
  id: string;
  src: string;
  alt?: string;
  kind: 'img' | 'anchor-image' | 'video' | 'audio' | 'source' | 'file-link';
  contentTypeHint?: string;
};

export type AnalyzeResult = {
  html: string;
  markdown: string;
  items: AnalyzedItem[];
};

// Fetch remote page HTML via our proxy and ensure a <base href> is present for relative URL resolution
export async function fetchPageHtml(pageUrl: string): Promise<string> {
  const proxied = `/api/fetch-image?url=${encodeURIComponent(pageUrl)}`;
  const res = await fetch(proxied, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!/^text\/html/i.test(ct)) {
    throw new Error(`URL did not return HTML (got ${ct || 'unknown'})`);
  }
  const html = await res.text();
  // Inject <base href> if missing to help analyzer absolutize relative links
  if (!/<base\s+href=/i.test(html)) {
    const safeHref = pageUrl.replace(/"/g, '&quot;');
    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/<head[^>]*>/i, (m) => `${m}\n<base href="${safeHref}">`);
    }
    // If no head, wrap minimal head with base
    return `<!doctype html><html><head><base href="${safeHref}"></head><body>${html}</body></html>`;
  }
  return html;
}

// Helper to fetch an image via our proxy API and return base64
export async function fetchImageAsBase64(src: string): Promise<{ base64: string; contentType: string } | null> {
  try {
    const proxied = `/api/fetch-image?url=${encodeURIComponent(src)}`;
    const res = await fetch(proxied, { cache: 'no-store' });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/png';
    const blob = await res.blob();
    // Convert blob to base64 using FileReader for browser compatibility
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const comma = result.indexOf(',');
        resolve(comma >= 0 ? result.substring(comma + 1) : result);
      };
      reader.onerror = () => reject(new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
    return { base64, contentType };
  } catch (e) {
    console.error('fetchImageAsBase64 error', e);
    return null;
  }
}

function extractFilenameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const pathname = u.pathname;
    const leaf = pathname.split('/').filter(Boolean).pop() || 'image';
    return leaf;
  } catch {
    return 'image';
  }
}

export function analyzePastedHtml(html: string): AnalyzeResult {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const items: AnalyzedItem[] = [];
  const baseHref = (doc.querySelector('base') as HTMLBaseElement | null)?.href || undefined;

  const absolutize = (maybeUrl: string | null): string | null => {
    if (!maybeUrl) return null;
    if (/^https?:\/\//i.test(maybeUrl)) return maybeUrl;
    if (baseHref) {
      try {
        return new URL(maybeUrl, baseHref).toString();
      } catch {}
    }
    return null;
  };

  const images = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];
  for (const img of images) {
    const srcAbs = absolutize(img.getAttribute('src'));
    if (!srcAbs) continue;
    items.push({ id: cryptoRandomId(), src: srcAbs, alt: img.getAttribute('alt') || extractFilenameFromUrl(srcAbs), kind: 'img' });
  }

  const anchors = Array.from(doc.querySelectorAll('a')) as HTMLAnchorElement[];
  for (const a of anchors) {
    const hrefAbs = absolutize(a.getAttribute('href'));
    if (!hrefAbs) continue;
    const lower = hrefAbs.toLowerCase();
    const isImage = /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/.test(lower);
    const isVideo = /\.(mp4|mov|webm|mkv|avi)(\?.*)?$/.test(lower);
    const isAudio = /\.(mp3|wav|ogg|m4a|flac)(\?.*)?$/.test(lower);
    const isDoc = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|csv|tsv|txt|md|json|xml|zip|rar|7z|tar|tgz|gz|bz2)(\?.*)?$/.test(lower)
      || /(?:[?&](download|attachment|format)=(1|true|pdf))/i.test(lower)
      || /\/(download|attachment)(?:\b|\/)/i.test(lower);

    let kind: AnalyzedItem['kind'] | undefined = undefined;
    if (isImage) kind = 'anchor-image';
    else if (isVideo) kind = 'video';
    else if (isAudio) kind = 'audio';
    else if (isDoc) kind = 'file-link';

    if (!kind) continue; // Skip generic web page links
    items.push({ id: cryptoRandomId(), src: hrefAbs, alt: a.textContent || extractFilenameFromUrl(hrefAbs), kind });
  }

  // Video/Audio tags with src or <source src>
  const videos = Array.from(doc.querySelectorAll('video')) as HTMLVideoElement[];
  for (const v of videos) {
    const src = absolutize(v.getAttribute('src'));
    if (src) items.push({ id: cryptoRandomId(), src, alt: extractFilenameFromUrl(src), kind: 'video' });
    const sources = Array.from(v.querySelectorAll('source')) as HTMLSourceElement[];
    for (const s of sources) {
      const ssrc = absolutize(s.getAttribute('src'));
      if (ssrc) items.push({ id: cryptoRandomId(), src: ssrc, alt: extractFilenameFromUrl(ssrc), kind: 'source', contentTypeHint: s.getAttribute('type') || undefined });
    }
  }
  const audios = Array.from(doc.querySelectorAll('audio')) as HTMLAudioElement[];
  for (const a of audios) {
    const src = absolutize(a.getAttribute('src'));
    if (src) items.push({ id: cryptoRandomId(), src, alt: extractFilenameFromUrl(src), kind: 'audio' });
    const sources = Array.from(a.querySelectorAll('source')) as HTMLSourceElement[];
    for (const s of sources) {
      const ssrc = absolutize(s.getAttribute('src'));
      if (ssrc) items.push({ id: cryptoRandomId(), src: ssrc, alt: extractFilenameFromUrl(ssrc), kind: 'source', contentTypeHint: s.getAttribute('type') || undefined });
    }
  }

  const processedHtml = doc.body.innerHTML;
  const markdown = td.turndown(processedHtml);
  return { html: processedHtml, markdown, items };
}

export async function uploadImageFromUrl(jwt: string, src: string): Promise<string> {
  const fetched = await fetchImageAsBase64(src);
  if (!fetched) throw new Error('Failed to fetch image');
  const { base64 } = fetched;
  const newUrl = await uploadBase64(jwt, base64);
  return newUrl;
}

// Generic upload from URL: fetch via proxy, build File from Blob, and use uploadFile
export async function uploadFromUrl(jwt: string, src: string): Promise<string> {
  try {
    const proxied = `/api/fetch-image?url=${encodeURIComponent(src)}`;
    const res = await fetch(proxied, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    let contentType = res.headers.get('content-type') || 'application/octet-stream';
  const disposition = res.headers.get('content-disposition') || '';
    // Only proceed for downloadable content types (skip generic HTML pages)
    const isDownloadable = (
      /^image\//i.test(contentType) ||
      /^video\//i.test(contentType) ||
      /^audio\//i.test(contentType) ||
      /^application\/(pdf|zip|x-zip-compressed|msword|vnd\.[^;]+|octet-stream|json)/i.test(contentType) ||
      /^text\/(csv|plain|tsv|xml|markdown)/i.test(contentType)
    );
    if (!isDownloadable && /^text\/html/i.test(contentType)) {
      throw new Error('Link points to a web page (HTML); not uploading');
    }
  const blob = await res.blob();
  // Derive a safe filename and extension from src and content-type
  const fromDisposition = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
  const dispName = decodeURIComponent(fromDisposition?.[1] || fromDisposition?.[2] || '').trim();
  const originalName = dispName || extractFilenameFromUrl(src) || 'file';
  const ensuredName = ensureFileNameMatchesType(originalName, contentType);
  const file = new File([blob], ensuredName, { type: contentType });
  // Use multipart upload for correct content-type and filename
  return await uploadFile(jwt, file);
  } catch (e) {
    console.error('uploadFromUrl error', e);
    throw e;
  }
}

// Anonymous variant: fetch via proxy and upload without JWT
export async function uploadFromUrlAnonymous(src: string): Promise<string> {
  try {
    const proxied = `/api/fetch-image?url=${encodeURIComponent(src)}`;
    const res = await fetch(proxied, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    let contentType = res.headers.get('content-type') || 'application/octet-stream';
    const disposition = res.headers.get('content-disposition') || '';
    const isDownloadable = (
      /^image\//i.test(contentType) ||
      /^video\//i.test(contentType) ||
      /^audio\//i.test(contentType) ||
      /^application\/(pdf|zip|x-zip-compressed|msword|vnd\.[^;]+|octet-stream|json)/i.test(contentType) ||
      /^text\/(csv|plain|tsv|xml|markdown)/i.test(contentType)
    );
    if (!isDownloadable && /^text\/html/i.test(contentType)) {
      throw new Error('Link points to a web page (HTML); not uploading');
    }
    const blob = await res.blob();
    const fromDisposition = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disposition);
    const dispName = decodeURIComponent(fromDisposition?.[1] || fromDisposition?.[2] || '').trim();
    const originalName = dispName || extractFilenameFromUrl(src) || 'file';
    const ensuredName = ensureFileNameMatchesType(originalName, contentType);
    const file = new File([blob], ensuredName, { type: contentType });
    return await uploadFileAnonymous(file);
  } catch (e) {
    console.error('uploadFromUrlAnonymous error', e);
    throw e;
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.substring(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

export function rewriteMarkdownWithMapping(markdown: string, mapping: Array<{ original: string; uploaded: string; convertToImage?: boolean }>): string {
  let output = markdown;
  for (const map of mapping) {
    const { original, uploaded, convertToImage } = map;
    const escaped = escapeRegExp(original);
    // Replace image markdown referencing this URL
    try {
      const imgPattern = new RegExp(`!\\[[^\\]]*\\]\\(${escaped}\\)`, 'g');
      output = output.replace(imgPattern, (m) => m.replace(new RegExp(escaped, 'g'), uploaded) + ` <!-- original: ${original} -->`);
    } catch (e) {
      console.warn('Image regex failed for URL', original, e);
    }
    // Replace link markdown referencing this URL
    try {
      const linkPattern = new RegExp(`\\[([^\\]]*)\\]\\(${escaped}\\)`, 'g');
      output = output.replace(linkPattern, (_m, linkText: string) => {
        const text = linkText || '';
        if (convertToImage) {
          return `![${text}](${uploaded}) <!-- original: ${original} -->`;
        }
        return `[${text}](${uploaded}) <!-- original: ${original} -->`;
      });
    } catch (e) {
      console.warn('Link regex failed for URL', original, e);
    }
  }
  return output;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function ensureFileNameMatchesType(name: string, contentType: string): string {
  const extMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'audio/mpeg': '.mp3',
    'audio/mp3': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'application/pdf': '.pdf',
    'application/zip': '.zip',
    'text/plain': '.txt',
    'text/csv': '.csv',
    'application/json': '.json',
  };
  const desiredExt = extMap[contentType];
  if (!desiredExt) return name;
  const hasExt = /\.[a-z0-9]+(\?.*)?$/i.test(name);
  if (!hasExt) return name + desiredExt;
  // If existing extension conflicts with content type, replace it
  return name.replace(/\.[a-z0-9]+(\?.*)?$/i, desiredExt);
}
