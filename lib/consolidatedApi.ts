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
  // Do NOT set 'Content-Type' globally. It breaks multipart/form-data uploads.
  'Accept': 'application/json',
  };
  
  // Enable credentials for auth
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = 'include';
};

// Helper function to ensure API is configured before making any service call
export const ensureAPIConfigured = (jwt?: string) => {
  configureConsolidatedAPI(jwt);
};

// Wrapper function for making authenticated API calls
export const withAuthenticatedAPI = async <T>(
  jwt: string | null | undefined,
  apiCall: () => Promise<T>
): Promise<T> => {
  if (!jwt) {
    throw new Error('Authentication required: No JWT token available');
  }
  
  // Configure API with JWT before making the call
  configureConsolidatedAPI(jwt);
  
  // Execute the API call
  return await apiCall();
};

// Get configured base URL
export const getAPIBaseURL = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229';
};
