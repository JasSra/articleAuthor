import React from 'react';
import { useUserSession, useTheme, useAutoSave, useArticleState } from '@/lib/hooks/useUserSession';
import { useAuth } from '@/lib/auth/StableMSALProvider';

const UserStateDemo: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const userSession = useUserSession();
  const { currentTheme, setTheme } = useTheme();
  const { isEnabled: autoSaveEnabled, interval: autoSaveInterval, toggleAutoSave, setInterval } = useAutoSave();
  const { 
    currentArticleId, 
    recentArticles, 
    bookmarkedArticles, 
    hasUnsavedChanges,
    addRecentArticle,
    toggleBookmark 
  } = useArticleState();

  if (!isAuthenticated || !userSession) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">User State Demo</h3>
        <p className="text-gray-600">Please sign in to see user state management features.</p>
      </div>
    );
  }

  const handleAddSampleArticle = () => {
    const sampleArticle = {
      id: `article-${Date.now()}`,
      title: `Sample Article ${recentArticles.length + 1}`,
      lastModified: new Date().toISOString(),
      status: 'draft' as const,
    };
    addRecentArticle(sampleArticle);
  };

  const handleToggleBookmark = (articleId: string) => {
    toggleBookmark(articleId);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h3 className="text-xl font-bold text-gray-800">User State Management Demo</h3>
      
      {/* User Profile Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">User Profile</h4>
        <p><strong>Email:</strong> {userSession.profile.email}</p>
        <p><strong>Roles:</strong> {userSession.profile.roles?.join(', ') || 'None'}</p>
      </div>

      {/* Theme Management */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">Theme Settings</h4>
        <p className="mb-2">Current theme: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{currentTheme}</span></p>
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme('light')}
            className={`px-3 py-1 rounded ${currentTheme === 'light' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Light
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`px-3 py-1 rounded ${currentTheme === 'dark' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            Dark
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={`px-3 py-1 rounded ${currentTheme === 'system' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            System
          </button>
        </div>
      </div>

      {/* Auto-save Settings */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Auto-save Settings</h4>
        <div className="flex items-center gap-4 mb-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={autoSaveEnabled}
              onChange={(e) => toggleAutoSave(e.target.checked)}
              className="mr-2"
            />
            Enable auto-save
          </label>
        </div>
        {autoSaveEnabled && (
          <div className="flex items-center gap-2">
            <label htmlFor="interval">Interval (seconds):</label>
            <input 
              id="interval"
              type="number" 
              value={autoSaveInterval}
              onChange={(e) => setInterval(parseInt(e.target.value) || 30)}
              min="10"
              max="300"
              className="w-20 px-2 py-1 border rounded"
            />
          </div>
        )}
      </div>

      {/* Article State */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Article State</h4>
        <p className="mb-2">
          <strong>Current Article:</strong> {currentArticleId || 'None selected'}
        </p>
        <p className="mb-2">
          <strong>Unsaved Changes:</strong> {hasUnsavedChanges ? 'Yes' : 'No'}
        </p>
        <p className="mb-4">
          <strong>Recent Articles:</strong> {recentArticles.length}
        </p>
        
        <button 
          onClick={handleAddSampleArticle}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 mb-4"
        >
          Add Sample Article
        </button>

        {recentArticles.length > 0 && (
          <div>
            <h5 className="font-medium mb-2">Recent Articles:</h5>
            <div className="space-y-2">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div>
                    <span className="font-medium">{article.title}</span>
                    <span className="text-sm text-gray-500 ml-2">({article.status})</span>
                  </div>
                  <button
                    onClick={() => handleToggleBookmark(article.id)}
                    className={`px-2 py-1 rounded text-sm ${
                      bookmarkedArticles.includes(article.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {bookmarkedArticles.includes(article.id) ? '★' : '☆'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preferences Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">All Preferences Summary</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(userSession.preferences, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserStateDemo;
