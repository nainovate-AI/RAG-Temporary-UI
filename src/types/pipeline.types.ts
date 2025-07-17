// src/types/pipeline.types.ts
export type PipelineType = 'rag' | 'llm'
export type MetadataFilter = Record<string, any>;
export interface PipelineConfig {
  type: PipelineType
  name: string
  description: string
  tags: string[]
  
  // RAG-specific fields (optional for LLM pipelines)
  collectionIds?: string[]
  retrievalConfig?: {
    searchMethod: 'vector' | 'hybrid' | 'keyword'
    topK: number
    scoreThreshold?: number
    reranker?: {
      enabled: boolean
      model: string
      topN?: number
    }
    filters?: MetadataFilter[]
    hybridAlpha?: number
  }
  
  // Common fields for both pipeline types
  memoryConfig: {
    enabled: boolean
    type: 'none' | 'buffer' | 'summary' | 'vector' | 'hybrid'
    config: {
      windowSize?: number
      summaryModel?: string
      collectionName?: string
      storageBackend: 'memory' | 'redis' | 'postgresql'
      ttl?: number
      autoClean?: boolean
      storePreferences?: boolean
      crossSession?: boolean
    }
  }
  
  mcpConfig: {
    enabled: boolean
    servers: MCPServer[]
  }
  
  llmConfig: {
    provider: string
    model: string
    temperature: number
    maxTokens: number
    systemPrompt: string
    userPromptTemplate: string
    streaming: boolean
  }
}

export interface MCPServer {
  id: string
  name: string
  description: string
  type: 'database' | 'web' | 'email' | 'filesystem' | 'custom'
  icon: string
  status: 'connected' | 'disconnected' | 'error'
  config: {
    url: string
    auth?: {
      type: 'bearer' | 'basic' | 'apikey'
      credentials: string
    }
    permissions?: string[]
    settings?: Record<string, any>
  }
}