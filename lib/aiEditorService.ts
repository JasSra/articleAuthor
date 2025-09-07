// Enhanced AI Service using SuggestiveService for live editing assistance
import { SuggestiveService } from '@/api/consolidated';
import { withAuthenticatedAPI } from '@/lib/consolidatedApi';
import { handleApiCall } from '@/lib/apiErrorHandler';
import type { AISuggestion, PromptRequest } from '@/api/consolidated';

export interface EditorContext {
  content: string;
  cursorPosition: number;
  selectedText?: string;
  contentType: 'markdown' | 'html' | 'text';
  metadata?: {
    title?: string;
    tags?: string[];
    audience?: string;
    purpose?: string;
  };
}

export interface SuggestionOptions {
  types?: SuggestionType[];
  maxSuggestions?: number;
  includeFormatting?: boolean;
  includeContent?: boolean;
  includeGrammar?: boolean;
}

export enum SuggestionType {
  CONTENT_IMPROVEMENT = 'content-improvement',
  FORMATTING = 'formatting',
  GRAMMAR = 'grammar',
  STRUCTURE = 'structure',
  SEO = 'seo',
  READABILITY = 'readability',
  TONE = 'tone',
  COMPLETION = 'completion'
}

export class AIEditorService {
  private jwt: string;
  private suggestionCache = new Map<string, AISuggestion[]>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(jwt: string) {
    this.jwt = jwt;
  }

  async getSuggestions(
    context: EditorContext,
    options: SuggestionOptions = {}
  ): Promise<AISuggestion[]> {
    const {
      types = [SuggestionType.CONTENT_IMPROVEMENT, SuggestionType.FORMATTING],
      maxSuggestions = 5,
      includeFormatting = true,
      includeContent = true,
      includeGrammar = true
    } = options;

    // Check cache first
    const cacheKey = this.generateCacheKey(context, options);
    const cached = this.getCachedSuggestions(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Prepare context for AI
      const prompt = this.buildPrompt(context, options);
      
      const result = await handleApiCall(
        () => withAuthenticatedAPI(this.jwt, () => 
          SuggestiveService.makeSuggestion({ prompt })
        ),
        {
          context: 'AI Suggestions',
          silentOn: [403, 429], // Silent on rate limits and permissions
          showToast: false
        }
      );

      if (result) {
        const suggestions = this.parseSuggestionResponse(result, types, maxSuggestions);
        this.cacheSuggestions(cacheKey, suggestions);
        return suggestions;
      }

      // Fallback to local suggestions if API fails
      return this.generateFallbackSuggestions(context, options);
    } catch (error) {
      console.warn('AI suggestion service failed, using fallback:', error);
      return this.generateFallbackSuggestions(context, options);
    }
  }

  async getContinuationSuggestion(
    context: EditorContext
  ): Promise<string | null> {
    try {
      const prompt = this.buildContinuationPrompt(context);
      
      const result = await handleApiCall(
        () => withAuthenticatedAPI(this.jwt, () => 
          SuggestiveService.makeSuggestion({ prompt })
        ),
        {
          context: 'Content Continuation',
          silentOn: [403, 429],
          showToast: false
        }
      );

      if (result && typeof result === 'string') {
        return this.extractContinuation(result);
      }

      return null;
    } catch (error) {
      console.warn('Continuation suggestion failed:', error);
      return null;
    }
  }

  async getContentImprovement(
    text: string,
    improvementType: 'clarity' | 'conciseness' | 'engagement' | 'tone'
  ): Promise<string | null> {
    try {
      const prompt = this.buildImprovementPrompt(text, improvementType);
      
      const result = await handleApiCall(
        () => withAuthenticatedAPI(this.jwt, () => 
          SuggestiveService.makeSuggestion({ prompt })
        ),
        {
          context: 'Content Improvement',
          silentOn: [403, 429],
          showToast: false
        }
      );

      if (result && typeof result === 'string') {
        return this.extractImprovement(result);
      }

      return null;
    } catch (error) {
      console.warn('Content improvement failed:', error);
      return null;
    }
  }

  private buildPrompt(context: EditorContext, options: SuggestionOptions): string {
    const { content, cursorPosition, selectedText, contentType, metadata } = context;
    
    let prompt = `Please analyze the following ${contentType} content and provide suggestions for improvement:\n\n`;
    
    // Add metadata context
    if (metadata?.title) {
      prompt += `Title: ${metadata.title}\n`;
    }
    if (metadata?.purpose) {
      prompt += `Purpose: ${metadata.purpose}\n`;
    }
    if (metadata?.audience) {
      prompt += `Target Audience: ${metadata.audience}\n`;
    }
    if (metadata?.tags?.length) {
      prompt += `Tags: ${metadata.tags.join(', ')}\n`;
    }
    
    prompt += `\nContent:\n${content}\n\n`;
    
    if (selectedText) {
      prompt += `Selected text: "${selectedText}"\n`;
    }
    
    prompt += `Cursor position: ${cursorPosition}\n\n`;
    
    prompt += `Please provide suggestions for:\n`;
    if (options.includeContent) prompt += `- Content improvement and clarity\n`;
    if (options.includeFormatting) prompt += `- Formatting and structure\n`;
    if (options.includeGrammar) prompt += `- Grammar and style\n`;
    
    prompt += `\nReturn suggestions in JSON format with the following structure:
{
  "suggestions": [
    {
      "type": "content-improvement|formatting|grammar|structure",
      "message": "Description of the suggestion",
      "confidence": 0.85,
      "priority": "high|medium|low",
      "action": {
        "type": "replace|insert|delete",
        "start": 0,
        "end": 10,
        "text": "replacement text"
      }
    }
  ]
}`;

    return prompt;
  }

