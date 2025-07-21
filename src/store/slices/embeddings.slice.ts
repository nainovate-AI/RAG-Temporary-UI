import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmbeddingModel {
  id: string;
  provider: string;
  name: string;
  description: string;
  dimensions: number;
  maxInputTokens: number;
  costPer1kTokens: number;
  status: 'active' | 'inactive';  // Add this
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