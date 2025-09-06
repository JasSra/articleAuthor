'use client'

import { createContext, useContext, ReactNode, useEffect, useState, useCallback, useMemo } from 'react'
import { 
  PublicClientApplication, 
  AccountInfo, 
  InteractionRequiredAuthError,
  AuthenticationResult
} from '@azure/msal-browser'
import { msalConfig, loginRequest, tokenRequest } from './msalConfig'

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig)

// Helper function to get user display name from B2C claims
export const getUserDisplayName = (user: AccountInfo | null): string => {
  if (!user) return 'User'
  
  // Check for given_name + family_name in idTokenClaims
  const claims = user.idTokenClaims as any
  if (claims) {
    const givenName = claims.given_name || claims.givenName
    const familyName = claims.family_name || claims.surname || claims.familyName
    
    if (givenName && familyName) {
      return `${givenName} ${familyName}`
    }
    if (givenName) {
      return givenName
    }
    if (familyName) {
      return familyName
    }
  }
  
  // Fallback to standard MSAL properties
  return user.name || (user as any).username || user.username || 'User'
}

// Helper function to get user initials from B2C claims
export const getUserInitials = (user: AccountInfo | null): string => {
  if (!user) return 'U'
  
  // Check for given_name + family_name in idTokenClaims
  const claims = user.idTokenClaims as any
  if (claims) {
    const givenName = claims.given_name || claims.givenName
    const familyName = claims.family_name || claims.surname || claims.familyName
    
    if (givenName && familyName) {
      return `${givenName[0]}${familyName[0]}`.toUpperCase()
    }
    if (givenName) {
      return givenName[0].toUpperCase()
    }
    if (familyName) {
      return familyName[0].toUpperCase()
    }
  }
  
  // Fallback to first letter of display name
  const displayName = user.name || (user as any).username || user.username || 'User'
  return displayName[0].toUpperCase()
}

// Helper function to get user email from B2C claims
export const getUserEmail = (user: AccountInfo | null): string => {
  if (!user) return ''
  
  // Check for email in idTokenClaims
  const claims = user.idTokenClaims as any
  if (claims) {
    // Try various email claim names
    const email = claims.email || claims.emails?.[0] || claims.signInName || claims.preferred_username
    if (email && email !== user.localAccountId) {
      return email
    }
  }
  
  // Fallback to username if it looks like an email
  const username = user.username || user.localAccountId || ''
  if (username.includes('@')) {
    return username
  }
  
  return ''
}

export interface UserProfile {
  email: string | null;
  roles: string[] | null;
}

