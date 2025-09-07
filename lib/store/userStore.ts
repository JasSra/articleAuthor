import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User preferences interface
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  articleViewMode: 'list' | 'grid' | 'compact';
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  defaultVisibility: 'public' | 'private' | 'draft';
  editorFontSize: number;
  editorTheme: 'default' | 'dark' | 'high-contrast';
  showLineNumbers: boolean;
  wordWrap: boolean;
}

// Current application state interface
export interface AppState {
  currentArticleId: string | null;
  lastEditedAt: string | null;
  unsavedChanges: boolean;
  sidebarCollapsed: boolean;
  activeTab: string | null;
  recentArticles: Array<{
    id: string;
    title: string;
    lastModified: string;
    status: 'draft' | 'published' | 'archived';
  }>;
  bookmarkedArticles: string[];
  searchHistory: string[];
  workspaceLayout: 'default' | 'split' | 'preview';
}

// Combined store state
export interface UserStore {
  // User preferences
  preferences: UserPreferences;
  
  // Application state
  appState: AppState;
  
  // Hydration state for persisted store
  hasHydrated: boolean;
  
  // Actions for preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Actions for app state
  setCurrentArticle: (articleId: string | null) => void;
  markUnsavedChanges: (hasChanges: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tabId: string | null) => void;
  addRecentArticle: (article: AppState['recentArticles'][0]) => void;
  removeRecentArticle: (articleId: string) => void;
  toggleBookmark: (articleId: string) => void;
  addSearchTerm: (term: string) => void;
  clearSearchHistory: () => void;
  setWorkspaceLayout: (layout: AppState['workspaceLayout']) => void;
  
  // Utility actions
  clearAllData: () => void;
  exportUserData: () => string;
  importUserData: (data: string) => void;

  // Internal: set hydration flag
  setHasHydrated: (value: boolean) => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  emailNotifications: true,
  pushNotifications: false,
  articleViewMode: 'list',
  autoSave: true,
  autoSaveInterval: 30,
  defaultVisibility: 'draft',
  editorFontSize: 14,
  editorTheme: 'default',
  showLineNumbers: true,
  wordWrap: true,
};

// Default app state
const defaultAppState: AppState = {
  currentArticleId: null,
  lastEditedAt: null,
  unsavedChanges: false,
  sidebarCollapsed: false,
  activeTab: null,
  recentArticles: [],
  bookmarkedArticles: [],
  searchHistory: [],
  workspaceLayout: 'default',
};

