// turndown lacks types in our setup; import as any
// @ts-ignore - turndown types not available in repo
import TurndownService from 'turndown';
import { uploadBase64 } from '@/lib/upload';

// Basic HTML -> Markdown conversion with turndown
const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

export type PasteProcessResult = {
  markdown: string;
  html: string;
  summary?: string;
};

// Helper to fetch an image via our proxy API and return base64
async function fetchImageAsBase64(src: string): Promise<{ base64: string; contentType: string } | null> {
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

export async function processPastedHtml(html: string, jwt: string, onStatus?: (s: string) => void): Promise<PasteProcessResult> {
  // Parse HTML to DOM to find images and links
  onStatus?.('Parsing HTML...');
  const doc = new DOMParser().parseFromString(html, 'text/html');

  // Handle images: download, upload, replace src; collect original as comment
  const images = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];
  const originalImageMap = new Map<string, string>();
  const processedOriginals = new Set<string>();

  let uploadedCount = 0;
  for (const img of images) {
    const src = img.getAttribute('src');
    if (!src) continue;
    if (!/^https?:\/\//i.test(src)) continue; // only remote images
    if (processedOriginals.has(src)) continue;
    onStatus?.(`Fetching image ${uploadedCount + 1}/${images.length}...`);
    const fetched = await fetchImageAsBase64(src);
    if (!fetched) continue;
    const { base64 } = fetched;
    onStatus?.(`Uploading image ${uploadedCount + 1}/${images.length}...`);
    try {
      const newUrl = await uploadBase64(jwt, base64);
      originalImageMap.set(newUrl, src);
      img.setAttribute('src', newUrl);
      processedOriginals.add(src);
      uploadedCount++;
      // Ensure alt attribute exists
      if (!img.getAttribute('alt')) img.setAttribute('alt', extractFilenameFromUrl(src));
    } catch (e) {
      console.error('upload image failed', e);
    }
  }

  // Convert <a href=...image> to <img> and process similarly
  const anchors = Array.from(doc.querySelectorAll('a')) as HTMLAnchorElement[];
  const imageHrefRegex = /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i;
  for (const a of anchors) {
    const href = a.getAttribute('href');
    if (!href) continue;
    if (!/^https?:\/\//i.test(href)) continue;
    if (!imageHrefRegex.test(href)) continue;
    if (processedOriginals.has(href)) continue;
    onStatus?.(`Fetching linked image ${uploadedCount + 1}...`);
    const fetched = await fetchImageAsBase64(href);
    if (!fetched) continue;
    const { base64 } = fetched;
    onStatus?.(`Uploading linked image ${uploadedCount + 1}...`);
    try {
      const newUrl = await uploadBase64(jwt, base64);
      originalImageMap.set(newUrl, href);
      const img = doc.createElement('img');
      img.src = newUrl;
      img.alt = a.textContent || extractFilenameFromUrl(href);
      a.replaceWith(img);
      processedOriginals.add(href);
      uploadedCount++;
    } catch (e) {
      console.error('upload linked image failed', e);
    }
  }

  // Serialize processed HTML
  const processedHtml = doc.body.innerHTML;

  onStatus?.('Converting to Markdown...');
  let markdown = td.turndown(processedHtml);

  // Append original image links as HTML comments after each image in markdown
  // We find patterns ![alt](newUrl) and append <!-- original: src -->
  originalImageMap.forEach((original, newUrl) => {
    const pattern = new RegExp(`(\!\[[^\]]*\]\(${escapeRegExp(newUrl)}\))`, 'g');
    markdown = markdown.replace(pattern, `$1 <!-- original: ${original} -->`);
  });

  // For raw hyperlinks, we leave as-is; if needed, could add comments too.

  const summary = `Converted to Markdown. Uploaded ${uploadedCount} image(s).`;
  return { markdown, html: processedHtml, summary };
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
