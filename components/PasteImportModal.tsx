'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { processPastedHtml } from '@/lib/utils/pasteImport';

interface PasteImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (result: { markdown: string; html: string }) => void;
}

export const PasteImportModal: React.FC<PasteImportModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { jwt } = useAuth();
  const [rawHtml, setRawHtml] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setRawHtml('');
      setMarkdown('');
      setProcessedHtml('');
      setStatus('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Intercept paste and extract HTML/text
    e.preventDefault();
    const dt = e.clipboardData;
    const html = dt.getData('text/html');
    const text = dt.getData('text/plain');
    const content = html || `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
    setRawHtml(content);

    if (!jwt) {
      setStatus('Sign in required to upload images.');
      return;
    }

    setIsProcessing(true);
    setStatus('Analyzing and converting...');
    try {
      const result = await processPastedHtml(content, jwt, (s: string) => setStatus(s));
      setMarkdown(result.markdown);
      setProcessedHtml(result.html);
      setStatus(result.summary || 'Ready to import');
    } catch (err) {
      console.error(err);
      setStatus('Failed to process pasted content.');
    } finally {
      setIsProcessing(false);
    }
  }, [jwt]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Import from Clipboard</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Paste website content into the area below. We will convert it to Markdown, upload images to storage, and keep original image links as hidden comments.</p>
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
          </div>

          <div className="text-xs text-gray-500">{status}</div>

          {markdown && (
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md overflow-hidden">
                <div className="px-3 py-2 border-b text-xs font-medium text-gray-600 bg-gray-50">Markdown Preview</div>
                <div className="p-4 prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{
                    img: ({ src, alt }: { src?: string; alt?: string }) => (
                      <Image src={src || ''} alt={alt || ''} width={600} height={400} className="max-w-full h-auto rounded" />
                    ),
                    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
                      <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>
                    )
                  }}>
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="border rounded-md overflow-hidden">
                <div className="px-3 py-2 border-b text-xs font-medium text-gray-600 bg-gray-50">Original HTML (processed)</div>
                <div className="p-4 max-h-[400px] overflow-auto">
                  {/* eslint-disable-next-line react/no-danger */}
                  <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-end gap-2 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
          <button
            disabled={!markdown || isProcessing}
            onClick={() => onConfirm({ markdown, html: processedHtml })}
            className={`px-4 py-2 rounded-md text-white ${isProcessing || !markdown ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isProcessing ? 'Processing…' : 'Add to Article'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasteImportModal;