// Create the store with persistence
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      appState: defaultAppState,
  hasHydrated: false,
      
      // Preference actions
      updatePreferences: (newPreferences: Partial<UserPreferences>) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      
      resetPreferences: () =>
        set((state) => ({
          preferences: defaultPreferences,
        })),
      
      // App state actions
      setCurrentArticle: (articleId: string | null) =>
        set((state) => ({
          appState: {
            ...state.appState,
            currentArticleId: articleId,
            lastEditedAt: articleId ? new Date().toISOString() : null,
          },
        })),
      
      markUnsavedChanges: (hasChanges: boolean) =>
        set((state) => ({
          appState: { ...state.appState, unsavedChanges: hasChanges },
        })),
      
      toggleSidebar: () =>
        set((state) => ({
          appState: {
            ...state.appState,
            sidebarCollapsed: !state.appState.sidebarCollapsed,
          },
        })),
      
      setActiveTab: (tabId: string | null) =>
        set((state) => ({
          appState: { ...state.appState, activeTab: tabId },
        })),
      
      addRecentArticle: (article: AppState['recentArticles'][0]) =>
        set((state) => {
          const existingIndex = state.appState.recentArticles.findIndex(
            (a) => a.id === article.id
          );
          const updatedRecents = [...state.appState.recentArticles];
          
          if (existingIndex >= 0) {
            // Update existing article and move to top
            updatedRecents.splice(existingIndex, 1);
          }
          
          // Add to beginning and limit to 10 recent articles
          updatedRecents.unshift(article);
          
          return {
            appState: {
              ...state.appState,
              recentArticles: updatedRecents.slice(0, 10),
            },
          };
        }),
      
      removeRecentArticle: (articleId: string) =>
        set((state) => ({
          appState: {
            ...state.appState,
            recentArticles: state.appState.recentArticles.filter(
              (a) => a.id !== articleId
            ),
          },
        })),
      
      toggleBookmark: (articleId: string) =>
        set((state) => {
          const isBookmarked = state.appState.bookmarkedArticles.includes(articleId);
          const updatedBookmarks = isBookmarked
            ? state.appState.bookmarkedArticles.filter((id) => id !== articleId)
            : [...state.appState.bookmarkedArticles, articleId];
          
          return {
            appState: {
              ...state.appState,
              bookmarkedArticles: updatedBookmarks,
            },
          };
        }),
      
      addSearchTerm: (term: string) =>
        set((state) => {
          const trimmedTerm = term.trim();
          if (!trimmedTerm) return state;
          
          const existingIndex = state.appState.searchHistory.findIndex(
            (t) => t.toLowerCase() === trimmedTerm.toLowerCase()
          );
          const updatedHistory = [...state.appState.searchHistory];
          
          if (existingIndex >= 0) {
            // Move existing term to top
            updatedHistory.splice(existingIndex, 1);
          }
          
          // Add to beginning and limit to 20 search terms
          updatedHistory.unshift(trimmedTerm);
          
          return {
            appState: {
              ...state.appState,
              searchHistory: updatedHistory.slice(0, 20),
            },
          };
        }),
      
      clearSearchHistory: () =>
        set((state) => ({
          appState: { ...state.appState, searchHistory: [] },
        })),
      
      setWorkspaceLayout: (layout: AppState['workspaceLayout']) =>
        set((state) => ({
          appState: { ...state.appState, workspaceLayout: layout },
        })),
      
      // Utility actions
      clearAllData: () =>
        set(() => ({
          preferences: defaultPreferences,
          appState: defaultAppState,
        })),
      
      exportUserData: () => {
        const state = get();
        return JSON.stringify({
          preferences: state.preferences,
          appState: state.appState,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },
      
      importUserData: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.preferences && parsed.appState) {
            set(() => ({
              preferences: { ...defaultPreferences, ...parsed.preferences },
              appState: { ...defaultAppState, ...parsed.appState },
            }));
          }
        } catch (error) {
          console.error('Failed to import user data:', error);
          throw new Error('Invalid user data format');
        }
      },

      // Internal: hydration flag setter
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
    }),
    {
      name: 'user-store',
      // Ensure storage is only used in the browser and avoid SSR hydration issues
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      partialize: (state) => ({
        preferences: state.preferences,
        appState: {
          ...state.appState,
          // Don't persist unsaved changes state
          unsavedChanges: false,
        },
      }),
      // Avoid hydration mismatch loops in Next.js app router
      skipHydration: true,
      // Track hydration lifecycle to allow components to wait until rehydrated
      onRehydrateStorage: () => (state, error) => {
        try {
          state?.setHasHydrated(true);
        } catch (e) {
          // no-op
        }
      },
      // Custom merge function to handle data migrations
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;
        
        const persisted = persistedState as Partial<UserStore>;
        
        return {
          ...currentState,
          preferences: {
            ...defaultPreferences,
            ...persisted.preferences,
          },
          appState: {
            ...defaultAppState,
            ...persisted.appState,
            // Always start with no unsaved changes
            unsavedChanges: false,
          },
        };
      },
    }
  )
);

// Hook for getting preferences only
export const useUserPreferences = () => useUserStore((state) => state.preferences);

// Hook for getting app state only
export const useAppState = () => useUserStore((state) => state.appState);

// Hook for hydration status
export const useUserStoreHydrated = () => useUserStore((state) => state.hasHydrated);

// Hook for getting preference actions only
export const usePreferenceActions = () => useUserStore((state) => ({
  updatePreferences: state.updatePreferences,
  resetPreferences: state.resetPreferences,
}));

// Hook for getting app state actions only
export const useAppStateActions = () => useUserStore((state) => ({
  setCurrentArticle: state.setCurrentArticle,
  markUnsavedChanges: state.markUnsavedChanges,
  toggleSidebar: state.toggleSidebar,
  setActiveTab: state.setActiveTab,
  addRecentArticle: state.addRecentArticle,
  removeRecentArticle: state.removeRecentArticle,
  toggleBookmark: state.toggleBookmark,
  addSearchTerm: state.addSearchTerm,
  clearSearchHistory: state.clearSearchHistory,
  setWorkspaceLayout: state.setWorkspaceLayout,
}));
