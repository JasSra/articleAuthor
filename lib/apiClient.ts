// lib/apiClient.ts
import { v4 as uuidv4 } from 'uuid';

// Define basic types for the API responses
export interface OperationResult<T = any> {
  outcome: 'Success' | 'Failure';
  message?: string;
  data?: T;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  body_json: any;
  images: string[];
  status: 'draft' | 'submitted' | 'approved' | 'scheduled' | 'published';
  month_tag: string;
  authorId: string;
  createdUtc: string;
  updatedUtc: string;
  tags?: string[];
}

export interface Approval {
  id: string;
  articleId: string;
  approverId: string;
  decision: 'approved' | 'rejected';
  note: string;
  decidedUtc: string;
}

export interface ApiClientConfig {
  baseUrl: string;
  jwt?: string;
  apiKey?: string;
  clientId?: string;
  useServerAuth?: boolean; // For setup/server operations without user auth
}

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Correlation-ID': uuidv4(),
    };

    // For setup/server operations, use API key + client ID headers
    if (this.config.useServerAuth || !this.config.jwt) {
      if (this.config.apiKey) {
        headers['X-API-Key'] = this.config.apiKey;
      }
      if (this.config.clientId) {
        headers['X-Client-Id'] = this.config.clientId;
      }
    } else {
      // For authenticated user operations, use Bearer token
      if (this.config.jwt) {
        headers['Authorization'] = `Bearer ${this.config.jwt}`;
      }
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok && response.status >= 500 && attempt < maxAttempts - 1) {
          attempt++;
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return this.unwrapResult(result);
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        attempt++;
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Max retry attempts reached');
  }

  private unwrapResult<T>(result: any): T {
    if (result?.outcome === 'Failure') {
      throw new Error(result?.message ?? 'Operation failed');
    }
    return (result?.data ?? result) as T;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Data Controller methods
  async getArticles(filters?: {
    status?: string[];
    month_tag?: string;
    authorId?: string;
    q?: string;
    page?: number;
    size?: number;
  }): Promise<{ items: Article[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status.join(','));
    if (filters?.month_tag) params.append('month_tag', filters.month_tag);
    if (filters?.authorId) params.append('authorId', filters.authorId);
    if (filters?.q) params.append('q', filters.q);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.size) params.append('size', filters.size.toString());
    
    const queryString = params.toString();
    const page = filters?.page || 1;
    const size = filters?.size || 100;
    const endpoint = `/api/Data/all/market/entity/Article/page/${page}/size/${size}${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getArticleById(id: string): Promise<Article> {
    return this.makeRequest(`/api/Data/by/${id}`);
  }

  async createArticle(article: Partial<Article>): Promise<Article> {
    return this.makeRequest('/api/Data/create/market/entity/Article', 'POST', article);
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<Article> {
    return this.makeRequest(`/api/Data/update/market/entity/Article/${id}`, 'PUT', article);
  }

  async deleteArticle(id: string): Promise<void> {
    return this.makeRequest(`/api/Data/remove/market/entity/Article/${id}`, 'DELETE');
  }

  // User Controller methods
  async registerExternal(externalToken: string): Promise<{ jwt: string }> {
    return this.makeRequest('/api/user/register/external', 'POST', {
      externalToken,
    });
  }

  async getUserProfile(): Promise<any> {
    return this.makeRequest('/api/user/profile');
  }

  // Lookup Controller methods
  async getLookup(groupName: string): Promise<{ items: Array<{ value: string; label: string }> }> {
    return this.makeRequest(`/api/Lookup/group/${groupName}`);
  }

  async createLookup(groupName: string, items: Array<{ value: string; label: string }>): Promise<any> {
    return this.makeRequest(`/api/Lookup/group/${groupName}/bulk`, 'POST', items);
  }

  // Content Controller methods
  async getContent(type: string, placeholder: string): Promise<any> {
    return this.makeRequest(`/api/Content/type/${type}/placeholder/${placeholder}`);
  }

  async createContent(content: { type: string; placeholder: string; data: any }): Promise<any> {
    return this.makeRequest('/api/ManageContent/create', 'POST', content);
  }

  // Form Controller methods
  async createForm(form: { name: string; schema: any }): Promise<{ id: string }> {
    return this.makeRequest('/api/form', 'POST', form);
  }

  async submitForm(formId: string, payload: any): Promise<any> {
    return this.makeRequest(`/api/form/${formId}/submit`, 'POST', { payload });
  }

  // Workflow Controller methods
  async createWorkflow(workflow: any): Promise<any> {
    return this.makeRequest('/api/workflow', 'POST', workflow);
  }

  // Approval methods
  async createApproval(approval: Partial<Approval>): Promise<Approval> {
    return this.makeRequest('/api/data/entity/Approval', 'POST', approval);
  }

  async getApprovals(articleId?: string): Promise<Approval[]> {
    const endpoint = articleId 
      ? `/api/data/all/market/entity/Approval?articleId=${articleId}`
      : '/api/data/all/market/entity/Approval';
    return this.makeRequest(endpoint);
  }

  // Swagger
  async getSwagger(): Promise<any> {
    return this.makeRequest('/swagger/v1/swagger.json');
  }
}

// Factory function for creating API client
export function createApiClient(config: Partial<ApiClientConfig> = {}): ApiClient {
  const defaultConfig: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229',
    apiKey: process.env.CONSOLIDATED_API_KEY,
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  };

  return new ApiClient({ ...defaultConfig, ...config });
}

// Factory function for server/setup operations (no user auth)
export function createServerApiClient(config: Partial<ApiClientConfig> = {}): ApiClient {
  const defaultConfig: ApiClientConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229',
    apiKey: process.env.CONSOLIDATED_API_KEY,
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    useServerAuth: true,
  };

  return new ApiClient({ ...defaultConfig, ...config });
}

// Helper function for unwrapping results (legacy compatibility)
export async function unwrap<T>(op: Promise<any>): Promise<T> {
  const res = await op;
  if (res?.outcome === 'Failure') {
    throw new Error(res?.message ?? 'Operation failed');
  }
  return (res?.data ?? res) as T;
}
