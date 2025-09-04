// lib/auth/msal.ts
import { PublicClientApplication, Configuration, LogLevel } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: 'c83c5908-2b64-4304-8c53-b964ace5a1ea', // JSRA B2C Application ID
    authority: 'https://jsraauth.b2clogin.com/9043763d-2cfe-4d43-b84b-a5e5c0ea9d51/v2.0/', // JSRA B2C issuer
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/auth/callback' : 'http://localhost:3000/auth/callback',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

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

export const silentRequest = {
  scopes: loginRequest.scopes,
  account: undefined as any,
};
