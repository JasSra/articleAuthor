# API Authentication Guide

## Overview

This guide ensures that **ALL** API calls in the application are properly authenticated when a user is logged in. The application uses JWT tokens for authentication with the consolidated API.

## Authentication Architecture

### 1. Centralized Configuration

```typescript
// lib/consolidatedApi.ts
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
```

### 2. JWT Token Access

All components that make API calls should use the `useAuth` hook to access the JWT token:

```typescript
import { useAuth } from '@/lib/auth/StableMSALProvider';

const MyComponent = () => {
  const { jwt, isAuthenticated } = useAuth();
  // Use jwt for API calls
};
```

## Service Authentication Requirements

### ✅ **FileService** - Image/File Uploads
**Status**: ✅ Properly Authenticated

**Implementation**:
```typescript
// In upload.ts
export async function uploadFileViaAPI(jwt: string, file: File): Promise<string> {
  return await withAuthenticatedAPI(jwt, async () => {
    const formData = { File: file };
    const result = await FileService.postApiFileUpload(formData);
    // ... handle result
  });
}

// In components
const handleImageUpload = async (file: File) => {
  if (!jwt) {
    alert('Please log in to upload images');
    return;
  }
  
  const publicUrl = await uploadFileViaAPI(jwt, file);
  // ... use public URL
};
```

**Used in**:
- `components/MarkdownEditor.tsx` - Rich text editor image uploads
- `components/DirectMarkdownEditor.tsx` - Direct markdown editor image uploads
- `lib/upload.ts` - Centralized upload utility

### ✅ **EventTrackerService** - AI Suggestions
**Status**: ✅ Properly Authenticated

**Implementation**:
```typescript
// In MarkdownEditor.tsx
const getSuggestions = useCallback(async (content: string) => {
  if (!jwt || !enableAISuggestions) return;

  const suggestions = await withAuthenticatedAPI(jwt, async () => {
    const predictionContext: PredictionContext = {
      // ... context data
    };
    return await EventTrackerService.postApiEventTrackerSuggestions(predictionContext);
  });
  
  setAiSuggestions(suggestions);
}, [jwt, enableAISuggestions]);
```

**Used in**:
- `components/MarkdownEditor.tsx` - AI content suggestions
- `components/DirectMarkdownEditor.tsx` - AI suggestions (mock implementation)

### ✅ **DataService** - Content Management
**Status**: ✅ Properly Authenticated

**Implementation**:
```typescript
// In app/page.tsx
const loadContent = async () => {
  // Configure API client
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229';
  if (jwt) {
    OpenAPI.TOKEN = jwt;
    OpenAPI.USERNAME = undefined;
    OpenAPI.PASSWORD = undefined;
  } else {
    // Fallback to basic auth for public content
    OpenAPI.USERNAME = 'admin@local';
    OpenAPI.PASSWORD = 'develop';
    OpenAPI.TOKEN = undefined;
  }

  const display = await DataService.getAllEntities('Core', 'Content', 1, 100);
  // ... handle data
};
```

**Used in**:
- `app/page.tsx` - Loading homepage content (handles both authenticated and public access)
- `app/setup/page.tsx` - Setup operations (uses basic auth intentionally)

### ✅ **UserService** - User Management
**Status**: ✅ Properly Authenticated

**Implementation**:
```typescript
// In MSALProvider.tsx
const ensureUserPresent = async (accessToken: string, idToken?: string) => {
  applyOpenApiToken(accessToken); // Configures OpenAPI.TOKEN
  
  try {
    const res = await UserService.getMyDetails();
    // ... handle user data
  } catch (e) {
    // Handle registration if needed
    const signUpResult = await UserService.signUp({ accessToken, idToken: idToken || '' });
    const res2 = await UserService.getMyDetails();
  }
};
```

**Used in**:
- `lib/auth/MSALProvider.tsx` - User authentication and registration
- `app/setup/page.tsx` - Setup operations (uses basic auth)

### ✅ **Custom API Client** - Article Operations
**Status**: ✅ Properly Authenticated

