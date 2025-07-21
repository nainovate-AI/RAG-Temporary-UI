import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  defaultPipelineType: 'rag' | 'llm';
  defaultVectorStore: string;
  defaultEmbeddingModel: string;
}

interface UserState {
  preferences: UserPreferences;
  recentActivity: {
    pipelines: string[];
    collections: string[];
  };
}

const initialState: UserState = {
  preferences: {
    theme: 'dark',
    sidebarCollapsed: false,
    defaultPipelineType: 'rag',
    defaultVectorStore: 'qdrant',
    defaultEmbeddingModel: 'text-embedding-ada-002',
  },
  recentActivity: {
    pipelines: [],
    collections: [],
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.preferences.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.preferences.sidebarCollapsed = !state.preferences.sidebarCollapsed;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    addRecentPipeline: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.recentActivity.pipelines = [
        id,
        ...state.recentActivity.pipelines.filter(p => p !== id),
      ].slice(0, 5); // Keep only 5 recent items
    },
    addRecentCollection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.recentActivity.collections = [
        id,
        ...state.recentActivity.collections.filter(c => c !== id),
      ].slice(0, 5); // Keep only 5 recent items
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  updatePreferences,
  addRecentPipeline,
  addRecentCollection,
} = userSlice.actions;

export default userSlice.reducer;