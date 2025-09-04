'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Article, createApiClient } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth/MSALProvider';
import { uploadFile } from '@/lib/upload';
import StatusBadge from './StatusBadge';

interface ArticleFormProps {
  article?: Article;
  onSave?: (article: Article) => void;
  onSubmit?: (article: Article) => void;
}

export default function ArticleForm({ article, onSave, onSubmit }: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [status, setStatus] = useState(article?.status || 'draft');
  const [loading, setLoading] = useState(false);
  const { jwt } = useAuth();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
    ],
    content: article?.body_json || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Generate slug from title
  useEffect(() => {
    if (title && !article) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }, [title, article]);

  const handleImageUpload = async (file: File) => {
    if (!jwt) return;

    try {
      const url = await uploadFile(jwt, file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleSave = async () => {
    if (!jwt || !editor) return;

    setLoading(true);
    try {
      const api = createApiClient({ jwt });
      const body_json = editor.getJSON();
      
      const articleData = {
        title,
        slug,
        body_json,
        images: [], // Extract from body_json if needed
        status,
        tags,
        month_tag: new Date().toISOString().slice(0, 7),
        authorId: 'current-user-id', // From JWT
      };

      let savedArticle: Article;
      if (article?.id) {
        savedArticle = await api.updateArticle(article.id, articleData);
      } else {
        savedArticle = await api.createArticle(articleData);
      }

      onSave?.(savedArticle);
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!jwt || !article?.id) return;

    setLoading(true);
    try {
      const api = createApiClient({ jwt });
      
      // Submit form to trigger workflow
      await api.submitForm('{{ SUBMIT_FORM_ID }}', {
        articleId: article.id,
      });

      // Update status
      const updatedArticle = await api.updateArticle(article.id, {
        status: 'submitted',
      });

      onSubmit?.(updatedArticle);
    } catch (error) {
      console.error('Failed to submit article:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {article ? 'Edit Article' : 'New Article'}
            </h2>
            {article && <StatusBadge status={status} />}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={loading || !title}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            {status === 'draft' && article && (
              <button
                onClick={handleSubmitForReview}
                disabled={loading || !title}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter article title..."
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="article-slug"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Add tags (press Enter)..."
          />
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            {/* Editor Toolbar */}
            <div className="flex items-center space-x-2 p-3 bg-gray-50 border-b border-gray-200">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded text-sm ${
                  editor.isActive('bold') ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded text-sm ${
                  editor.isActive('italic') ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Italic
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded text-sm ${
                  editor.isActive('heading', { level: 2 }) ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                H2
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2 py-1 rounded text-sm ${
                  editor.isActive('bulletList') ? 'bg-primary-100 text-primary-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                • List
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                📷 Image
              </label>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
