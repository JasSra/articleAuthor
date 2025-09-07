import React from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ArrowPathIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSaved?: Date;
  error?: string;
  className?: string;
}

export default function AutoSaveIndicator({ 
  isSaving, 
  hasUnsavedChanges, 
  lastSaved, 
  error,
  className = '' 
}: AutoSaveIndicatorProps) {
  const getStatusInfo = () => {
    if (error) {
      return {
        icon: ExclamationTriangleIcon,
        text: 'Save failed',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
    
    if (isSaving) {
      return {
        icon: ArrowPathIcon,
        text: 'Saving...',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        animate: true
      };
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: ClockIcon,
        text: 'Unsaved changes',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }
    
    return {
      icon: CheckCircleIcon,
      text: lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : 'All changes saved',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const status = getStatusInfo();
  const Icon = status.icon;

  return (
    <div 
      className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${status.color} ${status.bgColor} ${status.borderColor} ${className}`}
      title={error || status.text}
    >
      <Icon 
        className={`h-4 w-4 mr-2 ${status.animate ? 'animate-spin' : ''}`} 
      />
      <span>{status.text}</span>
    </div>
  );
}
