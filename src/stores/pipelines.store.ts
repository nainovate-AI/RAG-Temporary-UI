import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PipelineMetrics {
  totalQueries: number;
  avgLatency: number;
  successRate: number;
  costPerDay: number;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  type: 'rag' | 'llm';
  module: 'pipeline';
  status: string;
  state: string;
  stateDetails: {
    message: string;
    lastStateChange: string;
  };
  config: any;
  metrics?: PipelineMetrics;
  createdAt: string;
  updatedAt: string;
}

interface PipelinesState {
  entities: Record<string, Pipeline>;
  ids: string[];
  loading: boolean;
  error: string | null;
  activeWizard: {
    module: 'pipeline';
    flowType: 'rag' | 'llm';
    currentStep: number;
    formData: any;
    status: string;
    state: string;
  } | null;
}

interface PipelinesActions {
  setPipelines: (pipelines: Pipeline[]) => void;
  addPipeline: (pipeline: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void;
  updatePipelineStatus: (id: string, status: string, state: string, message: string) => void;
  deletePipeline: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveWizard: (wizard: PipelinesState['activeWizard']) => void;
  clearActiveWizard: () => void;
  getPipelineById: (id: string) => Pipeline | undefined;
  getPipelinesArray: () => Pipeline[];
}

export const usePipelinesStore = create<PipelinesState & PipelinesActions>()(
  immer((set, get) => ({
    // State
    entities: {},
    ids: [],
    loading: false,
    error: null,
    activeWizard: null,

    // Actions
    setPipelines: (pipelines) =>
      set((state) => {
        state.entities = {};
        state.ids = [];
        pipelines.forEach((pipeline) => {
          state.entities[pipeline.id] = pipeline;
          state.ids.push(pipeline.id);
        });
        state.loading = false;
        state.error = null;
      }),

    addPipeline: (pipelineData) =>
      set((state) => {
        const id = `pipe_${crypto.randomUUID()}`;
        const now = new Date().toISOString();
        const newPipeline = {
          ...pipelineData,
          id,
          createdAt: now,
          updatedAt: now,
        } as Pipeline;
        
        state.entities[id] = newPipeline;
        state.ids.push(id);
      }),

    updatePipeline: (id, updates) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id] = {
            ...state.entities[id],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
      }),

    updatePipelineStatus: (id, status, stateKey, message) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].status = status;
          state.entities[id].state = stateKey;
          state.entities[id].stateDetails = {
            message,
            lastStateChange: new Date().toISOString(),
          };
          state.entities[id].updatedAt = new Date().toISOString();
        }
      }),

    deletePipeline: (id) =>
      set((state) => {
        delete state.entities[id];
        state.ids = state.ids.filter((i) => i !== id);
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    setActiveWizard: (wizard) =>
      set((state) => {
        state.activeWizard = wizard;
      }),

    clearActiveWizard: () =>
      set((state) => {
        state.activeWizard = null;
      }),

    // Computed values
    getPipelineById: (id) => get().entities[id],
    getPipelinesArray: () => Object.values(get().entities),
  }))
);