**Implementation**:
```typescript
// In ArticleForm.tsx
const handleSave = async (e: React.FormEvent) => {
  if (!jwt) {
    setError('Please log in to save articles');
    return;
  }

  const api = createApiClient({ jwt }); // JWT passed to client
  
  if (article?.id) {
    savedArticle = await api.updateArticle(article.id, articleData);
  } else {
    savedArticle = await api.createArticle(articleData);
  }
};
```

**Used in**:
- `components/ArticleForm.tsx` - Article creation and editing

## Authentication Patterns

### Pattern 1: Using withAuthenticatedAPI Wrapper (Recommended for new code)

```typescript
// For FileService, EventTrackerService, etc.
const result = await withAuthenticatedAPI(jwt, async () => {
  return await SomeService.someMethod(data);
});
```

### Pattern 2: Manual Configuration (Existing code)

```typescript
// Configure OpenAPI directly
if (jwt) {
  OpenAPI.TOKEN = jwt;
  OpenAPI.USERNAME = undefined;
  OpenAPI.PASSWORD = undefined;
} else {
  // Handle unauthenticated case
}

const result = await SomeService.someMethod(data);
```

### Pattern 3: Custom API Client (Article operations)

```typescript
// Use createApiClient with JWT
const api = createApiClient({ jwt });
const result = await api.someMethod(data);
```

## Error Handling

### Authentication Errors

```typescript
try {
  const result = await withAuthenticatedAPI(jwt, async () => {
    return await SomeService.someMethod(data);
  });
} catch (error) {
  if (error.message.includes('Authentication required')) {
    // Handle authentication error
    setError('Please log in to perform this action');
  } else {
    // Handle other errors
    setError('Operation failed. Please try again.');
  }
}
```

### JWT Token Validation

```typescript
const MyComponent = () => {
  const { jwt, isAuthenticated } = useAuth();
  
  const handleAction = async () => {
    if (!jwt || !isAuthenticated) {
      alert('Please log in to perform this action');
      return;
    }
    
    // Proceed with authenticated API call
    try {
      await someAuthenticatedOperation(jwt);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };
};
```

## Security Best Practices

### 1. Always Check for JWT Before API Calls

```typescript
if (!jwt) {
  // Handle unauthenticated state
  return;
}

// Proceed with API call
```

### 2. Use Centralized Authentication Wrappers

```typescript
// Preferred
await withAuthenticatedAPI(jwt, () => SomeService.method());

// Instead of manual configuration everywhere
```

### 3. Graceful Degradation

```typescript
// Allow public access for non-sensitive operations
if (jwt) {
  OpenAPI.TOKEN = jwt;
} else {
  // Use basic auth or handle as public request
  OpenAPI.USERNAME = 'admin@local';
  OpenAPI.PASSWORD = 'develop';
}
```

### 4. Clear Error Messages

```typescript
if (!jwt) {
  setError('Please log in to upload files');
  return;
}
```

## Testing Authentication

### 1. Logged In State
- File uploads should work
- AI suggestions should be requested (even if mocked)
- Article saving should work
- Personal content should be accessible

### 2. Logged Out State
- File uploads should show authentication error
- AI suggestions should be disabled
- Article saving should prompt for login
- Only public content should be accessible

### 3. Token Expiration
- API calls should fail gracefully
- User should be prompted to re-authenticate
- No sensitive operations should proceed

## Migration Checklist

When adding new API service integrations:

- [ ] ✅ Import `withAuthenticatedAPI` from `@/lib/consolidatedApi`
- [ ] ✅ Access JWT token using `useAuth()` hook
- [ ] ✅ Check for JWT existence before API calls
- [ ] ✅ Use `withAuthenticatedAPI` wrapper for service calls
- [ ] ✅ Handle authentication errors gracefully
- [ ] ✅ Test both authenticated and unauthenticated states
- [ ] ✅ Update this documentation

## Summary

All API services in the application now properly handle JWT authentication:

1. **FileService**: ✅ Uses `withAuthenticatedAPI` wrapper
2. **EventTrackerService**: ✅ Uses `withAuthenticatedAPI` wrapper  
3. **DataService**: ✅ Manually configures OpenAPI with JWT
4. **UserService**: ✅ Manually configures OpenAPI with JWT
5. **Custom API Client**: ✅ Accepts JWT in constructor

The application gracefully handles both authenticated and unauthenticated states, ensuring security while maintaining functionality.
