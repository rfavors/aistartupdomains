import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface Domain {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  status: 'available' | 'sold' | 'pending';
  is_featured: boolean;
  seller_name?: string;
  created_at: string;
  views_count?: number;
  inquiries_count?: number;
  images?: string[];
}

export interface DomainFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  status?: string;
  is_featured?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface MarketplaceStats {
  total_domains: number;
  total_sales: number;
  average_price: number;
  active_listings: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  domain_count?: number;
}

export interface EmailSubscription {
  email: string;
  list_type?: 'newsletter' | 'vip_waitlist' | 'content_calendar';
  first_name?: string;
  last_name?: string;
  source?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  domain_id?: number;
}

export interface DomainGenerationRequest {
  businessIdea: string;
  industry?: string;
  keywords?: string;
  style?: string;
}

export interface DomainGenerationResponse {
  success: boolean;
  domains: string[];
  input: DomainGenerationRequest;
}

export interface DomainAvailabilityCheck {
  domain: string;
  available: boolean;
  estimatedPrice: number | null;
  registrar: string | null;
  checkedAt: string;
}

export interface DomainAvailabilityResponse {
  success: boolean;
  results: DomainAvailabilityCheck[];
  checkedAt: string;
}

export interface TrendingSuggestion {
  domain: string;
  category: string;
  reason: string;
}

export interface TrendingSuggestionsResponse {
  success: boolean;
  suggestions: TrendingSuggestion[];
  total: number;
}

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Domain endpoints
  async getDomains(
    filters: DomainFilters = {},
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<Domain[]>> {
    const params = new URLSearchParams();
    
    Object.entries({ ...filters, ...pagination }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/domains${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ApiResponse<Domain[]>>(endpoint);
  }

  async getFeaturedDomains(): Promise<Domain[]> {
    const response = await this.request<{ domains: Domain[] }>('/domains/featured');
    return response.domains;
  }

  async getDomainById(id: number): Promise<Domain> {
    const response = await this.request<{ domain: Domain }>(`/domains/${id}`);
    return response.domain;
  }

  async getMarketplaceStats(): Promise<MarketplaceStats> {
    const response = await this.request<{ stats: MarketplaceStats }>('/domains/stats');
    return response.stats;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.request<{ categories: Category[] }>('/domains/categories');
    return response.categories;
  }

  async createDomain(domainData: Partial<Domain>): Promise<Domain> {
    const response = await this.request<{ domain: Domain }>('/domains', {
      method: 'POST',
      body: JSON.stringify(domainData),
    });
    return response.domain;
  }

  // Email endpoints
  async subscribeEmail(subscription: EmailSubscription): Promise<{ message: string }> {
    return this.request<{ message: string }>('/email/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
    });
  }

  async submitContactForm(contactData: ContactForm): Promise<{ message: string }> {
    return this.request<{ message: string }>('/email/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // AI Domain Generation
  async generateDomains(data: DomainGenerationRequest): Promise<DomainGenerationResponse> {
    const response = await this.request('/ai/generate-domains', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to generate domains');
    }
    
    return response;
  }

  // Check domain availability
  async checkDomainAvailability(domains: string[]): Promise<DomainAvailabilityResponse> {
    const response = await this.request('/ai/check-availability', {
      method: 'POST',
      body: JSON.stringify({ domains })
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to check domain availability');
    }
    
    return response;
  }

  // Get trending domain suggestions
  async getTrendingSuggestions(category?: string, limit?: number): Promise<TrendingSuggestionsResponse> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit.toString());
    
    const url = `/ai/trending-suggestions${params.toString() ? '?' + params.toString() : ''}`;
    const response = await this.request(url);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get trending suggestions');
    }
    
    return response;
  }

  // User endpoints (for future authentication)
  async registerUser(userData: any): Promise<any> {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginUser(credentials: any): Promise<any> {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const {
  getDomains,
  getFeaturedDomains,
  getDomainById,
  getMarketplaceStats,
  getCategories,
  createDomain,
  subscribeEmail,
  submitContactForm,
  registerUser,
  loginUser,
  generateDomains,
  checkDomainAvailability,
  getTrendingSuggestions,
} = apiClient;

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Loading state hook utility
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
}

export default apiClient;