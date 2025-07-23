export type PipelineType = 'rag' | 'llm';
export type RAGUseCase = 'qa' | 'search' | 'chat' | 'analysis' | 'extraction' | 'custom';
export type LLMUseCase = 'content' | 'transform' | 'code' | 'summarize' | 'extract' | 'custom';

export interface UseCaseConfig {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface PipelineUseCases {
  rag: UseCaseConfig[];
  llm: UseCaseConfig[];
}

export interface SystemPrompts {
  rag: Record<RAGUseCase, string>;
  llm: Record<LLMUseCase, string>;
}

export interface UserPromptTemplates {
  rag: string;
  llm: string;
}

export interface SearchMethod {
  id: string;
  label: string;
  description: string;
}

export interface MemoryType {
  id: string;
  label: string;
  description: string;
}

export interface PipelineConfig {
  useCases: PipelineUseCases;
  defaultSystemPrompts: SystemPrompts;
  defaultUserPromptTemplates: UserPromptTemplates;
  searchMethods: SearchMethod[];
  memoryTypes: MemoryType[];
}