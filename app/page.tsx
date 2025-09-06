'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ContentRenderer from '@/components/ContentRenderer';
import SimpleUserDemo from '@/components/SimpleUserDemo';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { OpenAPI, DataService } from '@/api/consolidated';

interface Article {
  Id: string;
  Title?: string;
  Summary?: string;
  CreatedAt?: string;
  AuthorEmail?: string;
  Status?: string;
}

export default function HomePage() {
  const { isAuthenticated, profile, jwt } = useAuth();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoadedContent, setHasLoadedContent] = useState(false);

  useEffect(() => {
    // Prevent multiple rapid calls during authentication changes
    if (hasLoadedContent && blocks.length > 0) {
      return; // Content already loaded
    }

    const loadContent = async () => {
      try {
        // Configure API client
        OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229';
        if (jwt) {
          OpenAPI.TOKEN = jwt;
          OpenAPI.USERNAME = undefined;
          OpenAPI.PASSWORD = undefined;
        } else {
          // Fallback to basic auth for public content
          OpenAPI.USERNAME = 'admin@local';
          OpenAPI.PASSWORD = 'develop';
          OpenAPI.TOKEN = undefined;
        }

        // Load content blocks
        const display = await DataService.getAllEntities('Core', 'Content', 1, 100);
        const ids = display?.data?.items ?? [];
        const landingPlaceholders = new Set(['home-hero', 'home-showcase', 'about-text', 'home-cta']);
        
        const detailPromises = ids.map(async (id: string) => {
          try {
            const res = await DataService.getById(id);
            const entity = res?.data as any;
            if (entity?.Placeholder && landingPlaceholders.has(entity.Placeholder)) return entity;
            return null;
          } catch {
            return null;
          }
        });
        
        const details = await Promise.all(detailPromises);
        const contentBlocks = details.filter(Boolean) as any[];
        const order = ['home-hero', 'home-showcase', 'about-text', 'home-cta'];
        contentBlocks.sort((a, b) => order.indexOf(a.Placeholder) - order.indexOf(b.Placeholder));
        setBlocks(contentBlocks);

        // Load recent articles if authenticated
        if (isAuthenticated && jwt) {
          try {
            const articlesRes = await DataService.getAllEntities('Core', 'Article', 1, 5);
            const articleIds = articlesRes?.data?.items ?? [];
            const articlePromises = articleIds.slice(0, 5).map(async (id: string) => {
              try {
                const res = await DataService.getById(id);
                return res?.data as Article;
              } catch {
                return null;
              }
            });
            const articles = await Promise.all(articlePromises);
            setRecentArticles(articles.filter(Boolean) as Article[]);
          } catch (e) {
            console.log('Failed to load recent articles:', e);
          }
        }
        
        setHasLoadedContent(true);
      } catch (e) {
        console.log('Failed to load content:', e);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [isAuthenticated, jwt, hasLoadedContent, blocks.length]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        {blocks.length > 0 ? (
          <ContentRenderer items={blocks} />
        ) : (
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Code Chronicle</h1>
            <p className="text-xl text-gray-600 mb-8">Write. Read. Inspire.</p>
            <div className="space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Write Article
                  </Link>
                  <Link
                    href="/articles"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Browse Stories
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/articles"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Browse Stories
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Authenticated User Dashboard */}
        {isAuthenticated && (
          <div className="mt-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, {profile?.email?.split('@')[0] || 'User'}!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/submit"
                  className="block p-4 bg-primary-50 rounded-lg border border-primary-200 hover:bg-primary-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary-900">Write New Article</h3>
                      <p className="text-sm text-primary-600">Share your voice with readers</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/articles"
                  className="block p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-900">Review & Edit</h3>
                      <p className="text-sm text-green-600">Help polish great content</p>
                    </div>
                  </div>
                </Link>

                {profile?.roles?.some(role => role.toLowerCase().includes('admin')) && (
                  <Link
                    href="/setup"
                    className="block p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-purple-900">Admin Setup</h3>
                        <p className="text-sm text-purple-600">System configuration</p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Recent Articles */}
            {recentArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Stories</h3>
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <div key={article.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {article.Title || `Article ${article.Id}`}
                        </h4>
                        {article.Summary && (
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {article.Summary}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {article.AuthorEmail && (
                            <span>By {article.AuthorEmail}</span>
                          )}
                          {article.Status && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {article.Status}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/articles/${article.Id}`}
                        className="ml-4 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href="/articles"
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    View all stories →
                  </Link>
                </div>
              </div>
            )}

            {/* User State Management Demo */}
            <div className="mt-8">
              <SimpleUserDemo />
            </div>
          </div>
        )}

        {/* Public Features Section */}
        {!isAuthenticated && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Code Chronicle?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with fellow writers, share your stories, and inspire the community of readers and creators
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Write & Publish</h3>
                <p className="text-gray-600">Craft compelling stories, articles, and content that resonates with your audience</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Editorial Review</h3>
                <p className="text-gray-600">Get thoughtful feedback from editors and fellow writers to polish your content</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Read & Discover</h3>
                <p className="text-gray-600">Explore diverse voices, discover new perspectives, and find inspiration for your next piece</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
