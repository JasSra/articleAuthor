'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
// import Link from '@tiptap/extension-link'; // Not available in current version
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { EventTrackerService } from '@/api/consolidated';
import { createApiClient } from '@/lib/apiClient';
import { withAuthenticatedAPI } from '@/lib/consolidatedApi';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { uploadFile } from '@/lib/upload';
import type { AISuggestion, PredictionContext } from '@/api/consolidated';
import Image from 'next/image';
import PasteImportModal from './PasteImportModal';
import { createTurndown } from '@/lib/utils/markdown';
import { marked } from 'marked';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string, html: string) => void;
  placeholder?: string;
  enableAISuggestions?: boolean;
  className?: string;
}

interface EditorToolbarProps {
  editor: any | null;
  onImageUpload: (file: File) => void;
  aiSuggestions: AISuggestion[];
  onApplySuggestion: (suggestion: AISuggestion) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  onOpenPasteImport: () => void;
  isPlain: boolean;
  onToggleMode: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onImageUpload,
  aiSuggestions,
  onApplySuggestion,
  showPreview,
  onTogglePreview,
  onOpenPasteImport,
  isPlain,
  onToggleMode,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        {/* Basic formatting */}
        {editor && (
          <>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded text-sm font-medium ${
                editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded text-sm italic ${
                editor.isActive('italic') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-2 py-1 rounded text-sm line-through ${
                editor.isActive('strike') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Strikethrough"
            >
              S
            </button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Headings */}
        {editor && (
          <>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-2 py-1 rounded text-sm font-bold ${
                editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded text-sm font-semibold ${
                editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 rounded text-sm font-medium ${
                editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Heading 3"
            >
              H3
            </button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Lists */}
        {editor && (
          <>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 rounded text-sm ${
                editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Bullet List"
            >
              • List
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-2 py-1 rounded text-sm ${
                editor.isActive('orderedList') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Numbered List"
            >
              1. List
            </button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Code */}
        {editor && (
          <>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`px-2 py-1 rounded text-sm font-mono ${
                editor.isActive('code') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Inline Code"
            >
              {'</>'}
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`px-2 py-1 rounded text-sm font-mono ${
                editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Code Block"
            >
              {'{ }'}
            </button>
          </>
        )}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Media */}
        {editor && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
              title="Upload Image"
            >
              📷 Image
            </label>
          </>
        )}
        <button
          onClick={onOpenPasteImport}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
          title="Import from clipboard"
        >
          📋 Import
        </button>

        {/* Quote and Divider */}
        {editor && (
          <>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`px-2 py-1 rounded text-sm ${
                editor.isActive('blockquote') ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Quote"
            >
              ❝ Quote
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
              title="Horizontal Rule"
            >
              ―――
            </button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Mode Toggle */}
        <button
          onClick={onToggleMode}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isPlain
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
          title="Toggle Editor Mode"
        >
          {isPlain ? 'Plain Editor' : 'Rich Editor'}
        </button>

        {/* Preview Toggle */}
        <button
          onClick={onTogglePreview}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            showPreview
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          title="Toggle Preview"
        >
          {showPreview ? '👁️ Hide Preview' : '👁️ Preview'}
        </button>
      </div>
    </div>
  );
};

const AISuggestionsPanel: React.FC<{
  suggestions: AISuggestion[];
  onApplySuggestion: (suggestion: AISuggestion) => void;
  onDismiss: (suggestionId: string) => void;
}> = ({ suggestions, onApplySuggestion, onDismiss }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex items-center">
          ✨ AI Writing Suggestions
        </h3>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {suggestions.length} suggestions
        </span>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                    {suggestion.type}
                  </span>
                  {suggestion.confidence && (
                    <span className="text-xs text-gray-500">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-800 mb-2">{suggestion.message}</p>
                {suggestion.action && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onApplySuggestion(suggestion)}
                      className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-colors"
                    >
                      {suggestion.action.label || 'Apply'}
                    </button>
                    <button
                      onClick={() => onDismiss(suggestion.id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Start writing your article...',
  enableAISuggestions = true,
  className = '',
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [usePlainEditor, setUsePlainEditor] = useState(true);
  const [plainValue, setPlainValue] = useState<string>(value || '');
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteInitialHtml, setPasteInitialHtml] = useState<string | undefined>(undefined);
  const { jwt } = useAuth();
  const STORAGE_KEY = 'article-editor-draft-v1';
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastSelection = useRef<{ start: number; end: number } | null>(null);

  // Converters
  const turndown = useMemo(() => createTurndown(), []);

  const htmlToMarkdown = useCallback((html: string) => turndown.turndown(html), [turndown]);

  const markdownToHtml = useCallback((md: string) => {
    try {
      return marked.parse(md) as string;
    } catch {
      return md;
    }
  }, []);

  const initialHtml = useMemo(() => {
    const looksLikeHtml = /<\w+[^>]*>/.test(value);
    return looksLikeHtml ? value : markdownToHtml(value || '');
  }, [value, markdownToHtml]);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { markdown?: string };
        if (parsed.markdown) {
          setPlainValue(parsed.markdown);
          onChange?.(parsed.markdown, markdownToHtml(parsed.markdown));
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setPlainValue(value || '');
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 p-4 rounded font-mono text-sm border',
          },
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialHtml,
    immediatelyRender: false,
  enableInputRules: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] p-6 max-w-none',
      },
      handlePaste(view, event) {
        if (!view || !event) return false;
        if (usePlainEditor) return false; // will be handled by textarea onPaste
        const clipboard = (event as ClipboardEvent).clipboardData;
        if (!clipboard) return false;
        const html = clipboard.getData('text/html');
        if (html && /<\w+[^>]*>/.test(html)) {
          event.preventDefault();
          setPasteInitialHtml(html);
          setIsPasteModalOpen(true);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      if (!usePlainEditor) {
        onChange?.(markdown, html);
      }
      if (enableAISuggestions) {
        debouncedGetSuggestions(html);
      }
    },
  });

  // AI Suggestions functionality
  const getSuggestions = useCallback(async (content: string) => {
    if (!jwt || !enableAISuggestions || content.length < 50) return;

    setIsLoadingSuggestions(true);
    try {
      // Use authenticated API wrapper to ensure JWT is configured
      const suggestions = await withAuthenticatedAPI(jwt, async () => {
        const predictionContext: PredictionContext = {
          pageName: 'article-editor',
          userRole: 'author',
          sessionId: `editor-${Date.now()}`,
          timestamp: new Date().toISOString(),
          recentActions: ['writing', 'editing'],
          sessionMetadata: {
            contentLength: content.length,
            wordCount: content.split(/\s+/).length,
            hasImages: content.includes('<img'),
            hasLinks: content.includes('<a href'),
          },
        };

        return await EventTrackerService.postApiEventTrackerSuggestions(predictionContext);
      });
      
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      // Set some mock suggestions for demo purposes
  setAiSuggestions([
        {
          id: '1',
          type: 'content-improvement',
          message: 'Consider adding more descriptive headings to improve readability.',
          action: {
            type: 'insertText',
            label: 'Add heading',
            parameters: { text: '\n\n## Key Points\n\n' }
          },
          confidence: 0.85,
          priority: 'medium'
        },
        {
          id: '2',
          type: 'grammar',
          message: 'Consider breaking up long paragraphs for better readability.',
          action: {
            type: 'format',
            label: 'Break paragraph',
            parameters: { format: 'paragraph-break' }
          },
          confidence: 0.75,
          priority: 'low'
        }
      ]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [jwt, enableAISuggestions]);

  // Debounced suggestions
  const debouncedGetSuggestions = useMemo(
    () => debounce(getSuggestions, 2000),
    [getSuggestions]
  );

  const handleImageUpload = async (file: File) => {
    if (!jwt) return;

    try {
      const url = await uploadFile(jwt, file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (!suggestion.action) return;

    // Plain editor path
    if (usePlainEditor) {
      const applyToTextarea = (inserter: (value: string, start: number, end: number) => string) => {
        const el = textareaRef.current;
        const start = el?.selectionStart ?? plainValue.length;
        const end = el?.selectionEnd ?? plainValue.length;
        const next = inserter(plainValue, start, end);
        setPlainValue(next);
        onChange?.(next, markdownToHtml(next));
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ markdown: next })); } catch {}
        // restore focus and selection after update
        requestAnimationFrame(() => {
          if (el) {
            el.focus();
            const pos = start + (suggestion.action?.type === 'insertText' ? (suggestion.action.parameters?.text?.length || 0) : 0);
            el.setSelectionRange(pos, pos);
          }
        });
      };

      switch (suggestion.action.type) {
        case 'insertText': {
          const text: string = suggestion.action.parameters?.text || '';
          applyToTextarea((v, s, e) => v.slice(0, s) + text + v.slice(e));
          break;
        }
        case 'replaceSelection': {
          // Use current selection; ignore provided from/to that may not map to textarea
          const replacement: string = suggestion.action.parameters?.replacement || '';
          applyToTextarea((v, s, e) => v.slice(0, s) + replacement + v.slice(e));
          break;
        }
        case 'format': {
          const format = suggestion.action.parameters?.format;
          if (format === 'paragraph-break') {
            applyToTextarea((v, s, e) => v.slice(0, s) + '\n\n' + v.slice(e));
          } else if (format === 'bold') {
            applyToTextarea((v, s, e) => v.slice(0, s) + '**' + v.slice(s, e) + '**' + v.slice(e));
          } else if (format === 'italic') {
            applyToTextarea((v, s, e) => v.slice(0, s) + '*' + v.slice(s, e) + '*' + v.slice(e));
          }
          break;
        }
        default:
          break;
      }

      setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      return;
    }

    // Rich editor path
    if (!editor) return;
    switch (suggestion.action.type) {
      case 'insertText':
        editor.chain().focus().insertContent(suggestion.action.parameters?.text || '').run();
        break;
      case 'replaceSelection': {
        const { from, to, replacement } = suggestion.action.parameters || {};
        if (from !== undefined && to !== undefined && replacement) {
          editor.chain().focus().deleteRange({ from, to }).insertContent(replacement).run();
        }
        break;
      }
      case 'format': {
        const { format } = suggestion.action.parameters || {};
        if (format === 'bold') editor.chain().focus().toggleBold().run();
        if (format === 'italic') editor.chain().focus().toggleItalic().run();
        break;
      }
      default:
        break;
    }
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const editorHtml = editor?.getHTML() || '';
  const markdownContent = useMemo(
    () => (usePlainEditor ? plainValue : htmlToMarkdown(editorHtml)),
    [usePlainEditor, plainValue, editorHtml, htmlToMarkdown]
  );

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-8 text-center text-gray-500">
        Loading editor...
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* AI Suggestions Panel */}
      {enableAISuggestions && (
        <AISuggestionsPanel
          suggestions={aiSuggestions}
          onApplySuggestion={handleApplySuggestion}
          onDismiss={handleDismissSuggestion}
        />
      )}

      {/* Editor Toolbar */}
      <EditorToolbar
        editor={usePlainEditor ? null : editor}
        onImageUpload={handleImageUpload}
        aiSuggestions={aiSuggestions}
        onApplySuggestion={handleApplySuggestion}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onOpenPasteImport={() => setIsPasteModalOpen(true)}
        isPlain={usePlainEditor}
        onToggleMode={() => {
          if (usePlainEditor) {
            const html = markdownToHtml(plainValue);
            editor?.commands.setContent(html);
          } else {
            const md = htmlToMarkdown(editorHtml);
            setPlainValue(md);
            onChange?.(md, markdownToHtml(md));
          }
          setUsePlainEditor(!usePlainEditor);
        }}
      />

      <PasteImportModal
        isOpen={isPasteModalOpen}
        onClose={() => { setIsPasteModalOpen(false); setPasteInitialHtml(undefined); }}
        initialHtml={pasteInitialHtml}
        onConfirm={({ markdown: md }) => {
          if (usePlainEditor) {
            const next = `${plainValue}\n\n${md}\n\n`;
            setPlainValue(next);
            onChange?.(next, markdownToHtml(next));
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ markdown: next })); } catch {}
          } else {
            editor?.chain().focus().insertContent(`\n\n${md}\n\n`).run();
          }
          setIsPasteModalOpen(false);
          setPasteInitialHtml(undefined);
        }}
      />

      {/* Editor Area */}
      <div className={`flex ${showPreview ? 'h-96' : ''}`}>
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2 border-r border-gray-200' : 'w-full'} bg-white min-w-0`}>
          {usePlainEditor ? (
            <textarea
              ref={textareaRef}
              value={plainValue}
              onChange={(e) => {
                setPlainValue(e.target.value);
                onChange?.(e.target.value, markdownToHtml(e.target.value));
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ markdown: e.target.value })); } catch {}
              }}
              onSelect={(e) => {
                const el = e.currentTarget;
                lastSelection.current = { start: el.selectionStart, end: el.selectionEnd };
              }}
              onKeyUp={(e) => {
                const el = e.currentTarget;
                lastSelection.current = { start: el.selectionStart, end: el.selectionEnd };
              }}
              onPaste={(e) => {
                // Intercept Ctrl+V in plain editor and open import modal
                e.preventDefault();
                const dt = e.clipboardData;
                const html = dt?.getData('text/html');
                const text = dt?.getData('text/plain') || '';
                const content = html && /<\w+[^>]*>/.test(html) ? html : `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
                setPasteInitialHtml(content);
                setIsPasteModalOpen(true);
              }}
              className="w-full h-full min-h-[24rem] p-6 font-mono text-sm outline-none"
              placeholder={placeholder}
            />
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 bg-gray-50 overflow-auto min-w-0">
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-600 mb-4 border-b pb-2">Live Preview</h4>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    img: ({ src, alt }: { src?: string; alt?: string }) => (
                      <Image
                        src={src || ''}
                        alt={alt || ''}
                        width={600}
                        height={400}
                        className="max-w-full h-auto rounded-lg shadow-sm"
                      />
                    ),
                    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
                      <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Words: {markdownContent.split(/\s+/).filter(Boolean).length}</span>
          <span>Characters: {markdownContent.length}</span>
          {isLoadingSuggestions && (
            <span className="flex items-center">
              <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full mr-1"></div>
              Getting AI suggestions...
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {enableAISuggestions && (
            <span className="text-purple-600">✨ AI Suggestions Enabled</span>
          )}
          <span>Markdown Editor</span>
        </div>
      </div>
    </div>
  );
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}
