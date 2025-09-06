import { useUserStore, useUserPreferences, useAppState, usePreferenceActions, useAppStateActions } from '@/lib/store/userStore';
import { useAuth } from '@/lib/auth/StableMSALProvider';

/**
 * Comprehensive hook that provides access to all user-related state and actions
 * Only works when user is authenticated
 */
export const useUserSession = () => {
  const { isAuthenticated, profile } = useAuth();
  
  // Use a single subscription to the store to avoid multiple re-renders
  const { preferences, appState, ...actions } = useUserStore();
  
  if (!isAuthenticated || !profile) {
    return null;
  }
  
  return {
    profile,
    preferences,
    appState,
    actions,
  };
};

/**
 * Hook for managing user preferences specifically
 */
export const useUserPrefs = () => {
  const { isAuthenticated } = useAuth();
  
  // Use single subscriptions
  const preferences = useUserStore((state) => state.preferences);
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  const resetPreferences = useUserStore((state) => state.resetPreferences);
  
  return {
    preferences: isAuthenticated ? preferences : null,
    updatePreferences: isAuthenticated ? updatePreferences : () => {},
    resetPreferences: isAuthenticated ? resetPreferences : () => {},
  };
};

/**
 * Hook for managing article-related state
 */
export const useArticleState = () => {
  const { isAuthenticated } = useAuth();
  
  // Use single subscriptions with selectors
  const currentArticleId = useUserStore((state) => state.appState.currentArticleId);
  const recentArticles = useUserStore((state) => state.appState.recentArticles);
  const bookmarkedArticles = useUserStore((state) => state.appState.bookmarkedArticles);
  const unsavedChanges = useUserStore((state) => state.appState.unsavedChanges);
  const lastEditedAt = useUserStore((state) => state.appState.lastEditedAt);
  
  // Get actions
  const setCurrentArticle = useUserStore((state) => state.setCurrentArticle);
  const markUnsavedChanges = useUserStore((state) => state.markUnsavedChanges);
  const addRecentArticle = useUserStore((state) => state.addRecentArticle);
  const removeRecentArticle = useUserStore((state) => state.removeRecentArticle);
  const toggleBookmark = useUserStore((state) => state.toggleBookmark);
  
  return {
    currentArticleId: isAuthenticated ? currentArticleId : null,
    recentArticles: isAuthenticated ? recentArticles : [],
    bookmarkedArticles: isAuthenticated ? bookmarkedArticles : [],
    hasUnsavedChanges: isAuthenticated ? unsavedChanges : false,
    lastEditedAt: isAuthenticated ? lastEditedAt : null,
    
    // Actions
    setCurrentArticle: isAuthenticated ? setCurrentArticle : () => {},
    markUnsavedChanges: isAuthenticated ? markUnsavedChanges : () => {},
    addRecentArticle: isAuthenticated ? addRecentArticle : () => {},
    removeRecentArticle: isAuthenticated ? removeRecentArticle : () => {},
    toggleBookmark: isAuthenticated ? toggleBookmark : () => {},
  };
};

/**
 * Hook for managing workspace layout and UI state
 */
export const useWorkspaceState = () => {
  const { isAuthenticated } = useAuth();
  
  // Use single subscriptions with selectors
  const sidebarCollapsed = useUserStore((state) => state.appState.sidebarCollapsed);
  const activeTab = useUserStore((state) => state.appState.activeTab);
  const workspaceLayout = useUserStore((state) => state.appState.workspaceLayout);
  
  const toggleSidebar = useUserStore((state) => state.toggleSidebar);
  const setActiveTab = useUserStore((state) => state.setActiveTab);
  const setWorkspaceLayout = useUserStore((state) => state.setWorkspaceLayout);
  
  return {
    sidebarCollapsed: isAuthenticated ? sidebarCollapsed : false,
    activeTab: isAuthenticated ? activeTab : null,
    workspaceLayout: isAuthenticated ? workspaceLayout : 'default',
    
    // Actions
    toggleSidebar: isAuthenticated ? toggleSidebar : () => {},
    setActiveTab: isAuthenticated ? setActiveTab : () => {},
    setWorkspaceLayout: isAuthenticated ? setWorkspaceLayout : () => {},
  };
};

/**
 * Hook for managing search functionality
 */
export const useSearchState = () => {
  const { isAuthenticated } = useAuth();
  
  // Use single subscriptions with selectors
  const searchHistory = useUserStore((state) => state.appState.searchHistory);
  const addSearchTerm = useUserStore((state) => state.addSearchTerm);
  const clearSearchHistory = useUserStore((state) => state.clearSearchHistory);
  
  return {
    searchHistory: isAuthenticated ? searchHistory : [],
    
    // Actions
    addSearchTerm: isAuthenticated ? addSearchTerm : () => {},
    clearSearchHistory: isAuthenticated ? clearSearchHistory : () => {},
  };
};

/**
 * Hook for theme management
 */
export const useTheme = () => {
  const { isAuthenticated } = useAuth();
  
  // Use single subscription with selector to avoid re-renders
  const theme = useUserStore((state) => state.preferences.theme);
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (!isAuthenticated) return;
    
    updatePreferences({ theme: newTheme });
    
    // Apply theme immediately
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };
  
  return {
    currentTheme: isAuthenticated ? theme : 'system',
    setTheme,
  };
};

/**
 * Hook for auto-save functionality
 */
export const useAutoSave = () => {
  const { isAuthenticated } = useAuth();
  
  // Use single subscriptions with selectors
  const autoSave = useUserStore((state) => state.preferences.autoSave);
  const autoSaveInterval = useUserStore((state) => state.preferences.autoSaveInterval);
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  
  return {
    isEnabled: isAuthenticated ? autoSave : false,
    interval: isAuthenticated ? autoSaveInterval : 30,
    
    // Actions
    toggleAutoSave: (enabled: boolean) => {
      if (isAuthenticated) {
        updatePreferences({ autoSave: enabled });
      }
    },
    setInterval: (interval: number) => {
      if (isAuthenticated) {
        updatePreferences({ autoSaveInterval: interval });
      }
    },
  };
};
