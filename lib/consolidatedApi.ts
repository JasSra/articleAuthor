import { OpenAPI } from '@/api/consolidated';

// Configure the consolidated API client
export const configureConsolidatedAPI = (jwt?: string) => {
  // Set base URL from environment
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229';
  
  // Set JWT token if provided
  if (jwt) {
    OpenAPI.TOKEN = jwt;
  }
  
  // Set proper headers
  OpenAPI.HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Enable credentials for auth
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = 'include';
};

// Get configured base URL
export const getAPIBaseURL = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229';
};
