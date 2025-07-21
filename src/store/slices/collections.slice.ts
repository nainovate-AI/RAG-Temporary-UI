import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface DocumentCollection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  totalChunks: number;
  totalSize: number;
  embeddingModel: {
    id: string;
    name: string;
    provider: string;
    dimensions: number;
  };
  vectorStore: {
    type: string;
    collectionName: string;
    namespace?: string;
  };
  chunkingConfig: {
    strategy: 'recursive' | 'fixed' | 'semantic';
    chunkSize: number;
    chunkOverlap: number;
  };
  status: 'processing' | 'ready' | 'error' | 'partial';
  progress?: {
    current: number;
    total: number;
    stage: string;
  };
  metadata: {
    tags: string[];
    category?: string;
    language?: string;
    accessLevel?: 'public' | 'private' | 'restricted';
  };
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
  error?: string;
}

interface CollectionsState {
  entities: Record<string, DocumentCollection>;
  ids: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
};

// Async thunks will be added later for API calls
// For now, we'll use synchronous actions with JSON file operations

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections: (state, action: PayloadAction<DocumentCollection[]>) => {
      state.entities = {};
      state.ids = [];
      action.payload.forEach(collection => {
        state.entities[collection.id] = collection;
        state.ids.push(collection.id);
      });
      state.loading = false;
      state.error = null;
    },
    addCollection: (state, action: PayloadAction<Omit<DocumentCollection, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const id = `coll_${uuidv4()}`;
      const now = new Date().toISOString();
      const newCollection: DocumentCollection = {
        ...action.payload,
        id,
        createdAt: now,
        updatedAt: now,
      };
      state.entities[id] = newCollection;
      state.ids.push(id);
    },
    updateCollection: (state, action: PayloadAction<{ id: string; updates: Partial<DocumentCollection> }>) => {
      const { id, updates } = action.payload;
      if (state.entities[id]) {
        state.entities[id] = {
          ...state.entities[id],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteCollection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter(i => i !== id);
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
  setCollections,
  addCollection,
  updateCollection,
  deleteCollection,
  setLoading,
  setError,
} = collectionsSlice.actions;

export default collectionsSlice.reducer;