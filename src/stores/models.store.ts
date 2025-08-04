import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Model {
  id: string;
  provider: string;
  type: 'local' | 'cloud';
  name: string;
  description: string;
  contextWindow: number;
  maxOutputTokens: number;
  costPer1kTokens: {
    input: number;
    output: number;
  };
  features?: string[];
  status: 'active' | 'inactive';
  
  // For local models
  modelSize?: number;
  quantization?: string;
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
    tokensPerSec: number;
    avgLatency: number;
    uptime: string;
    requestsProcessed: number;
  };
  
  // For cloud models
  usage?: {
    tokensToday: {
      input: number;
      output: number;
    };
    costToday: number;
    requestsToday: number;
  };
}

interface ModelsState {
  entities: Record<string, Model>;
  ids: string[];
  loading: boolean;
  error: string | null;
}

interface ModelsActions {
  setModels: (models: Model[]) => void;
  updateModelStatus: (id: string, status: 'active' | 'inactive') => void;
  updateModelUsage: (id: string, usage: Partial<Model['usage']>) => void;
  updateModelPerformance: (id: string, performance: Partial<Model['performance']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getModelById: (id: string) => Model | undefined;
  getModelsArray: () => Model[];
  getActiveModels: () => Model[];
  getModelsByType: (type: 'local' | 'cloud') => Model[];
  getModelsByProvider: (provider: string) => Model[];
}

export const useModelsStore = create<ModelsState & ModelsActions>()(
  immer((set, get) => ({
    // State
    entities: {},
    ids: [],
    loading: false,
    error: null,

    // Actions
    setModels: (models) =>
      set((state) => {
        state.entities = {};
        state.ids = [];
        models.forEach((model) => {
          state.entities[model.id] = model;
          state.ids.push(model.id);
        });
        state.loading = false;
        state.error = null;
      }),

    updateModelStatus: (id, status) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].status = status;
        }
      }),

    updateModelUsage: (id, usage) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].usage = {
            ...state.entities[id].usage,
            ...usage,
          } as Model['usage'];
        }
      }),

    updateModelPerformance: (id, performance) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].performance = {
            ...state.entities[id].performance,
            ...performance,
          } as Model['performance'];
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
    getModelById: (id) => get().entities[id],
    getModelsArray: () => Object.values(get().entities),
    getActiveModels: () => Object.values(get().entities).filter(model => model.status === 'active'),
    getModelsByType: (type) => Object.values(get().entities).filter(model => model.type === type),
    getModelsByProvider: (provider) => Object.values(get().entities).filter(model => model.provider === provider),
  }))
);