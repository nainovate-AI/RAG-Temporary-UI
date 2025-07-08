// Pipeline Types
export type PipelineStatus = 'active' | 'inactive' | 'processing' | 'error'

export interface Pipeline {
  id: string
  name: string
  description?: string
  type: string
  status: PipelineStatus
  model: LLMModel
  documentsCount: number
  queriesPerDay: number
  avgLatency: number
  accuracy?: number
  costPerDay?: number
  createdAt: string
  updatedAt: string
  tags?: string[]
}

// Document Types
export interface Document {
  id: string
  name: string
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'html' | 'markdown' | 'json'
  size: number
  pages?: number
  rows?: number
  uploadedAt: string
  pipelineId?: string
  pipelineName?: string
  status: 'indexed' | 'processing' | 'error' | 'pending'
  tags: string[]
  metadata?: Record<string, any>
}

// Model Types
export interface LLMModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'cohere' | 'meta' | 'custom'
  costPer1kTokens: number
  contextWindow: number
  description?: string
  recommended?: boolean
}

export interface EmbeddingModel {
  id: string
  name: string
  provider: string
  dimensions: number
  costPer1kTokens?: number
}

// Query Types
export interface Query {
  id: string
  text: string
  pipelineId: string
  pipelineName: string
  timestamp: string
  latency: number
  tokensUsed: number
  cost: number
  status: 'success' | 'error'
}

export interface RetrievedDocument {
  id: string
  content: string
  score: number
  metadata: {
    filename: string
    updatedAt: string
    category: string
  }
}

// Configuration Types
export interface ChunkingConfig {
  strategy: 'recursive' | 'fixed' | 'semantic'
  chunkSize: number
  chunkOverlap: number
}

export interface RetrieverConfig {
  searchMethod: 'vector' | 'hybrid' | 'keyword'
  topK: number
  similarityThreshold: number
  enableMMR: boolean
  enableReranking: boolean
  rerankerModel?: string
  rerankTopN?: number
}

export interface GenerationConfig {
  model: string
  systemPrompt: string
  userPromptTemplate: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  enableStreaming: boolean
  includeCitations: boolean
  enableMemory: boolean
}

// Analytics Types
export interface Metrics {
  totalQueries: number
  avgLatency: number
  successRate: number
  totalCost: number
  queriesPerDay: number
  change?: number
}

export interface CostBreakdown {
  llm: number
  embeddings: number
  infrastructure: number
  total: number
  items: Array<{
    name: string
    cost: number
  }>
}

// Form Types
export interface PipelineFormData {
  name: string
  description: string
  tags: string[]
  chunking: ChunkingConfig
  embeddingModel: string
  vectorStore: {
    provider: string
    collectionName: string
    config?: Record<string, any>
  }
  retriever: RetrieverConfig
  generation: GenerationConfig
}