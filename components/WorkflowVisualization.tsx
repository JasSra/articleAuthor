'use client';

import React from 'react';

interface WorkflowVisualizationProps {
  currentStatus: string;
  className?: string;
}

const workflowSteps = [
  { status: 'draft', label: 'Draft', description: 'Article being written' },
  { status: 'submitted', label: 'Submitted', description: 'Awaiting review' },
  { status: 'approved', label: 'Approved', description: 'Ready to publish' },
  { status: 'scheduled', label: 'Scheduled', description: 'Queued for publication' },
  { status: 'published', label: 'Published', description: 'Live and visible' },
];

const rejectedStep = { status: 'rejected', label: 'Rejected', description: 'Needs revision' };

export default function WorkflowVisualization({ currentStatus, className = '' }: WorkflowVisualizationProps) {
  const currentIndex = workflowSteps.findIndex(step => step.status === currentStatus);
  const isRejected = currentStatus === 'rejected';

  const getStepStatus = (stepIndex: number, stepStatus: string) => {
    if (isRejected && stepStatus === 'rejected') return 'current';
    if (isRejected) return 'inactive';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white border-green-600';
      case 'current':
        return 'bg-blue-600 text-white border-blue-600';
      case 'upcoming':
        return 'bg-gray-100 text-gray-400 border-gray-300';
      case 'inactive':
        return 'bg-gray-50 text-gray-300 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-400 border-gray-300';
    }
  };

  const getConnectorStyles = (fromIndex: number) => {
    if (isRejected) return 'bg-gray-200';
    if (fromIndex < currentIndex) return 'bg-green-600';
    return 'bg-gray-200';
  };

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Article Workflow</h3>
        <p className="text-sm text-gray-600">
          Track your article&apos;s journey from draft to publication
        </p>
      </div>

      <div className="relative">
        {/* Main workflow */}
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, index) => (
            <React.Fragment key={step.status}>
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${getStepStyles(
                    getStepStatus(index, step.status)
                  )}`}
                >
                  {getStepStatus(index, step.status) === 'completed' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-900">{step.label}</div>
                  <div className="text-xs text-gray-500 max-w-20">{step.description}</div>
                </div>
              </div>

              {/* Connector */}
              {index < workflowSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors ${getConnectorStyles(index)}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Rejected path */}
        {isRejected && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium ${getStepStyles('current')} bg-red-600 border-red-600`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-red-700">{rejectedStep.label}</div>
                  <div className="text-xs text-red-500 max-w-20">{rejectedStep.description}</div>
                </div>
              </div>
              <div className="flex-1 h-0.5 mx-2 bg-red-300" />
              <div className="text-sm text-gray-600">Return to Draft for revision</div>
            </div>
          </div>
        )}

        {/* Current status info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                Current Status: {workflowSteps.find(s => s.status === currentStatus)?.label || rejectedStep.label}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                {isRejected ? (
                  "Your article needs revision. Please review the feedback and make necessary changes before resubmitting."
                ) : currentStatus === 'draft' ? (
                  "Continue writing your article. When ready, submit it for editorial review."
                ) : currentStatus === 'submitted' ? (
                  "Your article is being reviewed by our editorial team. You&apos;ll be notified once a decision is made."
                ) : currentStatus === 'approved' ? (
                  "Great! Your article has been approved and is ready for publication scheduling."
                ) : currentStatus === 'scheduled' ? (
                  "Your article is scheduled for publication and will go live soon."
                ) : currentStatus === 'published' ? (
                  "Congratulations! Your article is now live and visible to readers."
                ) : (
                  "Article status updated."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
