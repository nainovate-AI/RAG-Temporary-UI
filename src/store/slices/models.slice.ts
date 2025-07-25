// src/store/slices/models.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Model {
  id: string;
  provider: string;
  type: 'local' | 'cloud';  // NEW
  name: string;
  description: string;
  contextWindow: number;
  maxOutputTokens: number;  // NEW
  costPer1kTokens: {
    input: number;
    output: number;
  };
  features?: string[];  // NEW
  status: 'active' | 'inactive';  // NEW
  
  // For local models
  modelSize?: number;  // NEW
  quantization?: string;  // NEW
  requirements?: {     // NEW
    gpu: number;
    ram: number;
    cpu: number;
  };
  resourceUsage?: {    // NEW
    gpu: number;
    ram: number;
    cpu: number;
    cpuPercent: number;
  };
  performance?: {      // NEW
    tokensPerSec: number;
    avgLatency: number;
    uptime: string;
    requestsProcessed: number;
  };
  
  // For cloud models
  usage?: {           // NEW
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

const initialState: ModelsState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setModels: (state, action: PayloadAction<Model[]>) => {
      state.entities = {};
      state.ids = [];
      action.payload.forEach(model => {
        state.entities[model.id] = model;
        state.ids.push(model.id);
      });
      state.loading = false;
      state.error = null;
    },
    updateModelStatus: (state, action: PayloadAction<{ id: string; status: 'active' | 'inactive' }>) => {
      const { id, status } = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setModels, updateModelStatus, setLoading, setError } = modelsSlice.actions;
export default modelsSlice.reducer;