interface AuthContextType {
  isAuthenticated: boolean
  user: AccountInfo | null
  account: AccountInfo | null  // For compatibility
  jwt: string | null
  login: () => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => Promise<string | null>
  acquireToken: () => Promise<string | null>  // Alias for compatibility
  setSessionFromMsalResult: (result: AuthenticationResult) => Promise<void>
  loading: boolean
  profile: UserProfile | null
  recentAuthEvent: 'signup' | 'login' | null
  clearRecentAuthEvent: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function StableMSALProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AccountInfo | null>(null)
  const [jwt, setJwt] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentAuthEvent, setRecentAuthEvent] = useState<'signup' | 'login' | null>(null)

  const baseUrl = (globalThis as any).process?.env?.NEXT_PUBLIC_API_BASE || 'http://localhost:5229'

  // Simple toast implementation (can be enhanced)
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    console.log(`Toast [${type}]: ${message}`)
    // You can implement actual toast UI here if needed
  }, [])

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length === 0) {
      return null
    }

    const request = {
      ...tokenRequest,
      account: accounts[0]
    }

    try {
      const response = await msalInstance.acquireTokenSilent(request)
      return response.accessToken
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Fallback to interactive token acquisition
        try {
          const response = await msalInstance.acquireTokenPopup(request)
          return response.accessToken
        } catch (interactiveError) {
          console.error('Interactive token acquisition failed:', interactiveError)
          return null
        }
      } else {
        console.error('Silent token acquisition failed:', error)
        return null
      }
    }
  }, [])

  // Local authed fetch that does NOT depend on useAuth to avoid circular deps
  const authedFetch = useCallback(async (path: string, init?: RequestInit, tokenOverride?: string | null) => {
    let token = tokenOverride ?? null
    if (!token) {
      token = await getAccessToken()
    }
    const headers = new Headers(init?.headers || {})
    if (!headers.has('Content-Type') && init?.body) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    const res = await fetch(`${baseUrl}${path}`, { ...(init || {}), headers })
    return res
  }, [baseUrl, getAccessToken])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Starting MSAL initialization...')
        await msalInstance.initialize()
        console.log('MSAL initialized successfully')
        
        // Handle redirect response
        const response = await msalInstance.handleRedirectPromise()
        console.log('Redirect response:', response)
        
        if (response && response.account) {
          console.log('User logged in from redirect:', response.account.username)
          console.log('User claims:', response.account.idTokenClaims)
          
          // Batch state updates to prevent multiple re-renders
          const userProfile = await handleUserProfile(response.account, response.accessToken);
          
          // Set all auth state at once to prevent cascading re-renders
          setUser(response.account);
          setJwt(response.accessToken);
          setIsAuthenticated(true);
          setRecentAuthEvent('login'); // Default to login for now
          
        } else {
          // Check for existing accounts and validate token
          const accounts = msalInstance.getAllAccounts()
          console.log('Existing accounts found:', accounts.length)
          
          if (accounts.length > 0) {
            console.log('Attempting silent token acquisition for account:', accounts[0].username)
            console.log('Account claims:', accounts[0].idTokenClaims)
            try {
              const token = await msalInstance.acquireTokenSilent({ ...tokenRequest, account: accounts[0] })
              if (token && token.accessToken) {
                console.log('Silent token acquisition successful')
                
                // Try to get user profile first
                try {
                  await handleUserProfile(accounts[0], token.accessToken)
                } catch (error) {
                  console.warn('Failed to get user profile:', error)
                }
                
                // Batch state updates to prevent multiple re-renders
                setUser(accounts[0]);
                setJwt(token.accessToken);
                setIsAuthenticated(true);
              } else {
                console.warn('No access token available yet; staying unauthenticated temporarily')
              }
            } catch (e) {
              console.warn('Silent token acquisition failed; staying on page', e)
              // Avoid redirect loop; user can click login again
            }
          } else {
            console.log('No existing accounts found, user needs to log in')
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    initializeAuth()
    // We purposely run this once on mount to bootstrap auth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async () => {
    try {
      setLoading(true)
      
      // Debug: Log the current configuration
      console.log('MSAL Config being used:', {
        clientId: msalConfig.auth.clientId,
        authority: msalConfig.auth.authority,
        redirectUri: msalConfig.auth.redirectUri,
        currentUrl: typeof window !== 'undefined' ? window.location.href : ''
      })
      
      // Use redirect instead of popup
      await msalInstance.loginRedirect(loginRequest)
      
    } catch (error) {
      console.error('Login failed:', error)
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      setUser(null)
      setJwt(null)
      setIsAuthenticated(false)
      setProfile(null)
      setRecentAuthEvent(null)
      
      await msalInstance.logoutRedirect({
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri
      })
    } catch (error) {
      console.error('Logout failed:', error)
      setLoading(false)
    }
  }, [])

  const handleUserProfile = useCallback(async (account: AccountInfo, accessToken: string) => {
    try {
      // For now, create a simple profile from account info
      const userProfile: UserProfile = {
        email: getUserEmail(account),
        roles: ['User'] // Default role, could be enhanced to extract from token claims
      }
      
      setProfile(userProfile)
      
      // Try to get existing user profile with timeout (optional API call)
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
        
        const res = await authedFetch('/api/user/profile', { 
          signal: controller.signal 
        }, accessToken)
        clearTimeout(timeoutId)
        
        if (res.ok) {
          const apiProfile = await res.json()
          console.log('User profile from API:', apiProfile)
          // Could merge API profile data here
          return false // existing profile
        }
      } catch (error) {
        console.warn('Failed to check existing profile (continuing):', error)
      }

      return false // For now, assume existing user
    } catch (error) {
      console.warn('Error handling user profile (continuing anyway):', error)
      return false
    }
  }, [authedFetch])

  const setSessionFromMsalResult = useCallback(async (result: AuthenticationResult) => {
    if (!result || !result.accessToken) {
      console.log('No valid MSAL result or access token')
      return
    }
    
    console.log('Setting session from MSAL result:', { 
      account: result.account?.name, 
      hasAccessToken: !!result.accessToken,
      hasIdToken: !!result.idToken 
    })
    
    const { account: acc, accessToken } = result
    
    try {
      // Handle user profile first to avoid state update conflicts
      await handleUserProfile(acc!, accessToken)
      
      // Batch all state updates to prevent multiple re-renders
      setUser(acc);
      setJwt(accessToken);
      setIsAuthenticated(true);
      console.log('User session established successfully')
    } catch (error) {
      console.error('Failed to establish user session:', error)
      // Reset all auth state in batch
      setIsAuthenticated(false);
      setProfile(null);
      setUser(null);
      setJwt(null);
      showToast('Authentication failed. Please try again.', 'error')
    }
  }, [handleUserProfile, showToast])

  const clearRecentAuthEvent = useCallback(() => {
    setRecentAuthEvent(null)
  }, [])

  const value: AuthContextType = useMemo(() => ({
    isAuthenticated,
    user,
    account: user, // Alias for compatibility
    jwt,
    login,
    logout,
    getAccessToken,
    acquireToken: getAccessToken, // Alias for compatibility
    setSessionFromMsalResult,
    loading,
    profile,
    recentAuthEvent,
    clearRecentAuthEvent,
    showToast
  }), [
    isAuthenticated,
    user,
    jwt,
    login,
    logout,
    getAccessToken,
    setSessionFromMsalResult,
    loading,
    profile,
    recentAuthEvent,
    clearRecentAuthEvent,
    showToast
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a StableMSALProvider')
  }
  return context
}

export default StableMSALProvider
