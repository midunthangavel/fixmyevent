// Centralized HTTP Client with proper error handling, caching, and retry logic
export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private maxCacheSize: number = 100;
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor(baseURL: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  /**
   * Make a GET request with caching
   */
  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    const cacheKey = `GET:${url}`;
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.makeRequest(url, { ...options, method: 'GET' });
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      throw this.handleError(error, 'GET', url);
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    try {
      const response = await this.makeRequest(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      throw this.handleError(error, 'POST', url);
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    try {
      const response = await this.makeRequest(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      throw this.handleError(error, 'PUT', url);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await this.makeRequest(url, { ...options, method: 'DELETE' });
      return await response.json();
    } catch (error) {
      throw this.handleError(error, 'DELETE', url);
    }
  }

  /**
   * Make a request with retry logic
   */
  private async makeRequest(url: string, options: RequestInit, retries: number = 3): Promise<Response> {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    try {
      const response = await fetch(fullURL, {
        headers: this.defaultHeaders,
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(1000 * (4 - retries)); // Exponential backoff
        return this.makeRequest(url, options, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    if (error instanceof TypeError && error.message.includes('fetch')) return true;
    if (error.message?.includes('network')) return true;
    return false;
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get data from cache
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set data in cache
   */
  private setCache(key: string, data: any, ttl: number = this.defaultTTL): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any, method: string, url: string): Error {
    const context = { method, url, timestamp: new Date().toISOString() };
    
    if (error instanceof Error) {
      return new Error(`HTTP ${method} request failed: ${error.message}`, { cause: { ...context, originalError: error } });
    }
    
    return new Error(`HTTP ${method} request failed: Unknown error`, { cause: { ...context, originalError: error } });
  }
}

// Default HTTP client instance
export const httpClient = new HttpClient();

// Specialized clients for different services
export const aiHttpClient = new HttpClient('', {
  'Authorization': `Bearer ${process.env.AI_API_KEY || ''}`,
});

export const firebaseHttpClient = new HttpClient('', {
  'Authorization': `Bearer ${process.env.FIREBASE_AUTH_TOKEN || ''}`,
});
