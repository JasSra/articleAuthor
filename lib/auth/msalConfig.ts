import { Configuration, PublicClientApplication } from '@azure/msal-browser';

// MSAL configuration for JSRA B2C
export const msalConfig: Configuration = {
  auth: {
    clientId: 'c83c5908-2b64-4304-8c53-b964ace5a1ea', // Your B2C Application ID
    authority: 'https://jsraauth.b2clogin.com/9043763d-2cfe-4d43-b84b-a5e5c0ea9d51/v2.0/', // Your B2C issuer
    redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // Error
            console.error(message);
            return;
          case 1: // Warning
            console.warn(message);
            return;
          case 2: // Info
            console.info(message);
            return;
          case 3: // Verbose
            console.debug(message);
            return;
        }
      }
    }
  }
};

// Login request configuration
export const loginRequest = {
  scopes: [
    'openid',
    'profile', 
    'email',
    'https://jsraauth.onmicrosoft.com/c83c5908-2b64-4304-8c53-b964ace5a1ea/Consolidated.Admin',
    'https://jsraauth.onmicrosoft.com/c83c5908-2b64-4304-8c53-b964ace5a1ea/Consolidated.User',
    'https://jsraauth.onmicrosoft.com/c83c5908-2b64-4304-8c53-b964ace5a1ea/Consolidated.Client',
  ],
};

// Silent request configuration
export const silentRequest = {
  scopes: loginRequest.scopes,
  account: null as any, // Will be set when we have an account
};

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);
