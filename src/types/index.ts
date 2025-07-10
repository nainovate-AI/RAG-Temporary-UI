// Core Types for RAGDP-UI

// ============ EXISTING TYPES (Keep these) ============

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'paused' | 'error' | 'draft' | 'processing';
  
  // NEW: Reference to document collections instead of direct model
  collectionIds: string[];  // NEW FIELD
  
  // REMOVE model field, replace with retrievalConfig and llmConfig
  // model: { ... }  // REMOVE THIS
  
  // NEW: Retrieval Configuration
  retrievalConfig: {
    searchMethod: 'vector' | 'hybrid' | 'keyword';
    topK: number;
    scoreThreshold?: number;
    reranker?: {
      enabled: boolean;
      model: string;
      topN?: number;
    };
    filters?: MetadataFilter[];
  };
  
  // NEW: LLM Configuration
  llmConfig: {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    userPromptTemplate: string;
    streaming: boolean;
  };
  
  // KEEP these existing fields
  documentsCount: number;
  queriesPerDay: number;
  avgLatency: number;
  accuracy: number;
  costPerDay: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  
  // ADD new optional fields
  lastQueryAt?: string;
  metrics?: {
    totalQueries: number;
    failureRate: number;
  };
}

export interface RetrievedDocument {
  id: string;
  content: string;
  score: number;
  metadata: {
    filename: string;
    collectionName: string;  // NEW FIELD
    chunkIndex?: number;     // NEW FIELD
    pageNumber?: number;     // NEW FIELD
    updatedAt?: string;
    category?: string;
    [key: string]: any;
  };
}

// ============ NEW TYPES TO ADD ============

// Document Collection Types
export interface DocumentCollection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  totalChunks: number;
  totalSize: number; // in bytes
  embeddingModel: {
    id: string;
    name: string;
    provider: string;
    dimensions: number;
  };
  vectorStore: {
    type: string;
    collectionName: string;
    namespace?: string;
  };
  chunkingConfig: {
    strategy: 'recursive' | 'fixed' | 'semantic';
    chunkSize: number;
    chunkOverlap: number;
  };
  status: 'processing' | 'ready' | 'error' | 'partial';
  progress?: {
    current: number;
    total: number;
    stage: string;
  };
  metadata: {
    tags: string[];
    category?: string;
    language?: string;
    accessLevel?: 'public' | 'private' | 'restricted';
  };
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  error?: string;
}

// Individual Document Type
export interface Document {
  id: string;
  collectionId: string;
  filename: string;
  type: string;
  size: number;
  chunkCount: number;
  metadata: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploadedAt: string;
  processedAt?: string;
  error?: string;
}

// Metadata Filter
export interface MetadataFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_equals';
  value: string | string[] | number;
}

// Ingestion Job
export interface IngestionJob {
  id: string;
  collectionId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  stage: 'uploading' | 'parsing' | 'chunking' | 'embedding' | 'storing';
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  startedAt: string;
  completedAt?: string;
  duration?: number;
  error?: string;
  stats?: {
    documentsProcessed: number;
    chunksCreated: number;
    tokensProcessed: number;
    embeddingsCreated: number;
  };
}

// Model Configuration
export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'cohere' | 'local' | 'google' | 'custom';
  type: 'llm' | 'embedding' | 'reranker';
  costPer1kTokens?: number;
  contextWindow?: number;
  dimensions?: number; // for embeddings
  available: boolean;
}

// Vector Store Configuration
export interface VectorStoreConfig {
  id: string;
  type: 'qdrant' | 'pinecone' | 'weaviate' | 'chroma' | 'faiss';
  name: string;
  connection: {
    url?: string;
    apiKey?: string;
    environment?: string;
  };
  collections: string[];
  status: 'connected' | 'disconnected' | 'error';
}

// Stats for Dashboard
export interface DashboardStats {
  totalDocuments: number;
  totalCollections: number;
  activePipelines: number;
  queriesToday: number;
  avgLatency: number;
  totalStorage: number;
  processingJobs: number;
}

// Query Result
export interface QueryResult {
  id: string;
  pipelineId: string;
  query: string;
  response: string;
  retrievedDocuments: RetrievedDocument[];
  latency: number;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;
  timestamp: string;
}

// Enums for consistency
export enum ChunkingStrategy {
  RECURSIVE = 'recursive',
  FIXED = 'fixed',
  SEMANTIC = 'semantic'
}

export enum SearchMethod {
  VECTOR = 'vector',
  HYBRID = 'hybrid',
  KEYWORD = 'keyword'
}

export enum JobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum PipelineStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ERROR = 'error',
  DRAFT = 'draft'
}

// ============ KEEP ANY OTHER EXISTING TYPES YOU HAVE ============
// Add any other types from your original file here