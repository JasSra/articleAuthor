'use client';

import React, { useState } from 'react';
import { Article, createApiClient } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth/StableMSALProvider';

interface ApprovalPanelProps {
  article: Article;
  onApproval: (decision: 'approved' | 'rejected', note: string) => void;
}

export default function ApprovalPanel({ article, onApproval }: ApprovalPanelProps) {
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { jwt } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jwt) return;

    setLoading(true);
    try {
      const api = createApiClient({ jwt });
      
      // Submit approval form
      await api.submitForm('{{ APPROVAL_FORM_ID }}', {
        articleId: article.id,
        decision,
        note,
      });

      // Create approval record
      await api.createApproval({
        articleId: article.id,
        decision,
        note,
        approverId: 'current-user-id', // Would get from JWT
        decidedUtc: new Date().toISOString(),
      });

      onApproval(decision, note);
    } catch (error) {
      console.error('Failed to submit approval:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Review Article</h3>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-700">{article.title}</h4>
        <p className="text-sm text-gray-500">by {article.authorId}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Decision
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="approved"
                checked={decision === 'approved'}
                onChange={(e) => setDecision(e.target.value as 'approved' | 'rejected')}
                className="mr-2"
              />
              <span className="text-sm text-green-700">Approve</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="rejected"
                checked={decision === 'rejected'}
                onChange={(e) => setDecision(e.target.value as 'approved' | 'rejected')}
                className="mr-2"
              />
              <span className="text-sm text-red-700">Reject</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Add feedback or comments..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              decision === 'approved' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50`}
          >
            {loading ? 'Processing...' : decision === 'approved' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </form>
    </div>
  );
}
