import { DocumentCollection } from '@/store/slices/collections.slice';

interface DataResponse<T> {
  data?: T;
  error?: string;
}

class DataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetchData<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<DataResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Collections
  async getCollections() {
    return this.fetchData<{ collections: DocumentCollection[] }>('/api/collections');
  }

  async getCollection(id: string) {
    return this.fetchData<DocumentCollection>(`/api/collections/${id}`);
  }

  async createCollection(collection: Omit<DocumentCollection, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.fetchData<DocumentCollection>('/api/collections', {
      method: 'POST',
      body: JSON.stringify(collection),
    });
  }

  async updateCollection(id: string, updates: Partial<DocumentCollection>) {
    return this.fetchData<DocumentCollection>(`/api/collections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteCollection(id: string) {
    return this.fetchData<{ success: boolean }>(`/api/collections/${id}`, {
      method: 'DELETE',
    });
  }

  // Pipelines
  async getPipelines() {
    return this.fetchData<{ pipelines: any[] }>('/api/pipelines');
  }

  async getPipeline(id: string) {
    return this.fetchData<any>(`/api/pipelines/${id}`);
  }

  async createPipeline(pipeline: any) {
    return this.fetchData<any>('/api/pipelines', {
      method: 'POST',
      body: JSON.stringify(pipeline),
    });
  }

  async updatePipeline(id: string, updates: any) {
    return this.fetchData<any>(`/api/pipelines/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deletePipeline(id: string) {
    return this.fetchData<{ success: boolean }>(`/api/pipelines/${id}`, {
      method: 'DELETE',
    });
  }

  // Models
  async getModels() {
    return this.fetchData<{ models: any[] }>('/api/models');
  }

  // Embeddings
  async getEmbeddings() {
    return this.fetchData<{ embeddings: any[] }>('/api/embeddings');
  }

  // Vector Stores
  async getVectorStores() {
    return this.fetchData<{ vectorStores: any[] }>('/api/vector-stores');
  }

  // Jobs
  async getJobs() {
    return this.fetchData<{ jobs: any[] }>('/api/jobs');
  }

  async getJob(id: string) {
    return this.fetchData<any>(`/api/jobs/${id}`);
  }

  async createJob(job: any) {
    return this.fetchData<any>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  // Update job status
  async updateJobStatus(id: string, status: string, state: string) {
    return this.fetchData<any>(`/api/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, state }),
    });
  }
}

// Export singleton instance
export const dataService = new DataService();