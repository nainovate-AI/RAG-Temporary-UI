// src/stores/utils/selectors.ts
import { useMemo } from 'react';
import { 
  useCollectionsStore, 
  usePipelinesStore, 
  useJobsStore,
  useModelsStore,
  useEmbeddingsStore,
  useVectorStoresStore,
  useUserStore
} from '../index';

// ✅ Fixed Collections selectors with proper memoization
export const useActiveCollections = () => {
  const entities = useCollectionsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(collection => collection.status === 'ready'),
    [entities]
  );
};

export const useCollectionsByStatus = (status: string) => {
  const entities = useCollectionsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(collection => collection.status === status),
    [entities, status]
  );
};

export const useCollectionsByTag = (tag: string) => {
  const entities = useCollectionsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(collection => 
      collection.metadata.tags.includes(tag)
    ),
    [entities, tag]
  );
};

export const useCollectionsByAccessLevel = (accessLevel: 'public' | 'private' | 'restricted') => {
  const entities = useCollectionsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(collection => 
      collection.metadata.accessLevel === accessLevel
    ),
    [entities, accessLevel]
  );
};

export const useProcessingCollections = () => {
  const entities = useCollectionsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(collection => collection.status === 'processing'),
    [entities]
  );
};

// ✅ Fixed Pipelines selectors
export const usePipelinesByType = (type: 'rag' | 'llm') => {
  const entities = usePipelinesStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(pipeline => pipeline.type === type),
    [entities, type]
  );
};

export const useActivePipelines = () => {
  const entities = usePipelinesStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(pipeline => pipeline.status === 'active'),
    [entities]
  );
};

export const useRagPipelines = () => {
  const entities = usePipelinesStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(pipeline => pipeline.type === 'rag'),
    [entities]
  );
};

export const useLlmPipelines = () => {
  const entities = usePipelinesStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(pipeline => pipeline.type === 'llm'),
    [entities]
  );
};

export const usePipelinesByStatus = (status: string) => {
  const entities = usePipelinesStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(pipeline => pipeline.status === status),
    [entities, status]
  );
};

// ✅ Fixed Jobs selectors
export const useActiveJobs = () => {
  const { activeJobs, entities } = useJobsStore((state) => ({ 
    activeJobs: state.activeJobs, 
    entities: state.entities 
  }));
  return useMemo(() => 
    activeJobs.map(id => entities[id]).filter(Boolean),
    [activeJobs, entities]
  );
};

export const useJobsByTarget = (targetId: string) => {
  const entities = useJobsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(job => job.targetId === targetId),
    [entities, targetId]
  );
};

export const useRunningJobs = () => {
  const entities = useJobsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(job => job.status === 'processing'),
    [entities]
  );
};

export const useCompletedJobs = () => {
  const entities = useJobsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(job => job.status === 'completed'),
    [entities]
  );
};

export const useFailedJobs = () => {
  const entities = useJobsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(job => job.status === 'failed'),
    [entities]
  );
};

export const useIngestionJobs = () => {
  const entities = useJobsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(job => job.type === 'ingestion'),
    [entities]
  );
};

export const usePipelineDeploymentJobs = () => {
  const entities = useJobsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(job => job.type === 'pipeline_deployment'),
    [entities]
  );
};

// ✅ Fixed Models selectors
export const useLocalModels = () => {
  const entities = useModelsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(model => model.type === 'local'),
    [entities]
  );
};

export const useCloudModels = () => {
  const entities = useModelsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(model => model.type === 'cloud'),
    [entities]
  );
};

export const useActiveModels = () => {
  const entities = useModelsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(model => model.status === 'active'),
    [entities]
  );
};

export const useModelsByProvider = (provider: string) => {
  const entities = useModelsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(model => model.provider === provider),
    [entities, provider]
  );
};

export const useModelsByFeature = (feature: string) => {
  const entities = useModelsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(model => 
      model.features?.includes(feature)
    ),
    [entities, feature]
  );
};

// ✅ Fixed Embeddings selectors
export const useLocalEmbeddings = () => {
  const entities = useEmbeddingsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(embedding => embedding.type === 'local'),
    [entities]
  );
};

export const useCloudEmbeddings = () => {
  const entities = useEmbeddingsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(embedding => embedding.type === 'cloud'),
    [entities]
  );
};

export const useActiveEmbeddings = () => {
  const entities = useEmbeddingsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(embedding => embedding.status === 'active'),
    [entities]
  );
};

export const useEmbeddingsByProvider = (provider: string) => {
  const entities = useEmbeddingsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(embedding => embedding.provider === provider),
    [entities, provider]
  );
};

