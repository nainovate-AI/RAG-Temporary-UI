import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

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

interface CollectionsActions {
  setCollections: (collections: DocumentCollection[]) => void;
  addCollection: (collection: Omit<DocumentCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<DocumentCollection>) => void;
  deleteCollection: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getCollectionById: (id: string) => DocumentCollection | undefined;
  getCollectionsArray: () => DocumentCollection[];
}

export const useCollectionsStore = create<CollectionsState & CollectionsActions>()(
  immer((set, get) => ({
    // State
    entities: {},
    ids: [],
    loading: false,
    error: null,

    // Actions
    setCollections: (collections) =>
      set((state) => {
        state.entities = {};
        state.ids = [];
        collections.forEach((collection) => {
          state.entities[collection.id] = collection;
          state.ids.push(collection.id);
        });
        state.loading = false;
        state.error = null;
      }),

    addCollection: (collectionData) =>
      set((state) => {
        const id = `coll_${crypto.randomUUID()}`;
        const now = new Date().toISOString();
        const newCollection = {
          ...collectionData,
          id,
          createdAt: now,
          updatedAt: now,
        } as DocumentCollection;
        
        state.entities[id] = newCollection;
        state.ids.push(id);
      }),

    updateCollection: (id, updates) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id] = {
            ...state.entities[id],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
      }),

    deleteCollection: (id) =>
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

    // Computed values
    getCollectionById: (id) => get().entities[id],
    getCollectionsArray: () => Object.values(get().entities),
  }))
);