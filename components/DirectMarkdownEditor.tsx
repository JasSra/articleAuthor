'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { FileService } from '@/api/consolidated';
import { withAuthenticatedAPI } from '@/lib/consolidatedApi';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { createAIEditorService, SuggestionType } from '@/lib/aiEditorService';
import { handleApiCall } from '@/lib/apiErrorHandler';
import type { AISuggestion, PredictionContext } from '@/api/consolidated';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface DirectMarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  enableAISuggestions?: boolean;
  className?: string;
}

interface EditorToolbarProps {
  onImageUpload: (file: File) => void;
  onInsertText: (text: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  aiSuggestions: AISuggestion[];
  onApplySuggestion: (suggestion: AISuggestion) => void;
}

const DirectMarkdownToolbar: React.FC<EditorToolbarProps> = ({
  onImageUpload,
  onInsertText,
  showPreview,
  onTogglePreview,
  aiSuggestions,
  onApplySuggestion,
}) => {
  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    onInsertText(`${before}${placeholder}${after}`);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center space-x-2">
        {/* Text Formatting */}
        <button
          onClick={() => insertMarkdown('**', '**', 'bold text')}
          className="px-2 py-1 rounded text-sm font-bold text-gray-600 hover:bg-gray-100"
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => insertMarkdown('*', '*', 'italic text')}
          className="px-2 py-1 rounded text-sm italic text-gray-600 hover:bg-gray-100"
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => insertMarkdown('~~', '~~', 'strikethrough')}
          className="px-2 py-1 rounded text-sm line-through text-gray-600 hover:bg-gray-100"
          title="Strikethrough"
        >
          S
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Headers */}
        <button
          onClick={() => insertMarkdown('# ', '', 'Heading 1')}
          className="px-2 py-1 rounded text-sm font-bold text-gray-600 hover:bg-gray-100"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => insertMarkdown('## ', '', 'Heading 2')}
          className="px-2 py-1 rounded text-sm font-semibold text-gray-600 hover:bg-gray-100"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => insertMarkdown('### ', '', 'Heading 3')}
          className="px-2 py-1 rounded text-sm font-medium text-gray-600 hover:bg-gray-100"
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Lists */}
        <button
          onClick={() => insertMarkdown('- ', '', 'List item')}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => insertMarkdown('1. ', '', 'List item')}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Code and Quotes */}
        <button
          onClick={() => insertMarkdown('`', '`', 'code')}
          className="px-2 py-1 rounded text-sm font-mono text-gray-600 hover:bg-gray-100"
          title="Inline Code"
        >
          {'</>'}
        </button>
        <button
          onClick={() => insertMarkdown('```\n', '\n```', 'code block')}
          className="px-2 py-1 rounded text-sm font-mono text-gray-600 hover:bg-gray-100"
          title="Code Block"
        >
          {'{ }'}
        </button>
        <button
          onClick={() => insertMarkdown('> ', '', 'Quote')}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
          title="Quote"
        >
          ❝ Quote
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Links and Images */}
        <button
          onClick={() => insertMarkdown('[', '](url)', 'link text')}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
          title="Link"
        >
          🔗 Link
        </button>
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpload(file);
          }}
          className="hidden"
          id="markdown-image-upload"
        />
        <label
          htmlFor="markdown-image-upload"
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
          title="Upload Image"
        >
          📷 Image
        </label>

        {/* Divider and Table */}
        <button
          onClick={() => insertMarkdown('\n---\n', '', '')}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
          title="Horizontal Rule"
        >
          ―――
        </button>
        <button
          onClick={() => insertMarkdown('\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', '', '')}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
          title="Table"
        >
          📊 Table
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

