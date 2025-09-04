'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'draft' | 'submitted' | 'approved' | 'scheduled' | 'published';
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Draft'
        };
      case 'submitted':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Submitted'
        };
      case 'approved':
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'Approved'
        };
      case 'scheduled':
        return {
          color: 'bg-purple-100 text-purple-800',
          text: 'Scheduled'
        };
      case 'published':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Published'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}
    >
      {config.text}
    </span>
  );
}
