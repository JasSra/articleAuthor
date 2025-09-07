'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { analyzePastedHtml, rewriteMarkdownWithMapping, uploadImageFromUrl, uploadFromUrl, uploadFromUrlAnonymous, fetchPageHtml, type AnalyzeResult } from '@/lib/utils/pasteImport';
import toast from 'react-hot-toast';

interface PasteImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: { markdown: string; html: string }) => void;
  initialHtml?: string;
}

export const PasteImportModal: React.FC<PasteImportModalProps> = ({ isOpen, onClose, onConfirm, initialHtml }) => {
  const { jwt } = useAuth();
  const [rawHtml, setRawHtml] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditingMarkdown, setIsEditingMarkdown] = useState<boolean>(false);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [queue, setQueue] = useState<Array<{
    id: string;
    src: string;
    alt?: string;
    kind: 'img' | 'anchor-image' | 'video' | 'audio' | 'source' | 'file-link';
    status: 'pending' | 'uploading' | 'success' | 'error';
    uploadedUrl?: string;
    error?: string;
  }>>([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const pasteAreaRef = useRef<HTMLDivElement>(null);
  const [urlToImport, setUrlToImport] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [convertLinksToImages, setConvertLinksToImages] = useState(false);
  const STORAGE_KEY = 'paste-import-draft-v1';

  // Helper to recompute markdown with current successful uploads
  const recomputeMarkdown = useCallback((baseMarkdown: string, items: typeof queue) => {
    const mapping = items
      .filter(i => i.uploadedUrl)
      .map(i => ({ original: i.src, uploaded: i.uploadedUrl!, convertToImage: convertLinksToImages && (i.kind === 'anchor-image' || i.kind === 'file-link') }));
    if (mapping.length === 0) return baseMarkdown;
    return rewriteMarkdownWithMapping(baseMarkdown, mapping);
  }, [convertLinksToImages]);

  const handleUploadAll = useCallback(async () => {
    if (!analyzeResult) {
      setStatus('Nothing to upload. Analyze content first.');
      return;
    }
    setIsUploading(true);
    setStatus('Uploading files…');
    let successCount = 0;
    const next = [...queue];
    for (let idx = 0; idx < next.length; idx++) {
      const item = next[idx];
      if (item.status === 'success') { successCount++; continue; }
      next[idx] = { ...item, status: 'uploading', error: undefined };
      setQueue([...next]);
      try {
        const uploadedUrl = jwt ? await uploadFromUrl(jwt, item.src) : await uploadFromUrlAnonymous(item.src);
        next[idx] = { ...next[idx], status: 'success', uploadedUrl };
        successCount++;
        setUploadedCount(successCount);
        // Update markdown incrementally to reflect progress
        const newMd = recomputeMarkdown(analyzeResult.markdown, next);
        setMarkdown(newMd);
      } catch (e: any) {
        const message = e?.message || 'Upload failed';
        next[idx] = { ...next[idx], status: 'error', error: message };
        try { toast.error(`Upload failed: ${message}`); } catch {}
      }
      setQueue([...next]);
      setStatus(`Uploading files… ${successCount}/${next.length} uploaded`);
    }
    setIsUploading(false);
    if (successCount === next.length) {
      setStatus('All files uploaded. Ready to import.');
      try { toast.success('All files uploaded.'); } catch {}
    } else {
      const failed = next.filter(i => i.status === 'error').length;
      setStatus(`Uploads completed with ${failed} failure${failed === 1 ? '' : 's'}. You can retry failed ones.`);
  if (failed > 0) { try { toast.error('Some files failed to upload. You can retry.'); } catch {} }
    }
  }, [jwt, analyzeResult, queue, recomputeMarkdown]);

  const handleRetry = useCallback(async (id: string) => {
    if (!analyzeResult) {
      setStatus('Nothing to upload. Analyze content first.');
      return;
    }
    const index = queue.findIndex(q => q.id === id);
    if (index === -1) return;
    const next = [...queue];
    next[index] = { ...next[index], status: 'uploading', error: undefined };
    setQueue(next);
    try {
      const uploadedUrl = jwt ? await uploadFromUrl(jwt, next[index].src) : await uploadFromUrlAnonymous(next[index].src);
      next[index] = { ...next[index], status: 'success', uploadedUrl };
      setQueue([...next]);
      const successCount = next.filter(i => i.status === 'success').length;
      setUploadedCount(successCount);
      const newMd = recomputeMarkdown(analyzeResult.markdown, next);
      setMarkdown(newMd);
      setStatus(`Uploaded ${successCount}/${next.length}`);
      try { toast.success('File uploaded'); } catch {}
    } catch (e: any) {
      next[index] = { ...next[index], status: 'error', error: e?.message || 'Upload failed' };
      setQueue([...next]);
      try { toast.error(`Upload failed: ${e?.message || 'Upload failed'}`); } catch {}
    }
  }, [jwt, analyzeResult, queue, recomputeMarkdown]);

  useEffect(() => {
    if (!isOpen) {
      setRawHtml('');
      setMarkdown('');
      setProcessedHtml('');
      setStatus('');
      setIsAnalyzing(false);
      setIsUploading(false);
      setIsEditingMarkdown(false);
      setAnalyzeResult(null);
      setQueue([]);
      setUploadedCount(0);
    }
  }, [isOpen]);

  // Restore draft from localStorage when opening
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { rawHtml?: string };
        if (parsed.rawHtml) {
          setRawHtml(parsed.rawHtml);
          setIsAnalyzing(true);
          setStatus('Restoring draft…');
          const result = analyzePastedHtml(parsed.rawHtml);
          setAnalyzeResult(result);
          setMarkdown(result.markdown);
          setProcessedHtml(result.html);
          const q = result.items.map(i => ({ ...i, status: 'pending' as const }));
          setQueue(q);
          setStatus('Draft restored.');
          setIsAnalyzing(false);
        }
      }
    } catch {}
  }, [isOpen]);

  // If initialHtml is provided, auto-process once when opened
  useEffect(() => {
    const shouldAuto = isOpen && !!initialHtml && !rawHtml && !isAnalyzing;
    if (!shouldAuto) return;
    const run = async () => {
      setRawHtml(initialHtml!);
      setIsAnalyzing(true);
      setStatus('Analyzing and converting...');
      try {
        const result = analyzePastedHtml(initialHtml!);
        setAnalyzeResult(result);
        setMarkdown(result.markdown);
        setProcessedHtml(result.html);
        // Initialize queue with pending items
        const q = result.items.map(i => ({ ...i, status: 'pending' as const }));
        setQueue(q);
        if (q.length > 0) {
          setStatus(`Found ${q.length} file${q.length > 1 ? 's' : ''}. Click "Upload files" to rehost them.`);
        } else {
          setStatus('No external files found. Ready to import.');
        }
      } catch (err) {
        console.error(err);
        setStatus('Failed to process pasted content.');
        try { toast.error('Failed to analyze pasted content.'); } catch {}
      } finally {
        setIsAnalyzing(false);
      }
    };
    run();
  }, [isOpen, initialHtml, isAnalyzing, rawHtml]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Intercept paste and extract HTML/text
    e.preventDefault();
    const dt = e.clipboardData;
    const html = dt.getData('text/html');
    const text = dt.getData('text/plain');
    const content = html || `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
    setRawHtml(content);
    setIsAnalyzing(true);
    setStatus('Analyzing and converting...');
    try {
      const result = analyzePastedHtml(content);
      setAnalyzeResult(result);
      setMarkdown(result.markdown);
      setProcessedHtml(result.html);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ rawHtml: content })); } catch {}
      const q = result.items.map(i => ({ ...i, status: 'pending' as const }));
      setQueue(q);
      if (q.length > 0) {
        setStatus(`Found ${q.length} file${q.length > 1 ? 's' : ''}. Click "Upload files" to rehost them.`);
      } else {
        setStatus('No external files found. Ready to import.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Failed to process pasted content.');
      try { toast.error('Failed to process pasted content.'); } catch {}
    } finally {
      setIsAnalyzing(false);
    }
  }, []);
  const handleCancel = useCallback(() => {
    const anyUploaded = queue.some(q => q.status === 'success');
    if (anyUploaded) {
      const proceed = window.confirm('Some files were already uploaded in this session and cannot be auto-deleted. Close anyway?');
      if (!proceed) return;
    }
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    onClose();
  }, [queue, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <div className="bg-white w-full max-w-7xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white z-10">
          <h3 className="font-semibold">Import from Clipboard</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <p className="text-sm text-gray-600 mb-2">Paste website content into the area below. We&apos;ll convert it to Markdown, rehost files (images, videos, docs, zips, code, etc.), and keep original links as hidden comments.</p>
            {!initialHtml && (
              <div
                ref={pasteAreaRef}
                onPaste={handlePaste}
                className="border-2 border-dashed rounded-md p-6 text-gray-500 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-label="Paste area"
              >
                Paste here (Ctrl/Cmd+V)...
              </div>
            )}
            {/* Import by URL */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="url"
                placeholder="https://example.com/article"
                value={urlToImport}
                onChange={(e) => setUrlToImport(e.target.value)}
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button
                className={`px-3 py-2 text-sm rounded border ${isFetchingUrl ? 'text-gray-400 border-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
                disabled={!urlToImport || isFetchingUrl}
                onClick={async () => {
                  setIsFetchingUrl(true);
                  setStatus('Fetching page HTML…');
                  try {
                    const html = await fetchPageHtml(urlToImport);
                    setRawHtml(html);
                    setIsAnalyzing(true);
                    setStatus('Analyzing and converting...');
                    const result = analyzePastedHtml(html);
                    setAnalyzeResult(result);
                    setMarkdown(result.markdown);
                    setProcessedHtml(result.html);
                    const q = result.items.map(i => ({ ...i, status: 'pending' as const }));
                    setQueue(q);
                    if (q.length > 0) {
                      setStatus(`Found ${q.length} file${q.length > 1 ? 's' : ''}. Click "Upload files" to rehost them.`);
                    } else {
                      setStatus('No external files found. Ready to import.');
                    }
                    try { toast.success('Fetched and analyzed page.'); } catch {}
                  } catch (err: any) {
                    console.error(err);
                    setStatus(err?.message || 'Failed to fetch or analyze page.');
                    try { toast.error(err?.message || 'Failed to fetch page'); } catch {}
                  } finally {
                    setIsAnalyzing(false);
                    setIsFetchingUrl(false);
                  }
                }}
              >
                {isFetchingUrl ? 'Fetching…' : 'Import by URL'}
              </button>
            </div>
          </div>

          <div className={`text-xs ${isUploading ? 'text-green-700' : 'text-gray-500'}`}>{status}</div>

          {markdown && (
            <div className="grid grid-cols-3 gap-4">
              {/* Queue column */}
              <div className="border rounded-md overflow-hidden">
                <div className="px-3 py-2 border-b text-xs font-medium text-gray-600 bg-gray-50 flex items-center justify-between">
                  <span>Upload Queue</span>
                  <span className="text-[11px] text-green-700">{uploadedCount}/{queue.length} uploaded</span>
                </div>
                <div className="p-3 max-h-[50vh] overflow-auto space-y-2">
                  {queue.length === 0 && (
                    <div className="text-xs text-gray-500">No files detected</div>
                  )}
                  {queue.map(item => (
                    <div key={item.id} className="flex items-center justify-between gap-2 p-2 border rounded">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* Thumbnail or icon */}
                        {item.kind === 'img' || item.kind === 'anchor-image' ? (
                          // Use native img for external preview to avoid Next/Image domain restrictions
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.src} alt={item.alt || ''} className="w-8 h-8 object-cover rounded border" />
                        ) : (
                          <div className="w-8 h-8 rounded border flex items-center justify-center bg-gray-50">
                            <span className="text-xs text-gray-600">
                              {item.kind === 'video' ? '🎬' : item.kind === 'audio' ? '🎵' : '📄'}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs text-gray-800 truncate max-w-[14rem]" title={item.alt || item.src}>{item.alt || item.src}</div>
                          <div className="text-[10px]">
                            {item.status === 'pending' && <span className="text-gray-500">pending</span>}
                            {item.status === 'uploading' && <span className="text-blue-600">uploading…</span>}
                            {item.status === 'success' && <span className="text-green-700">uploaded</span>}
                            {item.status === 'error' && <span className="text-red-600">failed{item.error ? `: ${item.error}` : ''}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === 'error' && (
                          <button
                            className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                            onClick={() => handleRetry(item.id)}
                          >
                            Retry
                          </button>
                        )}
                        {item.uploadedUrl && (
                          <a className="text-xs text-blue-600 hover:underline" href={item.uploadedUrl} target="_blank" rel="noreferrer">link</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Markdown editor + preview */}
              <div className="border rounded-md overflow-hidden col-span-1">
                <div className="px-3 py-2 border-b text-xs font-medium text-gray-600 bg-gray-50 flex items-center justify-between">
                  <span>Markdown</span>
                  <button
                    className="text-[11px] px-2 py-1 border rounded hover:bg-gray-100"
                    onClick={() => setIsEditingMarkdown(!isEditingMarkdown)}
                  >
                    {isEditingMarkdown ? 'Preview' : 'Edit'}
                  </button>
                </div>
                <div className="p-0 max-h-[60vh] overflow-auto">
                  {isEditingMarkdown ? (
                    <textarea
                      value={markdown}
                      onChange={(e) => setMarkdown(e.target.value)}
                      className="w-full h-[60vh] p-3 font-mono text-xs outline-none"
                      aria-label="Edit Markdown"
                      placeholder="Edit Markdown here"
                    />
                  ) : (
                    <div className="p-4 prose prose-sm max-w-none">
          {/* eslint-disable @next/next/no-img-element */}
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{
                        // Use native img to allow remote previews before upload
                        img: ({ src, alt }: { src?: string; alt?: string }) => (
                          <img src={src || ''} alt={alt || ''} className="max-w-full h-auto rounded" />
                        ),
                        a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
                          <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>
                        )
                      }}>
                        {markdown}
                      </ReactMarkdown>
                    </div>
                  )}
          {/* eslint-enable @next/next/no-img-element */}
                </div>
              </div>

              {/* Processed HTML */}
              <div className="border rounded-md overflow-hidden col-span-1">
                <div className="px-3 py-2 border-b text-xs font-medium text-gray-600 bg-gray-50">Original HTML (processed)</div>
                <div className="p-4 max-h-[60vh] overflow-auto">
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-between gap-3 bg-gray-50">
          <div className="text-xs text-gray-500">
            {queue.length > 0 && !jwt && (
              <div className="text-gray-600">Uploading anonymously (files may expire in ~30 days).</div>
            )}
            {queue.length === 0 && markdown && 'No files to upload.'}
            {queue.length > 0 && queue.some(q => q.status !== 'success') && (
              <div className="text-amber-600">Some files aren’t rehosted yet. Adding will keep external URLs.</div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-xs text-gray-700 mr-3">
              <input type="checkbox" checked={convertLinksToImages} onChange={(e) => {
                setConvertLinksToImages(e.target.checked);
                if (analyzeResult) {
                  // Recompute with toggle change
                  const newMd = recomputeMarkdown(analyzeResult.markdown, queue);
                  setMarkdown(newMd);
                }
              }} />
              Convert file links to images
            </label>
            <button onClick={handleCancel} className="px-4 py-2 rounded-md border">Cancel</button>
            <button
              disabled={queue.length === 0 || isUploading}
              onClick={handleUploadAll}
              className={`px-4 py-2 rounded-md border ${queue.length === 0 || isUploading ? 'text-gray-400 border-gray-300' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {isUploading ? 'Uploading…' : `Upload file${queue.length > 1 ? 's' : ''}`}
            </button>
            <button
              disabled={!markdown || isUploading}
              onClick={() => { try { localStorage.removeItem(STORAGE_KEY); } catch {}; onConfirm({ markdown, html: processedHtml }); }}
              className={`px-4 py-2 rounded-md text-white ${(isUploading || !markdown) ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Add to Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasteImportModal;
