'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { configureConsolidatedAPI } from '@/lib/consolidatedApi';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { uploadFile } from '@/lib/upload';
import type { AISuggestion, PredictionContext } from '@/api/consolidated';
import Image from 'next/image';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string, html: string) => void;
  placeholder?: string;
  enableAISuggestions?: boolean;
  className?: string;
}

interface EditorToolbarProps {
  editor: any;
  onImageUpload: (file: File) => void;
  aiSuggestions: AISuggestion[];
  onApplySuggestion: (suggestion: AISuggestion) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onImageUpload,
  aiSuggestions,
  onApplySuggestion,
  showPreview,
  onTogglePreview,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        {/* Basic formatting */}
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

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Headings */}
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

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Lists */}
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

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Code */}
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

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Media */}
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

        {/* Quote and Divider */}
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
      </div>

      <div className="flex items-center space-x-2">
        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="relative group">
            <button className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all">
              ✨ AI ({aiSuggestions.length})
            </button>
            <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-3">
                <h4 className="font-medium text-gray-900 mb-2">AI Suggestions</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {aiSuggestions.slice(0, 3).map((suggestion) => (
                    <div key={suggestion.id} className="p-2 bg-gray-50 rounded border">
                      <p className="text-sm text-gray-800 mb-2">{suggestion.message}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onApplySuggestion(suggestion)}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Apply
                        </button>
                        {suggestion.confidence && (
                          <span className="text-xs text-gray-500">
                            {Math.round(suggestion.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { jwt } = useAuth();

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
      // Link.configure({
      //   openOnClick: false,
      //   HTMLAttributes: {
      //     class: 'text-blue-600 hover:text-blue-800 underline',
      //   },
      // }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] p-6 max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = convertHtmlToMarkdown(html);
      onChange?.(markdown, html);
      
      // Trigger AI suggestions after a delay
      if (enableAISuggestions) {
        debouncedGetSuggestions(html);
      }
    },
  });

  // Convert HTML to Markdown (basic conversion)
  const convertHtmlToMarkdown = (html: string): string => {
    return html
      .replace(/<h1>(.*?)<\/h1>/g, '# $1')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<pre><code>(.*?)<\/code><\/pre>/g, '```\n$1\n```')
      .replace(/<blockquote><p>(.*?)<\/p><\/blockquote>/g, '> $1')
      .replace(/<ul><li>(.*?)<\/li><\/ul>/g, '- $1')
      .replace(/<ol><li>(.*?)<\/li><\/ol>/g, '1. $1')
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<img src="(.*?)" alt="(.*?)">/g, '![$2]($1)')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
      .trim();
  };

  // AI Suggestions functionality
  const getSuggestions = useCallback(async (content: string) => {
    if (!jwt || !enableAISuggestions || content.length < 50) return;

    setIsLoadingSuggestions(true);
    try {
      // Configure the consolidated API with JWT
      configureConsolidatedAPI(jwt);
      
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

      const suggestions = await EventTrackerService.postApiEventTrackerSuggestions(predictionContext);
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
    if (!editor || !suggestion.action) return;

    switch (suggestion.action.type) {
      case 'insertText':
        editor.chain().focus().insertContent(suggestion.action.parameters?.text || '').run();
        break;
      case 'replaceSelection':
        const { from, to, replacement } = suggestion.action.parameters || {};
        if (from !== undefined && to !== undefined && replacement) {
          editor.chain().focus().deleteRange({ from, to }).insertContent(replacement).run();
        }
        break;
      case 'format':
        const { format } = suggestion.action.parameters || {};
        if (format === 'bold') editor.chain().focus().toggleBold().run();
        if (format === 'italic') editor.chain().focus().toggleItalic().run();
        break;
      default:
        console.log('Unknown suggestion action:', suggestion.action.type);
    }

    // Remove applied suggestion
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const editorHtml = editor?.getHTML() || '';
  const markdownContent = useMemo(() => convertHtmlToMarkdown(editorHtml), [editorHtml]);

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
        editor={editor}
        onImageUpload={handleImageUpload}
        aiSuggestions={aiSuggestions}
        onApplySuggestion={handleApplySuggestion}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      {/* Editor Area */}
      <div className={`flex ${showPreview ? 'h-96' : ''}`}>
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2 border-r border-gray-200' : 'w-full'} bg-white`}>
          <EditorContent editor={editor} />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 bg-gray-50 overflow-auto">
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-600 mb-4 border-b pb-2">Live Preview</h4>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    img: ({ src, alt }) => (
                      <Image 
                        src={src || ''} 
                        alt={alt || ''} 
                        width={600} 
                        height={400} 
                        className="max-w-full h-auto rounded-lg shadow-sm" 
                      />
                    ),
                    a: ({ href, children }) => (
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
