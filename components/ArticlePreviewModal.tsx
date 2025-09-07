"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Article, createApiClient } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import StatusBadge from './StatusBadge';
import { 
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface ArticlePreviewModalProps {
  articleId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (articleId: string) => void;
  onBookmark?: (articleId: string) => void;
  isBookmarked?: boolean;
}

export default function ArticlePreviewModal({ 
  articleId, 
  isOpen, 
  onClose, 
  onEdit,
  onBookmark,
  isBookmarked = false 
}: ArticlePreviewModalProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { jwt } = useAuth();

  const loadArticle = useCallback(async () => {
    if (!articleId || !jwt) return;

    setLoading(true);
    setError('');
    
    try {
      const api = createApiClient({ jwt });
      const result = await api.getArticleById(articleId);
      setArticle(result);
    } catch (err: any) {
      console.error('Failed to load article:', err);
      setError('Failed to load article content');
    } finally {
      setLoading(false);
    }
  }, [articleId, jwt]);

  useEffect(() => {
    if (isOpen && articleId && jwt) {
      loadArticle();
    }
  }, [isOpen, articleId, jwt, loadArticle]);

  const formatContent = (bodyJson: any) => {
    if (!bodyJson) return 'No content available';
    
    if (typeof bodyJson === 'string') {
      // If it's HTML, strip tags for preview
      return bodyJson.replace(/<[^>]*>/g, '').substring(0, 500) + '...';
    }
    
    // If it's JSON, try to extract readable content
    try {
      const parsed = typeof bodyJson === 'object' ? bodyJson : JSON.parse(bodyJson);
      if (parsed.content) {
        return parsed.content.substring(0, 500) + '...';
      }
      return JSON.stringify(parsed, null, 2).substring(0, 500) + '...';
    } catch {
      return 'Content preview not available';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <EyeIcon className="h-6 w-6 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Article Preview</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close preview"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading article...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-600">{error}</div>
              </div>
            ) : article ? (
              <div className="space-y-6">
                {/* Article Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StatusBadge status={article.status} />
                    <div className="flex items-center space-x-2">
                      {onBookmark && (
                        <button
                          onClick={() => onBookmark(article.id)}
                          className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        >
                          {isBookmarked ? (
                            <BookmarkIconSolid className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <BookmarkIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                      <button 
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Share article"
                      >
                        <ShareIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                    <span>By {article.authorId}</span>
                    <span>•</span>
                    <span>{new Date(article.createdUtc).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <span>•</span>
                    <span>Updated {new Date(article.updatedUtc).toLocaleDateString()}</span>
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Article Content Preview */}
                <div className="prose prose-lg max-w-none">
                  <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Content Preview</h3>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {formatContent(article.body_json)}
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      This is a preview of the article content. Click &quot;View Full Article&quot; to see the complete content with formatting.
                    </div>
                  </div>
                </div>

                {/* Article Metadata */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Article Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Slug:</span>
                      <span className="ml-2 text-gray-600">{article.slug}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2 text-gray-600 capitalize">{article.status}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(article.createdUtc).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Updated:</span>
                      <span className="ml-2 text-gray-600">
                        {new Date(article.updatedUtc).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">No article selected</div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {article && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <div className="flex items-center space-x-3">
                <a
                  href={`/article/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Full Article
                </a>
                {onEdit && article.status === 'draft' && (
                  <button
                    onClick={() => onEdit(article.id)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Article
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
