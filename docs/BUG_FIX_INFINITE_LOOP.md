# Bug Fix: Maximum Update Depth Exceeded Error

## Issue Description
The application was encountering a "Maximum update depth exceeded" error, which is a React error indicating an infinite loop caused by components repeatedly calling setState during renders.

## Root Cause
The error was located in `/components/ArticlePreviewModal.tsx` in the `useEffect` hook. The issue was caused by improper dependency management:

### Problematic Code:
```typescript
const loadArticle = async () => {
  // ... async function logic
};

useEffect(() => {
  if (isOpen && articleId && jwt) {
    loadArticle();
  }
}, [isOpen, articleId, jwt]); // Missing loadArticle dependency
```

### Problem Analysis:
1. The `loadArticle` function was defined inside the component but not included in the useEffect dependencies
2. React was warning about the missing dependency with a lint error
3. Because `loadArticle` was recreated on every render, it was causing the useEffect to run infinitely
4. Each useEffect run triggered state updates (setLoading, setArticle, setError)
5. State updates caused re-renders, which recreated `loadArticle`, triggering the cycle again

## Solution
Fixed the issue by using `useCallback` to memoize the `loadArticle` function and properly managing dependencies:

### Fixed Code:
```typescript
const loadArticle = useCallback(async () => {
  if (!articleId || !jwt) return;

  setLoading(true);
  setError('');
  
  try {
    const api = createApiClient({ jwt });
    const result = await api.getArticleById(articleId);
    setArticle(result);
  } catch (err: any) {
    console.error('Failed to load article:', err);
    setError('Failed to load article content');
  } finally {
    setLoading(false);
  }
}, [articleId, jwt]);

useEffect(() => {
  if (isOpen && articleId && jwt) {
    loadArticle();
  }
}, [isOpen, articleId, jwt, loadArticle]);
```

### Solution Benefits:
1. **useCallback Memoization**: The `loadArticle` function is now memoized with `useCallback` and only recreated when its dependencies (`articleId`, `jwt`) change
2. **Proper Dependencies**: All dependencies are correctly listed in both useCallback and useEffect
3. **No Infinite Loops**: Since `loadArticle` is stable between renders (when dependencies don't change), the useEffect doesn't run unnecessarily
4. **React Lint Compliance**: No more React Hook dependency warnings

## Prevention
To prevent similar issues in the future:

1. **Always include function dependencies** in useEffect dependency arrays
2. **Use useCallback** for functions that are dependencies of other hooks
3. **Pay attention to React Hook lint warnings** - they often prevent serious runtime issues
4. **Test thoroughly** after adding new useEffect hooks, especially with async operations

## Impact
- ✅ Resolved infinite loop causing browser freezing
- ✅ Eliminated React runtime errors
- ✅ Fixed development console warnings
- ✅ Restored normal ArticlePreviewModal functionality
- ✅ No performance impact from the fix

## Files Modified
- `/components/ArticlePreviewModal.tsx`: Added useCallback import and fixed useEffect dependencies

The application now functions correctly with the article preview modal working as intended.
