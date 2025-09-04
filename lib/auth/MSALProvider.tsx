'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicClientApplication, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './msal';

interface AuthContextType {
  account: AccountInfo | null;
  jwt: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  acquireToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function MSALProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize MSAL
    msalInstance.initialize().then(() => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsAuthenticated(true);
        // Try to get existing JWT from server
        fetchJwtFromServer();
      }
    });
  }, []);

  const fetchJwtFromServer = async () => {
    try {
      const response = await fetch('/api/session/check');
      if (response.ok) {
        const data = await response.json();
        if (data.jwt) {
          setJwt(data.jwt);
        }
      }
    } catch (error) {
      console.error('Failed to fetch JWT from server:', error);
    }
  };

  const login = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ['openid', 'profile', 'email'],
      });

      if (response.account) {
        setAccount(response.account);
        setIsAuthenticated(true);

        // Exchange MSAL token for JWT from consolidated API
        await exchangeTokenForJwt(response.accessToken);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await msalInstance.logoutPopup();
      setAccount(null);
      setJwt(null);
      setIsAuthenticated(false);

      // Clear server-side session
      await fetch('/api/session/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const acquireToken = async (): Promise<string | null> => {
    if (!account) return null;

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: ['openid', 'profile', 'email'],
        account,
      });

      return response.accessToken;
    } catch (error) {
      console.error('Failed to acquire token silently:', error);
      return null;
    }
  };

  const exchangeTokenForJwt = async (accessToken: string) => {
    try {
      const response = await fetch('/api/session/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ externalToken: accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setJwt(data.jwt);
      } else {
        console.error('Failed to exchange token for JWT');
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
    }
  };

  const contextValue: AuthContextType = {
    account,
    jwt,
    isAuthenticated,
    login,
    logout,
    acquireToken,
  };

  return (
    <MsalProvider instance={msalInstance}>
      <AuthContext.Provider value={contextValue}>
        {children}
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
