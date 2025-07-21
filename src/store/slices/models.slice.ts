import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Model {
  id: string;
  provider: string;
  name: string;
  description: string;
  contextWindow: number;
  costPer1kTokens: {
    input: number;
    output: number;
  };
  features: string[];
  status: 'available' | 'unavailable' | 'deprecated';
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setModels, setLoading, setError } = modelsSlice.actions;
export default modelsSlice.reducer;