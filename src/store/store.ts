import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import slices (we'll create these next)
import collectionsReducer from './slices/collections.slice';
import pipelinesReducer from './slices/pipelines.slice';
import modelsReducer from './slices/models.slice';
import embeddingsReducer from './slices/embeddings.slice';
import jobsReducer from './slices/jobs.slice';
import userReducer from './slices/user.slice';
import vectorStoresReducer from './slices/vector-stores.slice';


// Combine reducers
const rootReducer = combineReducers({
  collections: collectionsReducer,
  pipelines: pipelinesReducer,
  models: modelsReducer,
  embeddings: embeddingsReducer,
  jobs: jobsReducer,
  user: userReducer,
  vectorStores: vectorStoresReducer,
});

// Persist configuration
const persistConfig = {
  key: 'ragdp-ui',
  version: 1,
  storage,
  whitelist: ['user'], // Only persist user preferences
  blacklist: ['jobs'] // Don't persist active jobs
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

