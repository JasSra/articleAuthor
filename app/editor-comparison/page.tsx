'use client';

import React, { useState } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import DirectMarkdownEditor from '@/components/DirectMarkdownEditor';

export default function EditorComparison() {
  const [activeEditor, setActiveEditor] = useState<'rich' | 'direct'>('direct');
  const [content, setContent] = useState(`# Welcome to the Editor Comparison

This demo shows both editor types:

## Rich Text Editor (TipTap-based)
- WYSIWYG editing experience
- Converts to markdown in the background
- More familiar for non-technical users

## Direct Markdown Editor
- Pure markdown input
- Real-time preview
- Perfect for developers and markdown enthusiasts

Try switching between them using the toggle above!

### Features in both editors:
- **AI suggestions** for content improvement
- **Image upload** with FileService integration
- **Live preview** capabilities
- **Comprehensive toolbars**

\`\`\`javascript
// Both support syntax highlighting
function compareEditors() {
  return "Choose what works best for you!";
}
\`\`\`

> **Note**: Images uploaded through either editor use the consolidated API's FileService with public URLs.`);

  const handleContentChange = (markdown: string, html?: string) => {
    setContent(markdown);
    console.log('Content updated:', { markdown, html });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Editor Comparison Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Compare our Rich Text Editor vs Direct Markdown Editor
          </p>
          
          {/* Editor Toggle */}
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setActiveEditor('rich')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeEditor === 'rich'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rich Text Editor (TipTap)
            </button>
            <button
              onClick={() => setActiveEditor('direct')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeEditor === 'direct'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Direct Markdown Editor
            </button>
          </div>
        </div>

        {/* Editor Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeEditor === 'rich' ? 'Rich Text Editor' : 'Direct Markdown Editor'}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>AI Suggestions: ✨ Enabled</span>
                <span>File Upload: 📁 FileService</span>
                <span>Live Preview: 👁️ Available</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {activeEditor === 'rich' ? (
              <MarkdownEditor
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing with the rich text editor..."
                enableAISuggestions={true}
                className="min-h-[600px]"
              />
            ) : (
              <DirectMarkdownEditor
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing in markdown..."
                enableAISuggestions={true}
                className="min-h-[600px]"
              />
            )}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
              🎨 Rich Text Editor (TipTap)
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                WYSIWYG editing experience
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Familiar interface for non-technical users
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Rich formatting toolbar
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Automatic markdown conversion
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                AI suggestions integration
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Image upload with FileService
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
              📝 Direct Markdown Editor
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Pure markdown input/output
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Perfect for developers
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Side-by-side live preview
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Keyboard shortcuts for speed
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                AI suggestions with context
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Direct FileService integration
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔧 Technical Implementation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">File Upload</h4>
              <p className="text-sm text-gray-600">
                Both editors use the consolidated API's FileService with public flag for image uploads.
                Files are accessible via <code>/api/file/{'{fileId}'}</code>
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Integration</h4>
              <p className="text-sm text-gray-600">
                AI suggestions powered by EventTracker service with contextual analysis
                and confidence scoring for content improvement.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Live Preview</h4>
              <p className="text-sm text-gray-600">
                Real-time markdown rendering with GitHub Flavored Markdown support
                and syntax highlighting for code blocks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
