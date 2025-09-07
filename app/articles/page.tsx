'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Article, createApiClient } from '@/lib/apiClient';
import { handleApiCall } from '@/lib/apiErrorHandler';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { useUserStore, useAppStateActions, usePreferenceActions } from '@/lib/store/userStore';
import StatusBadge from '@/components/StatusBadge';
import Guard from '@/components/Guard';
import ShareArticle from '@/components/ShareArticle';
import ArticlePreviewModal from '@/components/ArticlePreviewModal';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  BookmarkIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  BookmarkIcon as BookmarkIconSolid 
} from '@heroicons/react/24/solid';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewArticleId, setPreviewArticleId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: [] as string[],
    q: '',
    month_tag: '',
    sortBy: 'updatedUtc' as 'updatedUtc' | 'createdUtc' | 'title',
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  const filtersRef = useRef(filters);
  
  // Update ref whenever filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>('');
  
  const { jwt, isAuthenticated } = useAuth();
  const { preferences } = useUserStore();
  const { addRecentArticle, toggleBookmark } = useAppStateActions();
  const { updatePreferences } = usePreferenceActions();
  const { bookmarkedArticles, recentArticles } = useUserStore((state) => state.appState);

  // Statistics computed from articles
  const stats = useMemo(() => {
    const totalArticles = articles.length;
    const statusCounts = articles.reduce((acc, article) => {
      acc[article.status] = (acc[article.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentActivity = articles.filter(
      article => new Date(article.updatedUtc) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      total: totalArticles,
      draft: statusCounts.draft || 0,
      submitted: statusCounts.submitted || 0,
      approved: statusCounts.approved || 0,
      published: statusCounts.published || 0,
      recentActivity,
    };
  }, [articles]);

  const loadArticles = React.useCallback(async () => {
    if (!jwt) return;

    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      
      const result = await handleApiCall(
        async () => {
          const api = createApiClient({ jwt });
          return await api.getArticles({
            ...currentFilters,
            status: currentFilters.status.length > 0 ? currentFilters.status : undefined,
          });
        },
        {
          context: 'Load Articles',
          showToast: false, // Don't show toast for loading articles
          silentOn: [403] // Silent on access denied
        }
      );
      
      if (!result) {
        // If result is null (error occurred), set empty array
        setArticles([]);
        return;
      }
      
      // Sort articles based on current sort preferences
      const sortedArticles = [...result.items].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;
        
        switch (currentFilters.sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'createdUtc':
            aValue = new Date(a.createdUtc).getTime();
            bValue = new Date(b.createdUtc).getTime();
            break;
          default:
            aValue = new Date(a.updatedUtc).getTime();
            bValue = new Date(b.updatedUtc).getTime();
        }
        
        if (currentFilters.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
      
      setArticles(sortedArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setArticles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    if (isAuthenticated && jwt) {
      loadArticles();
    }
  }, [isAuthenticated, jwt, loadArticles, filters.status, filters.q, filters.month_tag, filters.sortBy, filters.sortOrder]);

  const toggleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(a => a.id));
    }
  };

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedArticles.length === 0) return;
    
    // Implement bulk actions here
    console.log(`Performing ${bulkAction} on articles:`, selectedArticles);
    
    // Reset selection
    setSelectedArticles([]);
    setBulkAction('');
  };

  const handleArticleClick = (article: Article) => {
    // Add to recent articles when clicked
    addRecentArticle({
      id: article.id,
      title: article.title,
      lastModified: article.updatedUtc,
      status: article.status as any,
    });
  };

  const exportArticles = () => {
    const filteredArticles = selectedArticles.length > 0 
      ? articles.filter(a => selectedArticles.includes(a.id))
      : articles;
      
    const csvContent = [
      ['Title', 'Status', 'Author', 'Created', 'Updated', 'Tags'].join(','),
      ...filteredArticles.map(article => [
        `"${article.title}"`,
        article.status,
        article.authorId,
        new Date(article.createdUtc).toLocaleDateString(),
        new Date(article.updatedUtc).toLocaleDateString(),
        `"${article.tags?.join('; ') || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `articles-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      {/* Enhanced Header with Statistics */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Article Dashboard</h1>
              <p className="text-gray-600">Manage and organize your content</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportArticles}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </button>
              <Guard role="Contributor">
                <Link
                  href="/submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Article
                </Link>
              </Guard>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.draft}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">Submitted</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.submitted}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-600">Published</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.published}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Recent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Filters and Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters & Search</h3>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
              Advanced
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search articles
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
                    placeholder="Search by title, content, tags..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View Mode
                </label>
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    title="List view"
                    onClick={() => updatePreferences({ articleViewMode: 'list' })}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-md ${
                      preferences.articleViewMode === 'list'
                        ? 'bg-primary-100 text-primary-700 border-primary-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    title="Grid view"
                    onClick={() => updatePreferences({ articleViewMode: 'grid' })}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-md border-l ${
                      preferences.articleViewMode === 'grid'
                        ? 'bg-primary-100 text-primary-700 border-primary-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Squares2X2Icon className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  title="Sort articles by"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ 
                      ...prev, 
                      sortBy: sortBy as any, 
                      sortOrder: sortOrder as any 
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="updatedUtc-desc">Last Updated</option>
                  <option value="createdUtc-desc">Newest First</option>
                  <option value="createdUtc-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>
            </div>

            {/* Status Filters */}
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
                    {status} ({stats[status as keyof typeof stats] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Month
                    </label>
                    <select
                      title="Filter by month"
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
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedArticles.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900">
                  {selectedArticles.length} article(s) selected
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  title="Select bulk action"
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="border border-blue-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose action...</option>
                  <option value="export">Export Selected</option>
                  <option value="archive">Archive</option>
                  <option value="delete">Delete</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedArticles([])}
                  className="px-3 py-1 border border-blue-300 text-blue-700 rounded-md text-sm hover:bg-blue-100"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading articles...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
          <>
            {preferences.articleViewMode === 'grid' ? (
              // Grid View Layout
              <div className="space-y-6">
                {/* Grid Header with Selection */}
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        title="Select all articles"
                        checked={selectedArticles.length === articles.length && articles.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {selectedArticles.length > 0 
                          ? `${selectedArticles.length} selected` 
                          : 'Select all'
                        }
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {articles.length} article{articles.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => {
                    const isBookmarked = bookmarkedArticles.includes(article.id);
                    const isRecent = recentArticles.some(r => r.id === article.id);
                    
                    return (
                      <div key={article.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Card Header */}
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-start justify-between">
                            <input
                              type="checkbox"
                              title={`Select article: ${article.title}`}
                              checked={selectedArticles.includes(article.id)}
                              onChange={() => handleSelectArticle(article.id)}
                              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <div className="flex items-center space-x-2">
                              <StatusBadge status={article.status} />
                              {isRecent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Recent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          <div className="mb-3">
                            <Link
                              href={`/article/${article.slug}`}
                              onClick={() => handleArticleClick(article)}
                              className="text-lg font-medium text-gray-900 hover:text-primary-600 block"
                            >
                              {article.title}
                            </Link>
                          </div>
                          
                          <div className="text-sm text-gray-500 mb-3">
                            <div>by {article.authorId}</div>
                            <div>{new Date(article.createdUtc).toLocaleDateString()}</div>
                            <div className="text-xs">Updated {new Date(article.updatedUtc).toLocaleDateString()}</div>
                          </div>
                          
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {tag}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{article.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Card Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleBookmark(article.id)}
                                className="text-gray-400 hover:text-yellow-500"
                                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                              >
                                {isBookmarked ? (
                                  <BookmarkIconSolid className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <BookmarkIcon className="h-4 w-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => setPreviewArticleId(article.id)}
                                className="text-xs text-gray-600 hover:text-blue-600 font-medium px-2 py-1 rounded border border-gray-200 hover:bg-blue-50"
                                title="Preview article"
                              >
                                <EyeIcon className="h-3 w-3 inline mr-1" />
                                Preview
                              </button>
                              
                              {article.status === 'draft' && (
                                <Link
                                  href={`/submit?edit=${article.id}`}
                                  className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded border border-primary-200 hover:bg-primary-50"
                                >
                                  Edit
                                </Link>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-400">
                              {article.status === 'published' ? 'Published' : 'Draft'}
                            </div>
                          </div>
                          
                          {/* Share for published articles */}
                          {article.status === 'published' && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <ShareArticle 
                                article={{ 
                                  title: article.title, 
                                  slug: article.slug, 
                                  id: article.id 
                                }} 
                                className="text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // List View Layout (existing)
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Table Header with Selection */}
                <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      title="Select all articles"
                      checked={selectedArticles.length === articles.length && articles.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {selectedArticles.length > 0 
                        ? `${selectedArticles.length} selected` 
                        : 'Select all'
                      }
                    </span>
                  </div>
                </div>

                {/* Articles Table/List */}
                <div className="divide-y divide-gray-200">
              {articles.map((article) => {
                const isBookmarked = bookmarkedArticles.includes(article.id);
                const isRecent = recentArticles.some(r => r.id === article.id);
                
                return (
                  <div key={article.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        title={`Select article: ${article.title}`}
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => handleSelectArticle(article.id)}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      
                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Link
                                href={`/article/${article.slug}`}
                                onClick={() => handleArticleClick(article)}
                                className="text-lg font-medium text-gray-900 hover:text-primary-600 flex-1"
                              >
                                {article.title}
                              </Link>
                              <StatusBadge status={article.status} />
                              {isRecent && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Recent
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <span>by {article.authorId}</span>
                              <span className="mx-2">•</span>
                              <span>{new Date(article.createdUtc).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>Updated {new Date(article.updatedUtc).toLocaleDateString()}</span>
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
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-3">
                            {/* Bookmark */}
                            <button
                              onClick={() => toggleBookmark(article.id)}
                              className="text-gray-400 hover:text-yellow-500"
                              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                            >
                              {isBookmarked ? (
                                <BookmarkIconSolid className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <BookmarkIcon className="h-5 w-5" />
                              )}
                            </button>
                            
                            {/* Preview */}
                            <button
                              onClick={() => setPreviewArticleId(article.id)}
                              className="text-gray-600 hover:text-blue-600"
                              title="Preview article"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            
                            {/* Edit for drafts */}
                            {article.status === 'draft' && (
                              <Link
                                href={`/submit?edit=${article.id}`}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                              >
                                Edit
                              </Link>
                            )}
                            
                            {/* Role-based actions */}
                            <Guard role={['Editor', 'Publisher']}>
                              {article.status === 'submitted' && (
                                <Link
                                  href={`/review?article=${article.id}`}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Review
                                </Link>
                              )}
                            </Guard>
                            
                            <Guard role="Publisher">
                              {article.status === 'approved' && (
                                <Link
                                  href={`/schedule?article=${article.id}`}
                                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                >
                                  Schedule
                                </Link>
                              )}
                            </Guard>
                          </div>
                        </div>

                        {/* Share functionality for published articles */}
                        {article.status === 'published' && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <ShareArticle 
                              article={{ 
                                title: article.title, 
                                slug: article.slug, 
                                id: article.id 
                              }} 
                              className="text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Recent Articles Quick Access */}
        {recentArticles.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recently Accessed</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentArticles.slice(0, 6).map((recent) => {
                const article = articles.find(a => a.id === recent.id);
                if (!article) return null;
                
                return (
                  <Link
                    key={recent.id}
                    href={`/article/${article.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StatusBadge status={article.status} />
                      <span className="text-xs text-gray-500">
                        {new Date(recent.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 truncate">{recent.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">Last accessed</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Article Preview Modal */}
      {previewArticleId && (
        <ArticlePreviewModal
          articleId={previewArticleId}
          isOpen={true}
          onClose={() => setPreviewArticleId(null)}
          onEdit={(id) => {
            setPreviewArticleId(null);
            // Navigate to edit page if it's a draft
            const article = articles.find(a => a.id === id);
            if (article?.status === 'draft') {
              window.location.href = `/submit?edit=${id}`;
            }
          }}
          onBookmark={(id) => {
            toggleBookmark(id);
          }}
          isBookmarked={bookmarkedArticles.includes(previewArticleId)}
        />
      )}
    </div>
  );
}
