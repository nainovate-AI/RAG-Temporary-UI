import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface EmbeddingModel {
  id: string;
  provider: string;
  type: 'local' | 'cloud';
  name: string;
  description: string;
  dimensions: number;
  maxInputTokens: number;
  costPer1kTokens?: number;
  status: 'active' | 'inactive';
  modelSize?: number;
  requirements?: {
    gpu: number;
    ram: number;
    cpu: number;
  };
  resourceUsage?: {
    gpu: number;
    ram: number;
    cpu: number;
    cpuPercent: number;
  };
  performance?: {
    embeddingsPerSec: number;
    avgLatency: number;
    uptime: string;
  };
  usage?: {
    embeddingsToday: number;
    costToday: number;
  };
  collections?: Array<{
    name: string;
    embeddings: number;
  }>;
}

interface EmbeddingsState {
  entities: Record<string, EmbeddingModel>;
  ids: string[];
  loading: boolean;
  error: string | null;
}

interface EmbeddingsActions {
  setEmbeddings: (embeddings: EmbeddingModel[]) => void;
  updateEmbeddingStatus: (id: string, status: 'active' | 'inactive') => void;
  updateEmbeddingUsage: (id: string, usage: Partial<EmbeddingModel['usage']>) => void;
  updateEmbeddingPerformance: (id: string, performance: Partial<EmbeddingModel['performance']>) => void;
  addEmbeddingCollection: (id: string, collection: { name: string; embeddings: number }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getEmbeddingById: (id: string) => EmbeddingModel | undefined;
  getEmbeddingsArray: () => EmbeddingModel[];
  getEmbeddingsIds: () => string[];
  getActiveEmbeddings: () => EmbeddingModel[];
  getEmbeddingsByType: (type: 'local' | 'cloud') => EmbeddingModel[];
  getEmbeddingsByProvider: (provider: string) => EmbeddingModel[];
}

export const useEmbeddingsStore = create<EmbeddingsState & EmbeddingsActions>()(
  immer((set, get) => ({
    // State
    entities: {},
    ids: [],
    loading: false,
    error: null,

    // Actions
    setEmbeddings: (embeddings) =>
      set((state) => {
        state.entities = {};
        state.ids = [];
        embeddings.forEach((embedding) => {
          state.entities[embedding.id] = embedding;
          state.ids.push(embedding.id);
        });
        state.loading = false;
        state.error = null;
      }),

    updateEmbeddingStatus: (id, status) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].status = status;
        }
      }),

    updateEmbeddingUsage: (id, usage) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].usage = {
            ...state.entities[id].usage,
            ...usage,
          } as EmbeddingModel['usage'];
        }
      }),

    updateEmbeddingPerformance: (id, performance) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].performance = {
            ...state.entities[id].performance,
            ...performance,
          } as EmbeddingModel['performance'];
        }
      }),

    addEmbeddingCollection: (id, collection) =>
      set((state) => {
        if (state.entities[id]) {
          if (!state.entities[id].collections) {
            state.entities[id].collections = [];
          }
          state.entities[id].collections!.push(collection);
        }
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    // Computed values
    getEmbeddingById: (id) => get().entities[id],
    getEmbeddingsArray: () => Object.values(get().entities),
    getEmbeddingsIds: () => Object.values(get().ids),
    getActiveEmbeddings: () => Object.values(get().entities).filter(embedding => embedding.status === 'active'),
    getEmbeddingsByType: (type) => Object.values(get().entities).filter(embedding => embedding.type === type),
    getEmbeddingsByProvider: (provider) => Object.values(get().entities).filter(embedding => embedding.provider === provider),
  }))
);