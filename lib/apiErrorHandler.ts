// Enhanced API Error Handling with graceful 403 handling
import { toast } from 'react-hot-toast';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  correlationId?: string;
}

export class ApiErrorHandler {
  private static retryAttempts = new Map<string, number>();
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  static async handleApiCall<T>(
    apiCall: () => Promise<T>,
    options: {
      showToast?: boolean;
      silentOn?: number[];
      retryOn?: number[];
      onError?: (error: ApiError) => void;
      context?: string;
    } = {}
  ): Promise<T | null> {
    const {
      showToast = true,
      silentOn = [],
      retryOn = [500, 502, 503, 504],
      onError,
      context = 'API call'
    } = options;

    const callKey = this.generateCallKey(apiCall.toString(), context);

    try {
      const result = await apiCall();
      // Reset retry count on success
      this.retryAttempts.delete(callKey);
      return result;
    } catch (error: any) {
      const apiError = this.parseError(error);
      const attempts = this.retryAttempts.get(callKey) || 0;

      // Handle specific error cases
      if (apiError.status === 403) {
        return this.handle403Error(apiError, showToast && !silentOn.includes(403), onError);
      }

      if (apiError.status === 401) {
        return this.handle401Error(apiError, showToast && !silentOn.includes(401), onError);
      }

      // Retry logic for specified status codes
      if (retryOn.includes(apiError.status) && attempts < this.MAX_RETRIES) {
        this.retryAttempts.set(callKey, attempts + 1);
        await this.delay(this.RETRY_DELAY * (attempts + 1));
        return this.handleApiCall(apiCall, options);
      }

      // Handle other errors
      this.logError(apiError, context);
      
      if (showToast && !silentOn.includes(apiError.status)) {
        this.showErrorToast(apiError);
      }

      if (onError) {
        onError(apiError);
      }

      return null;
    }
  }

  private static handle403Error(
    error: ApiError,
    showToast: boolean,
    onError?: (error: ApiError) => void
  ): null {
    console.warn('Access denied (403):', error.message);
    
    if (showToast) {
      toast.error(
        'Access denied. You may not have permission to perform this action.',
        {
          duration: 4000,
          id: 'access-denied-403'
        }
      );
    }

    if (onError) {
      onError(error);
    }

    return null;
  }

  private static handle401Error(
    error: ApiError,
    showToast: boolean,
    onError?: (error: ApiError) => void
  ): null {
    console.warn('Authentication required (401):', error.message);
    
    if (showToast) {
      toast.error(
        'Please sign in to continue.',
        {
          duration: 4000,
          id: 'auth-required-401'
        }
      );
    }

    // Could trigger re-authentication flow here
    // window.location.href = '/login';

    if (onError) {
      onError(error);
    }

    return null;
  }

  private static parseError(error: any): ApiError {
    let status = 500;
    let message = 'An unexpected error occurred';
    let code: string | undefined;
    let correlationId: string | undefined;

    if (error.response) {
      // HTTP error response
      status = error.response.status;
      message = error.response.data?.message || error.response.statusText;
      code = error.response.data?.code;
      correlationId = error.response.headers?.['x-correlation-id'];
    } else if (error.status) {
      // Direct status error
      status = error.status;
      message = error.message || error.statusText;
    } else if (error.message) {
      // Generic error with message
      message = error.message;
      
      // Try to extract status from message
      const statusMatch = error.message.match(/HTTP (\d+):/);
      if (statusMatch) {
        status = parseInt(statusMatch[1]);
      }
    }

    return { status, message, code, correlationId };
  }

  private static logError(error: ApiError, context: string): void {
    const logData = {
      context,
      status: error.status,
      message: error.message,
      code: error.code,
      correlationId: error.correlationId,
      timestamp: new Date().toISOString()
    };

    console.error('API Error:', logData);

    // Could send to error tracking service here
    // Sentry.captureException(error, { extra: logData });
  }

  private static showErrorToast(error: ApiError): void {
    let message = error.message;
    let duration = 4000;

    // Customize message based on status
    switch (error.status) {
      case 400:
        message = 'Invalid request. Please check your input.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = 'This action conflicts with existing data.';
        break;
      case 429:
        message = 'Too many requests. Please wait and try again.';
        duration = 6000;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        message = 'Server error. Please try again later.';
        duration = 6000;
        break;
    }

    toast.error(message, {
      duration,
      id: `error-${error.status}`
    });
  }

  private static generateCallKey(functionString: string, context: string): string {
    // Simple hash function for generating unique call keys
    let hash = 0;
    const str = functionString + context;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods for common patterns
  static async safeApiCall<T>(
    apiCall: () => Promise<T>,
    fallback: T,
    context?: string
  ): Promise<T> {
    const result = await this.handleApiCall(apiCall, {
      showToast: false,
      silentOn: [403, 404],
      context
    });
    return result ?? fallback;
  }

  static async criticalApiCall<T>(
    apiCall: () => Promise<T>,
    context?: string
  ): Promise<T> {
    const result = await this.handleApiCall(apiCall, {
      showToast: true,
      context
    });
    
    if (result === null) {
      throw new Error(`Critical API call failed: ${context}`);
    }
    
    return result;
  }
}

// Export convenience functions
export const safeApiCall = ApiErrorHandler.safeApiCall.bind(ApiErrorHandler);
export const criticalApiCall = ApiErrorHandler.criticalApiCall.bind(ApiErrorHandler);
export const handleApiCall = ApiErrorHandler.handleApiCall.bind(ApiErrorHandler);
