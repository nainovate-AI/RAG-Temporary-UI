import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  defaultPipelineType: 'rag' | 'llm';
  defaultVectorStore: string;
  defaultEmbeddingModel: string;
  autoRefresh: boolean;
  refreshInterval: number;
  notificationsEnabled: boolean;
}

interface UserState {
  preferences: UserPreferences;
  recentActivity: {
    pipelines: string[];
    collections: string[];
  };
}

interface UserActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addRecentPipeline: (id: string) => void;
  addRecentCollection: (id: string) => void;
  clearRecentActivity: () => void;
  clearRecentPipelines: () => void;
  clearRecentCollections: () => void;
  setDefaultPipelineType: (type: 'rag' | 'llm') => void;
  setDefaultVectorStore: (store: string) => void;
  setDefaultEmbeddingModel: (model: string) => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    immer((set, get) => ({
      // State
      preferences: {
        theme: 'dark',
        sidebarCollapsed: false,
        defaultPipelineType: 'rag',
        defaultVectorStore: 'qdrant',
        defaultEmbeddingModel: 'text-embedding-ada-002',
        autoRefresh: true,
        refreshInterval: 5000,
        notificationsEnabled: true,
      },
      recentActivity: {
        pipelines: [],
        collections: [],
      },

      // Actions
      setTheme: (theme) =>
        set((state) => {
          state.preferences.theme = theme;
        }),

      toggleSidebar: () =>
        set((state) => {
          state.preferences.sidebarCollapsed = !state.preferences.sidebarCollapsed;
        }),

      setSidebarCollapsed: (collapsed) =>
        set((state) => {
          state.preferences.sidebarCollapsed = collapsed;
        }),

      updatePreferences: (newPreferences) =>
        set((state) => {
          state.preferences = { ...state.preferences, ...newPreferences };
        }),

      addRecentPipeline: (id) =>
        set((state) => {
          state.recentActivity.pipelines = [
            id,
            ...state.recentActivity.pipelines.filter((p) => p !== id),
          ].slice(0, 5);
        }),

      addRecentCollection: (id) =>
        set((state) => {
          state.recentActivity.collections = [
            id,
            ...state.recentActivity.collections.filter((c) => c !== id),
          ].slice(0, 5);
        }),

      clearRecentActivity: () =>
        set((state) => {
          state.recentActivity = { pipelines: [], collections: [] };
        }),

      clearRecentPipelines: () =>
        set((state) => {
          state.recentActivity.pipelines = [];
        }),

      clearRecentCollections: () =>
        set((state) => {
          state.recentActivity.collections = [];
        }),

      setDefaultPipelineType: (type) =>
        set((state) => {
          state.preferences.defaultPipelineType = type;
        }),

      setDefaultVectorStore: (store) =>
        set((state) => {
          state.preferences.defaultVectorStore = store;
        }),

      setDefaultEmbeddingModel: (model) =>
        set((state) => {
          state.preferences.defaultEmbeddingModel = model;
        }),
    })),
    {
      name: 'ragdp-user-storage',
      partialize: (state) => ({ 
        preferences: state.preferences, 
        recentActivity: state.recentActivity 
      }),
    }
  )
);