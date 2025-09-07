import React, { useEffect, useRef, useCallback } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { createApiClient } from '@/lib/apiClient';
import { useAuth } from '@/lib/auth/StableMSALProvider';

interface AutoSaveOptions {
  articleId?: string;
  content: string;
  title?: string;
  enabled?: boolean;
  onSave?: (success: boolean) => void;
  onError?: (error: Error) => void;
}

export function useAutoSave(options: AutoSaveOptions) {
  const { jwt } = useAuth();
  const { preferences } = useUserStore();
  const { markUnsavedChanges } = useUserStore();
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedContentRef = useRef<string>('');
  const savingRef = useRef<boolean>(false);

  const saveContent = useCallback(async () => {
    if (!jwt || !options.articleId || savingRef.current) return;
    
    // Don't save if content hasn't changed
    if (lastSavedContentRef.current === options.content) return;
    
    savingRef.current = true;
    
    try {
      const api = createApiClient({ jwt });
      await api.updateArticle(options.articleId, {
        body_json: options.content,
        title: options.title,
        updatedUtc: new Date().toISOString(),
      });
      
      lastSavedContentRef.current = options.content;
      markUnsavedChanges(false);
      options.onSave?.(true);
    } catch (error) {
      console.error('Auto-save failed:', error);
      markUnsavedChanges(true);
      options.onSave?.(false);
      options.onError?.(error instanceof Error ? error : new Error('Auto-save failed'));
    } finally {
      savingRef.current = false;
    }
  }, [jwt, options, markUnsavedChanges]);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't auto-save if disabled or no content change
    if (!preferences.autoSave || !options.enabled || !options.content) {
      return;
    }

    // Mark as having unsaved changes if content differs from last saved
    if (lastSavedContentRef.current !== options.content) {
      markUnsavedChanges(true);
    }

    // Set up auto-save timeout
    timeoutRef.current = setTimeout(() => {
      saveContent();
    }, preferences.autoSaveInterval * 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [options.content, options.enabled, preferences.autoSave, preferences.autoSaveInterval, saveContent, markUnsavedChanges]);

  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveContent();
  }, [saveContent]);

  return {
    forceSave,
    isSaving: savingRef.current,
    hasUnsavedChanges: lastSavedContentRef.current !== options.content,
  };
}
