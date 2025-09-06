'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createApiClient, Article } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import StatusBadge from '@/components/StatusBadge';
import ShareArticle from '@/components/ShareArticle';
import ContentRenderer from '@/components/ContentRenderer';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { jwt, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadArticleData = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Try authenticated request first if user is logged in
        if (isAuthenticated && jwt) {
          const api = createApiClient({ jwt });
          const result = await api.getArticleBySlug(slug);
          setArticle(result);
        } else {
          // For public access, we might need a different endpoint or handle this differently
          // For now, show a message that the article requires authentication
          setError('Please sign in to view this article');
        }
      } catch (err: any) {
        console.error('Failed to load article:', err);
        setError('Article not found or you do not have permission to view it');
      } finally {
        setLoading(false);
      }
    };

    loadArticleData();
  }, [slug, jwt, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Link
              href="/articles"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse Articles
            </Link>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/articles"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <Link
              href="/articles"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← Back to Stories
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
                <StatusBadge status={article.status} />
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <span>By {article.authorId}</span>
                <span>•</span>
                <span>{new Date(article.createdUtc).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                {article.tags && article.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Share Section */}
          <ShareArticle 
            article={{ 
              title: article.title, 
              slug: article.slug, 
              id: article.id 
            }} 
            className="mt-6 pt-6 border-t border-gray-200"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8">
            {article.body_json ? (
              <div className="prose prose-lg max-w-none">
                {/* Render article content - simplified for now */}
                <div dangerouslySetInnerHTML={{ 
                  __html: typeof article.body_json === 'string' 
                    ? article.body_json 
                    : JSON.stringify(article.body_json, null, 2)
                }} />
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Article content is not available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom share section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Enjoyed this story?</h3>
            <p className="text-gray-600">Share it with others who might find it interesting.</p>
          </div>
          <ShareArticle 
            article={{ 
              title: article.title, 
              slug: article.slug, 
              id: article.id 
            }} 
            className="justify-center"
          />
        </div>

        {/* Author actions (if author) */}
        {isAuthenticated && article.authorId === 'current-user-id' && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Manage Your Article</h3>
                <p className="text-blue-700">Edit, update status, or view analytics for your story.</p>
              </div>
              <div className="flex space-x-3">
                {article.status === 'draft' && (
                  <Link
                    href={`/submit?edit=${article.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Edit Article
                  </Link>
                )}
                <Link
                  href={`/articles/${article.id}/analytics`}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                >
                  View Analytics
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
