import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface VectorStore {
  id: string;
  name: string;
  description: string;
  features: string[];
  cloudOption: boolean;
  selfHosted: boolean;
  recommended?: boolean;
  icon: string;
  status: 'active' | 'inactive';
  connectionStatus?: 'connected' | 'disconnected' | 'error';
  config?: {
    url?: string;
    apiKey?: string;
    region?: string;
    namespace?: string;
  };
  metrics?: {
    collections: number;
    totalVectors: number;
    totalSize: number;
    avgQueryTime: number;
  };
}

interface VectorStoresState {
  entities: Record<string, VectorStore>;
  ids: string[];
  loading: boolean;
  error: string | null;
}

interface VectorStoresActions {
  setVectorStores: (vectorStores: VectorStore[]) => void;
  addVectorStore: (vectorStore: Omit<VectorStore, 'id'>) => void;
  updateVectorStore: (id: string, updates: Partial<VectorStore>) => void;
  updateVectorStoreStatus: (id: string, status: 'active' | 'inactive') => void;
  updateConnectionStatus: (id: string, status: 'connected' | 'disconnected' | 'error') => void;
  updateVectorStoreMetrics: (id: string, metrics: Partial<VectorStore['metrics']>) => void;
  deleteVectorStore: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getVectorStoreById: (id: string) => VectorStore | undefined;
  getVectorStoresArray: () => VectorStore[];
  getActiveVectorStores: () => VectorStore[];
  getCloudVectorStores: () => VectorStore[];
  getSelfHostedVectorStores: () => VectorStore[];
  getRecommendedVectorStores: () => VectorStore[];
  getConnectedVectorStores: () => VectorStore[];
}

export const useVectorStoresStore = create<VectorStoresState & VectorStoresActions>()(
  immer((set, get) => ({
    // State
    entities: {},
    ids: [],
    loading: false,
    error: null,

    // Actions
    setVectorStores: (vectorStores) =>
      set((state) => {
        state.entities = {};
        state.ids = [];
        vectorStores.forEach((store) => {
          state.entities[store.id] = store;
          state.ids.push(store.id);
        });
        state.loading = false;
        state.error = null;
      }),

    addVectorStore: (vectorStoreData) =>
      set((state) => {
        const id = `vs_${crypto.randomUUID()}`;
        const newVectorStore = {
          ...vectorStoreData,
          id,
        } as VectorStore;
        
        state.entities[id] = newVectorStore;
        state.ids.push(id);
      }),

    updateVectorStore: (id, updates) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id] = {
            ...state.entities[id],
            ...updates,
          };
        }
      }),

    updateVectorStoreStatus: (id, status) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].status = status;
        }
      }),

    updateConnectionStatus: (id, connectionStatus) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].connectionStatus = connectionStatus;
        }
      }),

    updateVectorStoreMetrics: (id, metrics) =>
      set((state) => {
        if (state.entities[id]) {
          state.entities[id].metrics = {
            ...state.entities[id].metrics,
            ...metrics,
          } as VectorStore['metrics'];
        }
      }),

    deleteVectorStore: (id) =>
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
    getVectorStoreById: (id) => get().entities[id],
    getVectorStoresArray: () => Object.values(get().entities),
    getActiveVectorStores: () => Object.values(get().entities).filter(store => store.status === 'active'),
    getCloudVectorStores: () => Object.values(get().entities).filter(store => store.cloudOption),
    getSelfHostedVectorStores: () => Object.values(get().entities).filter(store => store.selfHosted),
    getRecommendedVectorStores: () => Object.values(get().entities).filter(store => store.recommended),
    getConnectedVectorStores: () => Object.values(get().entities).filter(store => store.connectionStatus === 'connected'),
  }))
);