export const useEmbeddingsByDimensions = (dimensions: number) => {
  const entities = useEmbeddingsStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(embedding => embedding.dimensions === dimensions),
    [entities, dimensions]
  );
};

// ✅ Fixed Vector Stores selectors
export const useActiveVectorStores = () => {
  const entities = useVectorStoresStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(store => store.status === 'active'),
    [entities]
  );
};

export const useCloudVectorStores = () => {
  const entities = useVectorStoresStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(store => store.cloudOption),
    [entities]
  );
};

export const useSelfHostedVectorStores = () => {
  const entities = useVectorStoresStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(store => store.selfHosted),
    [entities]
  );
};

export const useRecommendedVectorStores = () => {
  const entities = useVectorStoresStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(store => store.recommended),
    [entities]
  );
};

export const useConnectedVectorStores = () => {
  const entities = useVectorStoresStore((state) => state.entities);
  return useMemo(() => 
    Object.values(entities).filter(store => store.connectionStatus === 'connected'),
    [entities]
  );
};

// User selectors (these are fine as they return primitives)
export const useUserPreferences = () =>
  useUserStore((state) => state.preferences);

export const useRecentPipelines = () =>
  useUserStore((state) => state.recentActivity.pipelines);

export const useRecentCollections = () =>
  useUserStore((state) => state.recentActivity.collections);

export const useTheme = () =>
  useUserStore((state) => state.preferences.theme);

export const useSidebarState = () =>
  useUserStore((state) => state.preferences.sidebarCollapsed);

// ✅ Fixed Combined selectors
export const useStoreStats = () => {
  const collectionsCount = useCollectionsStore((state) => state.ids.length);
  const pipelinesCount = usePipelinesStore((state) => state.ids.length);
  const activeJobsCount = useJobsStore((state) => state.activeJobs.length);
  const activeModelsCount = useModelsStore((state) => 
    Object.values(state.entities).filter(m => m.status === 'active').length
  );
  const activeEmbeddingsCount = useEmbeddingsStore((state) => 
    Object.values(state.entities).filter(e => e.status === 'active').length
  );
  const activeVectorStoresCount = useVectorStoresStore((state) => 
    Object.values(state.entities).filter(vs => vs.status === 'active').length
  );

  return useMemo(() => ({
    collections: collectionsCount,
    pipelines: pipelinesCount,
    activeJobs: activeJobsCount,
    activeModels: activeModelsCount,
    activeEmbeddings: activeEmbeddingsCount,
    activeVectorStores: activeVectorStoresCount,
  }), [collectionsCount, pipelinesCount, activeJobsCount, activeModelsCount, activeEmbeddingsCount, activeVectorStoresCount]);
};

export const useDashboardData = () => {
  const stats = useStoreStats();
  const activeJobs = useActiveJobs();
  const recentCollections = useRecentCollections();
  const recentPipelines = useRecentPipelines();
  const failedJobs = useFailedJobs();

  return useMemo(() => ({
    stats,
    activeJobs,
    recentCollections,
    recentPipelines,
    failedJobs,
    hasActiveWork: activeJobs.length > 0,
    hasErrors: failedJobs.length > 0,
  }), [stats, activeJobs, recentCollections, recentPipelines, failedJobs]);
};

export const useSystemHealth = () => {
  const localModels = useLocalModels();
  const localEmbeddings = useLocalEmbeddings();
  const connectedVectorStores = useConnectedVectorStores();
  const activeJobs = useActiveJobs();

  return useMemo(() => {
    const localModelsRunning = localModels.filter(m => m.status === 'active').length;
    const localEmbeddingsRunning = localEmbeddings.filter(e => e.status === 'active').length;
    const vectorStoresConnected = connectedVectorStores.length;
    const jobsRunning = activeJobs.length;

    return {
      models: {
        total: localModels.length,
        running: localModelsRunning,
        healthy: localModelsRunning > 0,
      },
      embeddings: {
        total: localEmbeddings.length,
        running: localEmbeddingsRunning,
        healthy: localEmbeddingsRunning > 0,
      },
      vectorStores: {
        total: useVectorStoresStore.getState().ids.length,
        connected: vectorStoresConnected,
        healthy: vectorStoresConnected > 0,
      },
      jobs: {
        running: jobsRunning,
        healthy: jobsRunning < 10,
      },
    };
  }, [localModels, localEmbeddings, connectedVectorStores, activeJobs]);
};