export default function DirectMarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Start writing in markdown...',
  enableAISuggestions = true,
  className = '',
}: DirectMarkdownEditorProps) {
  const [content, setContent] = useState(value);
  const [showPreview, setShowPreview] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { jwt } = useAuth();

  // Update content when prop changes
  React.useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange?.(newContent);
    
    // Trigger AI suggestions after a delay
    if (enableAISuggestions) {
      debouncedGetSuggestions(newContent);
    }
  };

  // Image upload using FileService with error handling
  const handleImageUpload = async (file: File) => {
    if (!jwt) {
      toast.error('Please log in to upload images');
      return;
    }

    setIsUploadingImage(true);
    try {
      const result = await handleApiCall(
        () => withAuthenticatedAPI(jwt, async () => {
          const formData = { File: file };
          return await FileService.postApiFileUpload(formData);
        }),
        {
          context: 'Upload Image',
          showToast: true
        }
      );
      
      if (result?.outcome === 'Success' && result.data) {
        // Get the file ID and create public URL
        const fileId = result.data.id;
        const publicUrl = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229'}/api/file/${fileId}`;
        
        // Insert markdown image syntax
        const imageMarkdown = `![${file.name}](${publicUrl})`;
        insertTextAtCursor(imageMarkdown);
        
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(result?.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      // Error handling is done by handleApiCall, no need for additional toast
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Insert text at cursor position
  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    handleContentChange(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // AI Suggestions using real service
  const getSuggestions = useCallback(async (content: string) => {
    if (!jwt || !enableAISuggestions || content.length < 50) return;

    setIsLoadingSuggestions(true);
    try {
      const aiService = createAIEditorService(jwt);
      
      // Get cursor position from textarea
      const cursorPosition = textareaRef.current?.selectionStart || 0;
      const selectedText = textareaRef.current?.selectionStart !== textareaRef.current?.selectionEnd 
        ? content.substring(textareaRef.current?.selectionStart || 0, textareaRef.current?.selectionEnd || 0)
        : undefined;
      
      // Build editor context
      const context = {
        content,
        cursorPosition,
        selectedText,
        contentType: 'markdown' as const,
        metadata: {
          audience: 'general',
          purpose: 'article'
        }
      };
      
      // Get context-aware suggestions
      const suggestions = await aiService.getSuggestions(context, {
        types: [SuggestionType.CONTENT_IMPROVEMENT, SuggestionType.FORMATTING],
        maxSuggestions: 3,
        includeContent: true,
        includeFormatting: true
      });
      
      if (suggestions.length > 0) {
        setAiSuggestions(suggestions);
      } else {
        // Clear suggestions if none found
        setAiSuggestions([]);
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      // Fallback to empty suggestions on error
      setAiSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [jwt, enableAISuggestions]);

  // Debounced suggestions
  const debouncedGetSuggestions = useMemo(
    () => debounce(getSuggestions, 2000),
    [getSuggestions]
  );

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.action?.parameters?.text) {
      insertTextAtCursor(suggestion.action.parameters.text);
    }
    // Remove applied suggestion
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  // Auto-resize textarea
  const handleTextareaResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(400, textarea.scrollHeight)}px`;
    }
  };

  React.useEffect(() => {
    handleTextareaResize();
  }, [content]);

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* AI Suggestions Panel */}
      {enableAISuggestions && aiSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 flex items-center">
              ✨ AI Writing Suggestions
            </h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
              {aiSuggestions.length} suggestions
            </span>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion) => (
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleApplySuggestion(suggestion)}
                        className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 transition-colors"
                      >
                        {suggestion.action?.label || 'Apply'}
                      </button>
                      <button
                        onClick={() => handleDismissSuggestion(suggestion.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <DirectMarkdownToolbar
        onImageUpload={handleImageUpload}
        onInsertText={insertTextAtCursor}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        aiSuggestions={aiSuggestions}
        onApplySuggestion={handleApplySuggestion}
      />

      {/* Editor Area */}
      <div className={`flex ${showPreview ? 'h-96' : ''}`}>
        {/* Markdown Input */}
        <div className={`${showPreview ? 'w-1/2 border-r border-gray-200' : 'w-full'} bg-white relative`}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[400px] p-6 border-0 outline-0 resize-none font-mono text-sm leading-relaxed"
          />
          {isUploadingImage && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin h-4 w-4 border border-gray-400 border-t-transparent rounded-full"></div>
                <span>Uploading image...</span>
              </div>
            </div>
          )}
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
                  {content || '*Start typing to see preview...*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
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
          <span>Direct Markdown Editor</span>
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
