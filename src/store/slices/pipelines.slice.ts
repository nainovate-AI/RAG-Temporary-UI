import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface PipelineMetrics {
  totalQueries: number;
  avgLatency: number;
  successRate: number;
  costPerDay: number;
}

interface Pipeline {
  id: string;
  name: string;
  description?: string;  // Add this
  type: 'rag' | 'llm';
  module: 'pipeline';
  status: string;
  state: string;
  stateDetails: {
    message: string;
    lastStateChange: string;
  };
  config: any;
  metrics?: PipelineMetrics;  // Add this
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

const initialState: PipelinesState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  activeWizard: null,
};

const pipelinesSlice = createSlice({
  name: 'pipelines',
  initialState,
  reducers: {
    setPipelines: (state, action: PayloadAction<Pipeline[]>) => {
      state.entities = {};
      state.ids = [];
      action.payload.forEach(pipeline => {
        state.entities[pipeline.id] = pipeline;
        state.ids.push(pipeline.id);
      });
      state.loading = false;
      state.error = null;
    },
    addPipeline: (state, action: PayloadAction<Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const id = `pipe_${uuidv4()}`;
      const now = new Date().toISOString();
      const newPipeline: Pipeline = {
        ...action.payload,
        id,
        createdAt: now,
        updatedAt: now,
      };
      state.entities[id] = newPipeline;
      state.ids.push(id);
    },
    updatePipeline: (state, action: PayloadAction<{ id: string; updates: Partial<Pipeline> }>) => {
      const { id, updates } = action.payload;
      if (state.entities[id]) {
        state.entities[id] = {
          ...state.entities[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    updatePipelineStatus: (state, action: PayloadAction<{ id: string; status: string; state: string; message: string }>) => {
      const { id, status, state: stateKey, message } = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = status;
        state.entities[id].state = stateKey;
        state.entities[id].stateDetails = {
          message,
          lastStateChange: new Date().toISOString(),
        };
        state.entities[id].updatedAt = new Date().toISOString();
      }
    },
    deletePipeline: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter(i => i !== id);
    },
    setActiveWizard: (state, action: PayloadAction<PipelinesState['activeWizard']>) => {
      state.activeWizard = action.payload;
    },
    updateWizardStep: (state, action: PayloadAction<number>) => {
      if (state.activeWizard) {
        state.activeWizard.currentStep = action.payload;
      }
    },
    updateWizardData: (state, action: PayloadAction<{ stepId: string; data: any }>) => {
      if (state.activeWizard) {
        state.activeWizard.formData[action.payload.stepId] = action.payload.data;
      }
    },
    clearActiveWizard: (state) => {
      state.activeWizard = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPipelines,
  addPipeline,
  updatePipeline,
  updatePipelineStatus,
  deletePipeline,
  setActiveWizard,
  updateWizardStep,
  updateWizardData,
  clearActiveWizard,
  setLoading,
  setError,
} = pipelinesSlice.actions;

export default pipelinesSlice.reducer;