  private buildContinuationPrompt(context: EditorContext): string {
    const { content, cursorPosition, metadata } = context;
    
    const beforeCursor = content.substring(0, cursorPosition);
    const afterCursor = content.substring(cursorPosition);
    
    let prompt = `Continue writing the following ${context.contentType} content:\n\n`;
    
    if (metadata?.title) {
      prompt += `Title: ${metadata.title}\n`;
    }
    
    prompt += `\nContent so far:\n${beforeCursor}\n\n`;
    
    if (afterCursor.trim()) {
      prompt += `Remaining content:\n${afterCursor}\n\n`;
    }
    
    prompt += `Please provide a natural continuation of 1-3 sentences that fits the context and maintains the writing style.`;
    
    return prompt;
  }

  private buildImprovementPrompt(text: string, improvementType: string): string {
    return `Please improve the following text for ${improvementType}:\n\n"${text}"\n\nProvide only the improved version without explanations.`;
  }

  private parseSuggestionResponse(
    response: string,
    types: SuggestionType[],
    maxSuggestions: number
  ): AISuggestion[] {
    try {
      const parsed = JSON.parse(response);
      const suggestions = parsed.suggestions || [];
      
      return suggestions
        .filter((s: any) => types.includes(s.type))
        .slice(0, maxSuggestions)
        .map((s: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          type: s.type,
          message: s.message,
          confidence: s.confidence || 0.8,
          priority: s.priority || 'medium',
          action: s.action ? {
            type: s.action.type,
            label: this.getActionLabel(s.action.type),
            parameters: {
              start: s.action.start,
              end: s.action.end,
              text: s.action.text
            }
          } : undefined
        }));
    } catch (error) {
      console.warn('Failed to parse AI suggestion response:', error);
      return [];
    }
  }

  private extractContinuation(response: string): string | null {
    // Clean up the response and extract just the continuation text
    const cleaned = response
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .replace(/^\s*[\r\n]+|[\r\n]+\s*$/g, '') // Remove leading/trailing whitespace
      .trim();
    
    return cleaned.length > 0 ? cleaned : null;
  }

  private extractImprovement(response: string): string | null {
    return this.extractContinuation(response);
  }

  private generateFallbackSuggestions(
    context: EditorContext,
    options: SuggestionOptions
  ): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const { content } = context;

    // Basic formatting suggestions
    if (options.includeFormatting && context.contentType === 'markdown') {
      if (!content.includes('#')) {
        suggestions.push({
          id: 'fallback-heading',
          type: 'formatting',
          message: 'Consider adding headings to structure your content',
          confidence: 0.7,
          priority: 'medium',
          action: {
            type: 'insertText',
            label: 'Add heading',
            parameters: { text: '\n\n## Section Title\n\n' }
          }
        });
      }

      if (content.length > 500 && !content.includes('\n- ') && !content.includes('\n* ')) {
        suggestions.push({
          id: 'fallback-list',
          type: 'formatting',
          message: 'Break up long paragraphs with bullet points',
          confidence: 0.6,
          priority: 'low',
          action: {
            type: 'insertText',
            label: 'Add list',
            parameters: { text: '\n\n- Key point 1\n- Key point 2\n- Key point 3\n\n' }
          }
        });
      }
    }

    // Content suggestions
    if (options.includeContent) {
      if (content.length < 50) {
        suggestions.push({
          id: 'fallback-expand',
          type: 'content-improvement',
          message: 'Consider expanding your content with more details',
          confidence: 0.8,
          priority: 'high'
        });
      }

      if (content.length > 2000) {
        suggestions.push({
          id: 'fallback-break',
          type: 'structure',
          message: 'Consider breaking this into smaller sections',
          confidence: 0.7,
          priority: 'medium'
        });
      }
    }

    return suggestions.slice(0, options.maxSuggestions || 3);
  }

  private getActionLabel(actionType: string): string {
    switch (actionType) {
      case 'replace': return 'Replace text';
      case 'insert': return 'Insert text';
      case 'delete': return 'Remove text';
      case 'insertText': return 'Insert';
      default: return 'Apply';
    }
  }

  private generateCacheKey(context: EditorContext, options: SuggestionOptions): string {
    // Generate a simple hash for caching
    const key = JSON.stringify({
      content: context.content.substring(0, 200), // Only first 200 chars for cache key
      types: options.types,
      contentType: context.contentType
    });
    
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  private getCachedSuggestions(key: string): AISuggestion[] | null {
    const cached = this.suggestionCache.get(key);
    if (cached) {
      return cached;
    }
    return null;
  }

  private cacheSuggestions(key: string, suggestions: AISuggestion[]): void {
    this.suggestionCache.set(key, suggestions);
    
    // Clear cache after TTL
    setTimeout(() => {
      this.suggestionCache.delete(key);
    }, this.CACHE_TTL);
  }

  // Clear cache manually
  clearCache(): void {
    this.suggestionCache.clear();
  }
}

// Factory function
export function createAIEditorService(jwt: string): AIEditorService {
  return new AIEditorService(jwt);
}
