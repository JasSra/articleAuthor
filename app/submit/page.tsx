'use client';

import React from 'react';
import ArticleForm from '@/components/ArticleForm';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import Link from 'next/link';

export default function SubmitPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Please sign in to submit articles
          </h2>
          <Link href="/login" className="text-primary-600 hover:text-primary-700">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/articles"
            className="text-primary-600 hover:text-primary-700 text-sm"
          >
            ← Back to Articles
          </Link>
        </div>
        
        <ArticleForm
          onSave={(article) => {
            console.log('Article saved:', article);
            // Could show toast notification here
          }}
          onSubmit={(article) => {
            console.log('Article submitted:', article);
            // Redirect to articles list
            window.location.href = '/articles';
          }}
        />
      </div>
    </div>
  );
}
