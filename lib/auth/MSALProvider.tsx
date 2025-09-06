'use client';

import { PublicClientApplication, AuthenticationResult, AccountInfo, Configuration } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { OpenAPI } from '@/api/consolidated';
import { UserService } from '@/api/consolidated';
import { msalConfig, loginRequest } from './msalConfig';
import Toast from '@/components/Toast';
import { useUserStore } from '@/lib/store/userStore';

export interface UserProfile {
  email: string | null;
  roles: string[] | null;
}

export interface AuthContextType {
  account: AccountInfo | null;
  jwt: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  acquireToken: () => Promise<string | null>;
  setSessionFromMsalResult: (result: AuthenticationResult) => Promise<void>;
  profile: UserProfile | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const msalInstance = new PublicClientApplication(msalConfig as Configuration);

export default function MSALProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'error' | 'info' }>>([]);
  
  // Refs to track bootstrap state and prevent duplicate calls
  const bootstrapCompleted = useRef(false);
  const lastTokenUsed = useRef<string | null>(null);
  const bootstrapTimeout = useRef<NodeJS.Timeout | null>(null);
  const toastIdCounter = useRef(0);
  const userStateRestored = useRef(false);
  const isBootstrapping = useRef(false); // Use ref instead of state

  const applyOpenApiToken = useCallback((token: string | undefined) => {
    OpenAPI.TOKEN = token;
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = ++toastIdCounter.current;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Function to restore user state after successful authentication
  const restoreUserState = useCallback((userProfile: UserProfile) => {
    // Prevent multiple calls to restore state
    if (userStateRestored.current) {
      console.log('User state already restored, skipping');
      return;
    }
    
    userStateRestored.current = true;
    console.log('Restoring user state for:', userProfile.email);
    
    try {
      // Get current store state without creating a subscription
      const storeState = useUserStore.getState();
      const { preferences, appState } = storeState;
      
      // Apply user preferences if they exist
      if (preferences.theme !== 'system') {
        // Apply theme preference
        document.documentElement.setAttribute('data-theme', preferences.theme);
      }
      
      // Set user language if different from default
      if (preferences.language !== 'en') {
        document.documentElement.lang = preferences.language;
      }
      
      // Apply editor preferences to localStorage for immediate use
      localStorage.setItem('editor-font-size', preferences.editorFontSize.toString());
      localStorage.setItem('editor-theme', preferences.editorTheme);
      localStorage.setItem('editor-line-numbers', preferences.showLineNumbers.toString());
      localStorage.setItem('editor-word-wrap', preferences.wordWrap.toString());
      
      console.log('User state restored successfully');
      
      // Schedule welcome toast separately to avoid render loop
      // Use requestAnimationFrame to ensure this runs after current render cycle
      requestAnimationFrame(() => {
        setTimeout(() => {
          const welcomeMessage = appState.recentArticles.length > 0 
            ? `Welcome back! You have ${appState.recentArticles.length} recent articles.`
            : 'Welcome! Ready to start writing?';
          
          // Use the callback version to avoid dependency issues
          setToasts(prev => [...prev, { 
            id: ++toastIdCounter.current, 
            message: welcomeMessage, 
            type: 'success' as const 
          }]);
        }, 200); // Increased delay to ensure render cycle completion
      });
    } catch (error) {
      console.error('Error restoring user state:', error);
      // Don't throw - this shouldn't break authentication
    }
  }, []); // Remove showToast dependency to prevent recreating this function

  const ensureUserPresent = useCallback(async (accessToken: string, idToken: string | undefined) => {
    // Create a unique token key for this access token
    const tokenKey = accessToken.substring(0, 20);
    
    // Clear any existing timeout
    if (bootstrapTimeout.current) {
      clearTimeout(bootstrapTimeout.current);
      bootstrapTimeout.current = null;
    }
    
    // Prevent repeated bootstrap attempts with the same token or if already in progress
    if (bootstrapCompleted.current && lastTokenUsed.current === tokenKey) {
      console.log('Bootstrap already completed with this token, skipping');
      return;
    }
    
    if (isBootstrapping.current) {
      console.log('Bootstrap already in progress, skipping');
      return;
    }
    
    isBootstrapping.current = true;
    lastTokenUsed.current = tokenKey;
    console.log('Ensuring user present with token');
    applyOpenApiToken(accessToken);
    
    // Set a timeout to prevent hanging bootstrap
    bootstrapTimeout.current = setTimeout(() => {
      console.warn('Bootstrap timeout reached, resetting state');
      isBootstrapping.current = false;
      bootstrapCompleted.current = false;
    }, 10000); // 10 second timeout
    
    try {
      const res = await UserService.getMyDetails();
      console.log('getMyDetails success:', res?.data);
      const userProfile = { email: res?.data?.email ?? null, roles: res?.data?.roles?.map(role => role.name || '').filter(Boolean) ?? null };
      setProfile(userProfile);
      bootstrapCompleted.current = true;
      
      // Restore user state and preferences after successful authentication
      if (userProfile.email) {
        restoreUserState(userProfile);
      }
      
      return res;
    } catch (e) {
      console.log('getMyDetails failed, attempting registration:', e);
      try {
        const signUpResult = await UserService.signUp({ accessToken, idToken: idToken || '' });
        console.log('signUp result:', signUpResult);
        const res2 = await UserService.getMyDetails();
        console.log('getMyDetails after signUp:', res2?.data);
        const userProfile = { email: res2?.data?.email ?? null, roles: res2?.data?.roles?.map(role => role.name || '').filter(Boolean) ?? null };
        setProfile(userProfile);
        bootstrapCompleted.current = true;
        
        // Restore user state for new users too
        if (userProfile.email) {
          restoreUserState(userProfile);
        }
        
        return res2;
      } catch (err) {
        console.error('User bootstrap failed:', err);
        bootstrapCompleted.current = false;
        throw err;
      }
    } finally {
      if (bootstrapTimeout.current) {
        clearTimeout(bootstrapTimeout.current);
        bootstrapTimeout.current = null;
      }
      isBootstrapping.current = false;
    }
  }, [applyOpenApiToken, restoreUserState]);

  const setSessionFromMsalResult = useCallback(async (result: AuthenticationResult) => {
    if (!result || !result.accessToken) {
      console.log('No valid MSAL result or access token');
      return;
    }
    
    console.log('Setting session from MSAL result:', { 
      account: result.account?.name, 
      hasAccessToken: !!result.accessToken,
      hasIdToken: !!result.idToken 
    });
    
    const { account: acc, accessToken, idToken } = result;
    
    // Set account and token state first
    if (acc) setAccount(acc);
    if (accessToken) setJwt(accessToken);
    
    try {
      await ensureUserPresent(accessToken, idToken);
      setIsAuthenticated(true);
      console.log('User session established successfully');
    } catch (error) {
      console.error('Failed to establish user session:', error);
      setIsAuthenticated(false);
      setProfile(null);
      setAccount(null);
      setJwt(null);
      showToast('Authentication failed. Please try again.', 'error');
    }
  }, [ensureUserPresent, showToast]);

  useEffect(() => {
    let isMounted = true;
    
    const initializeMsal = async () => {
      console.log('Starting MSAL initialization...');
      
      try {
        await msalInstance.initialize();
        console.log('MSAL initialized successfully');
        
        if (!isMounted) return;
        
        // Handle redirect promise first
        const redirectResult = await msalInstance.handleRedirectPromise();
        console.log('Redirect result:', redirectResult ? 'Found' : 'None');
        
        if (!isMounted) return;
        
        if (redirectResult) {
          console.log('Processing redirect result...');
          await setSessionFromMsalResult(redirectResult);
        } else {
          // Try to get existing session
          console.log('Checking for existing session...');
          const accounts = msalInstance.getAllAccounts();
          console.log('Found accounts:', accounts.length);
          
          if (accounts.length > 0 && isMounted) {
            setAccount(accounts[0]);
            console.log('Setting account from existing session:', accounts[0].name);
            
            // Try to get token silently
            try {
              const silentResult = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
              });
              console.log('Silent token acquisition successful');
              if (isMounted) {
                await setSessionFromMsalResult(silentResult);
              }
            } catch (error) {
              console.log('Silent token acquisition failed:', error);
              // Token expired or invalid, user needs to sign in again
              if (isMounted) {
                setIsAuthenticated(false);
                setProfile(null);
              }
            }
          } else {
            console.log('No existing accounts found');
            if (isMounted) {
              setIsAuthenticated(false);
            }
          }
        }
      } catch (error) {
        console.error('MSAL initialization failed:', error);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
          console.log('MSAL initialization completed');
        }
      }
    };

    initializeMsal();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (bootstrapTimeout.current) {
        clearTimeout(bootstrapTimeout.current);
        bootstrapTimeout.current = null;
      }
    };
  }, [setSessionFromMsalResult]);

  // Debug effect to track authentication state changes
  useEffect(() => {
    console.log('Auth state changed:', { 
      isAuthenticated, 
      hasAccount: !!account, 
      hasProfile: !!profile, 
      hasJwt: !!jwt,
      isInitializing,
      isBootstrapping: isBootstrapping.current 
    });
  }, [isAuthenticated, account, profile, jwt, isInitializing]);

  const login = async () => {
    try {
      await msalInstance.loginRedirect({ scopes: loginRequest.scopes });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAccount(null);
      setJwt(null);
      setIsAuthenticated(false);
      setProfile(null);
      bootstrapCompleted.current = false;
      lastTokenUsed.current = null;
      userStateRestored.current = false; // Reset restore state
      applyOpenApiToken(undefined);
      
      // Clear user state and preferences from store
      // Note: This only clears app state, preferences are preserved for next login
      useUserStore.getState().clearAllData();
      
      // Clear editor settings from localStorage
      localStorage.removeItem('editor-font-size');
      localStorage.removeItem('editor-theme');
      localStorage.removeItem('editor-line-numbers');
      localStorage.removeItem('editor-word-wrap');
      
      await msalInstance.logoutPopup();
      showToast('You have been signed out.', 'info');
    } catch (error) {
      console.error('Logout failed:', error);
      showToast('Logout failed. Please try again.', 'error');
    }
  };

  const acquireToken = async (): Promise<string | null> => {
    if (!account) return null;

    try {
      const response = await msalInstance.acquireTokenSilent({ scopes: loginRequest.scopes, account });
      return response.accessToken;
    } catch (error) {
      console.error('Failed to acquire token silently:', error);
      return null;
    }
  };

  const contextValue: AuthContextType = {
    account,
    jwt,
    isAuthenticated,
    login,
    logout,
    acquireToken,
    setSessionFromMsalResult,
    profile,
    showToast,
  };

  return (
    <MsalProvider instance={msalInstance}>
      <AuthContext.Provider value={contextValue}>
        {children}
        {/* Toast notifications */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AuthContext.Provider>
    </MsalProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an MSALProvider');
  }
  return context;
}
