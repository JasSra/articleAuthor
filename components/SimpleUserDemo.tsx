import React from 'react';
import { useAuth } from '@/lib/auth/StableMSALProvider';
import { useUserStore } from '@/lib/store/userStore';

const SimpleUserDemo: React.FC = React.memo(() => {
  const { isAuthenticated, profile } = useAuth();
  
  // Use single subscription to avoid infinite loops
  const { preferences, appState } = useUserStore();

  if (!isAuthenticated || !profile) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">User State Demo</h3>
        <p className="text-gray-600">Please sign in to see user state management features.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-bold text-gray-800">User State Overview</h3>
      
      {/* User Profile Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">User Profile</h4>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Roles:</strong> {profile.roles?.join(', ') || 'None'}</p>
      </div>

      {/* Basic Settings */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Settings</h4>
        <p><strong>Theme:</strong> {preferences.theme}</p>
        <p><strong>Auto-save:</strong> {preferences.autoSave ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Article View:</strong> {preferences.articleViewMode}</p>
      </div>

      {/* Article State */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Article State</h4>
        <p><strong>Current Article:</strong> {appState.currentArticleId || 'None selected'}</p>
        <p><strong>Recent Articles:</strong> {appState.recentArticles.length}</p>
        <p><strong>Bookmarked Articles:</strong> {appState.bookmarkedArticles.length}</p>
      </div>
    </div>
  );
});

SimpleUserDemo.displayName = 'SimpleUserDemo';

export default SimpleUserDemo;
