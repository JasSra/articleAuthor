'use client';

import React, { useState, useEffect } from 'react';
import { Article, createApiClient } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { useUserStore } from '@/lib/store/userStore';
import StatusBadge from './StatusBadge';
import WorkflowVisualization from './WorkflowVisualization';
import MarkdownEditor from './MarkdownEditor';
import DirectMarkdownEditor from './DirectMarkdownEditor';
import AutoSaveIndicator from './AutoSaveIndicator';

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
  const [content, setContent] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [editorType, setEditorType] = useState<'rich' | 'direct'>('direct'); // Default to direct markdown
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [autoSaveError, setAutoSaveError] = useState<string>('');
  
  const { jwt } = useAuth();
  const { preferences } = useUserStore();
  
  // Auto-save functionality
  const { forceSave, isSaving, hasUnsavedChanges } = useAutoSave({
    articleId: article?.id,
    content: content,
    title: title,
    enabled: status === 'draft' && !!article?.id,
    onSave: (success) => {
      if (success) {
        setLastSaved(new Date());
        setAutoSaveError('');
      }
    },
    onError: (error) => {
      setAutoSaveError(error.message);
    }
  });

  // Initialize content from article if editing
  useEffect(() => {
    if (article?.body_json) {
      // Convert JSON content to markdown if needed
      const htmlContent = typeof article.body_json === 'string' ? article.body_json : JSON.stringify(article.body_json);
      setContentHtml(htmlContent);
      // Basic HTML to markdown conversion for initial content
      const markdownContent = htmlContent
        .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]*>/g, '')
        .trim();
      setContent(markdownContent);
    }
  }, [article]);

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

  const handleContentChange = (markdown: string, html: string) => {
    setContent(markdown);
    setContentHtml(html);
  };

  const handleSave = async () => {
    if (!jwt) return;

    setLoading(true);
    try {
      const api = createApiClient({ jwt });
      
      const articleData = {
        title,
        slug,
        body_json: contentHtml, // Store the HTML version
        images: [], // Extract from contentHtml if needed
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
            {/* Auto-save indicator */}
            {article && preferences.autoSave && (
              <AutoSaveIndicator
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                lastSaved={lastSaved}
                error={autoSaveError}
              />
            )}
          </div>
          <div className="flex items-center space-x-3">
            {/* Force save button for manual save */}
            {article && hasUnsavedChanges && (
              <button
                onClick={forceSave}
                disabled={isSaving}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50"
              >
                Save Now
              </button>
            )}
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

        {/* Editor Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Editor Type
          </label>
          <div className="flex rounded-lg border border-gray-300 bg-white p-1 w-fit">
            <button
              type="button"
              onClick={() => setEditorType('rich')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                editorType === 'rich'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎨 Rich Text Editor
            </button>
            <button
              type="button"
              onClick={() => setEditorType('direct')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                editorType === 'direct'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Direct Markdown
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {editorType === 'rich' 
              ? 'WYSIWYG editor with rich formatting toolbar'
              : 'Pure markdown editor with live preview'
            }
          </p>
        </div>

        {/* Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          {editorType === 'rich' ? (
            <MarkdownEditor
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your article..."
              enableAISuggestions={true}
              className="min-h-[500px]"
            />
          ) : (
            <DirectMarkdownEditor
              value={content}
              onChange={(markdown) => handleContentChange(markdown, markdown)}
              placeholder="Start writing in markdown..."
              enableAISuggestions={true}
              className="min-h-[500px]"
            />
          )}
        </div>

        {/* Workflow Visualization - show when editing existing article */}
        {article && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg">
            <WorkflowVisualization currentStatus={status} />
          </div>
        )}
      </div>
    </div>
  );
}
