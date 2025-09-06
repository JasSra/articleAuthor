'use client';

import React from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { useState } from 'react';

export default function MarkdownDemo() {
  const [content, setContent] = useState(`# Welcome to the Enhanced Markdown Editor

This is a demonstration of our new **AI-powered** markdown editor with live preview capabilities.

## Features

- **Rich text editing** with TipTap
- **Live preview** mode (toggle with the preview button)
- **AI suggestions** for content improvement
- **Image upload** support
- **Syntax highlighting** for code blocks

### Try These Features:

1. Type some content and watch AI suggestions appear
2. Click the preview button to see rendered output
3. Use the toolbar for quick formatting
4. Upload an image using the camera icon

\`\`\`javascript
// Example code block
function enhancedEditor() {
  return "Amazing AI-powered writing experience!";
}
\`\`\`

> This is a blockquote to demonstrate formatting capabilities.

**Try editing this content to see the AI suggestions in action!**`);

  const handleContentChange = (markdown: string, html: string) => {
    setContent(markdown);
    console.log('Markdown:', markdown);
    console.log('HTML:', html);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced Markdown Editor Demo
          </h1>
          <p className="text-lg text-gray-600">
            Experience our AI-powered markdown editor with live preview and smart suggestions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <MarkdownEditor
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your amazing content..."
            enableAISuggestions={true}
            className="min-h-[600px]"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-purple-600 mb-3">
              ✨ AI Suggestions
            </h3>
            <p className="text-gray-600">
              Get intelligent writing suggestions as you type. AI analyzes your content and provides 
              contextual recommendations for improvement.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">
              👁️ Live Preview
            </h3>
            <p className="text-gray-600">
              Toggle between edit and preview modes to see your markdown rendered in real-time. 
              Perfect for ensuring your content looks exactly as intended.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-green-600 mb-3">
              🚀 Enhanced Features
            </h3>
            <p className="text-gray-600">
              Professional toolbar, image uploads, syntax highlighting, and comprehensive 
              markdown support including tables, lists, and code blocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
