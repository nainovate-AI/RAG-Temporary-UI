import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VectorStore {
  id: string;
  name: string;
  description: string;
  features: string[];
  cloudOption: boolean;
  selfHosted: boolean;
  recommended?: boolean;
  icon: string;
  status: 'active' | 'inactive';
}

interface VectorStoresState {
  entities: Record<string, VectorStore>;
  ids: string[];
  loading: boolean;
  error: string | null;
}

const initialState: VectorStoresState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

const vectorStoresSlice = createSlice({
  name: 'vectorStores',
  initialState,
  reducers: {
    setVectorStores: (state, action: PayloadAction<VectorStore[]>) => {
      state.entities = {};
      state.ids = [];
      action.payload.forEach(store => {
        state.entities[store.id] = store;
        state.ids.push(store.id);
      });
      state.loading = false;
      state.error = null;
    },
    updateVectorStoreStatus: (state, action: PayloadAction<{ id: string; status: 'active' | 'inactive' }>) => {
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

export const { setVectorStores, updateVectorStoreStatus, setLoading, setError } = vectorStoresSlice.actions;
export default vectorStoresSlice.reducer;