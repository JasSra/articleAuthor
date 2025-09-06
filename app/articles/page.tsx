'use client';

import React, { useState, useEffect } from 'react';
import { Article, createApiClient } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import StatusBadge from '@/components/StatusBadge';
import Guard from '@/components/Guard';
import ShareArticle from '@/components/ShareArticle';
import Link from 'next/link';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: [] as string[],
    q: '',
    month_tag: '',
  });
  const { jwt, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && jwt) {
      loadArticles();
    }
  }, [isAuthenticated, jwt, filters]);

  const loadArticles = async () => {
    if (!jwt) return;

    setLoading(true);
    try {
      const api = createApiClient({ jwt });
      const result = await api.getArticles({
        ...filters,
        status: filters.status.length > 0 ? filters.status : undefined,
      });
      setArticles(result.items);
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Please sign in to access articles
          </h2>
          <Link href="/login" className="text-primary-600 hover:text-primary-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
            <Guard role="Contributor">
              <Link
                href="/submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                New Article
              </Link>
            </Guard>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
                placeholder="Search articles..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['draft', 'submitted', 'approved', 'scheduled', 'published'].map(status => (
                  <button
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      filters.status.includes(status)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={filters.month_tag}
                onChange={(e) => setFilters(prev => ({ ...prev, month_tag: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All months</option>
                <option value="2024-12">December 2024</option>
                <option value="2025-01">January 2025</option>
                <option value="2025-02">February 2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading articles...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No articles found</div>
            <Guard role="Contributor">
              <Link
                href="/submit"
                className="text-primary-600 hover:text-primary-700"
              >
                Create your first article
              </Link>
            </Guard>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {articles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Link
                          href={`/article/${article.slug}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600"
                        >
                          {article.title}
                        </Link>
                        <StatusBadge status={article.status} />
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">
                        by {article.authorId} • {new Date(article.createdUtc).toLocaleDateString()}
                      </div>
                      
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-3">
                        {article.status === 'draft' && (
                          <Link
                            href={`/submit?edit=${article.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Edit
                          </Link>
                        )}
                        
                        <Guard role={['Editor', 'Publisher']}>
                          {article.status === 'submitted' && (
                            <Link
                              href={`/review?article=${article.id}`}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Review
                            </Link>
                          )}
                        </Guard>
                        
                        <Guard role="Publisher">
                          {article.status === 'approved' && (
                            <Link
                              href={`/schedule?article=${article.id}`}
                              className="text-sm text-purple-600 hover:text-purple-700"
                            >
                              Schedule
                            </Link>
                          )}
                        </Guard>
                      </div>

                      {/* Share functionality for published articles */}
                      {article.status === 'published' && (
                        <ShareArticle 
                          article={{ 
                            title: article.title, 
                            slug: article.slug, 
                            id: article.id 
                          }} 
                          className="border-t pt-3"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
