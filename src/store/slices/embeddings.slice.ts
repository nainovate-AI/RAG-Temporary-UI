// src/store/slices/embeddings.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmbeddingModel {
  id: string;
  provider: string;
  type: 'local' | 'cloud';  // NEW
  name: string;
  description: string;
  dimensions: number;
  maxInputTokens: number;
  costPer1kTokens?: number;  // Make optional since local models don't have this
  status: 'active' | 'inactive';
  modelSize?: number;  // NEW - for local models
  requirements?: {     // NEW - for local models
    gpu: number;
    ram: number;
    cpu: number;
  };
  resourceUsage?: {    // NEW - for active local models
    gpu: number;
    ram: number;
    cpu: number;
    cpuPercent: number;
  };
  performance?: {      // NEW - for active models
    embeddingsPerSec: number;
    avgLatency: number;
    uptime: string;
  };
  usage?: {           // NEW - for cloud models
    embeddingsToday: number;
    costToday: number;
  };
  collections?: Array<{  // NEW
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

const initialState: EmbeddingsState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

const embeddingsSlice = createSlice({
  name: 'embeddings',
  initialState,
  reducers: {
    setEmbeddings: (state, action: PayloadAction<EmbeddingModel[]>) => {
      state.entities = {};
      state.ids = [];
      action.payload.forEach(model => {
        state.entities[model.id] = model;
        state.ids.push(model.id);
      });
      state.loading = false;
      state.error = null;
    },
    updateEmbeddingStatus: (state, action: PayloadAction<{ id: string; status: 'active' | 'inactive' }>) => {
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

export const { setEmbeddings, updateEmbeddingStatus, setLoading, setError } = embeddingsSlice.actions;
export default embeddingsSlice.reducer;