import { useEffect, useCallback, useRef } from 'react';
import { 
  useJobsStore, 
  useUserStore,
  useCollectionsStore,
  usePipelinesStore,
  useModelsStore,
  useEmbeddingsStore,
  useVectorStoresStore
} from '../index';
import { useJobsActions } from './async-actions';

// Hook for syncing jobs with real-time updates
export const useJobsSync = (intervalMs?: number) => {
  const { getActiveJobsArray } = useJobsStore();
  const { pollJobStatus } = useJobsActions();
  const { autoRefresh, refreshInterval } = useUserStore((state) => state.preferences);
  
  const effectiveInterval = intervalMs || refreshInterval || 5000;
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!autoRefresh) return;

    const sync = () => {
      const activeJobs = getActiveJobsArray();
      if (activeJobs.length === 0) return;

      activeJobs.forEach(job => {
        pollJobStatus(job.id);
      });
    };

    // Initial sync
    sync();

    // Set up interval
    intervalRef.current = setInterval(sync, effectiveInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [effectiveInterval, autoRefresh, pollJobStatus]);

  // Manual sync function
  const syncNow = useCallback(() => {
    const activeJobs = getActiveJobsArray();
    activeJobs.forEach(job => {
      pollJobStatus(job.id);
    });
  }, [pollJobStatus]);

  return { syncNow };
};

// Hook for managing store loading states
export const useStoreLoading = () => {
  const collectionsLoading = useCollectionsStore((state) => state.loading);
  const pipelinesLoading = usePipelinesStore((state) => state.loading);
  const jobsLoading = useJobsStore((state) => state.loading);
  const modelsLoading = useModelsStore((state) => state.loading);
  const embeddingsLoading = useEmbeddingsStore((state) => state.loading);
  const vectorStoresLoading = useVectorStoresStore((state) => state.loading);

  return {
    collections: collectionsLoading,
    pipelines: pipelinesLoading,
    jobs: jobsLoading,
    models: modelsLoading,
    embeddings: embeddingsLoading,
    vectorStores: vectorStoresLoading,
    anyLoading: collectionsLoading || pipelinesLoading || jobsLoading || modelsLoading || embeddingsLoading || vectorStoresLoading,
  };
};

// Hook for managing store errors
export const useStoreErrors = () => {
  const collectionsError = useCollectionsStore((state) => state.error);
  const pipelinesError = usePipelinesStore((state) => state.error);
  const jobsError = useJobsStore((state) => state.error);
  const modelsError = useModelsStore((state) => state.error);
  const embeddingsError = useEmbeddingsStore((state) => state.error);
  const vectorStoresError = useVectorStoresStore((state) => state.error);

  const errors = [
    collectionsError,
    pipelinesError,
    jobsError,
    modelsError,
    embeddingsError,
    vectorStoresError,
  ].filter(Boolean);

  const clearAllErrors = useCallback(() => {
    useCollectionsStore.getState().setError(null);
    usePipelinesStore.getState().setError(null);
    useJobsStore.getState().setError(null);
    useModelsStore.getState().setError(null);
    useEmbeddingsStore.getState().setError(null);
    useVectorStoresStore.getState().setError(null);
  }, []);

  return {
    collections: collectionsError,
    pipelines: pipelinesError,
    jobs: jobsError,
    models: modelsError,
    embeddings: embeddingsError,
    vectorStores: vectorStoresError,
    hasErrors: errors.length > 0,
    allErrors: errors,
    clearAllErrors,
  };
};

// Hook for optimistic updates
export const useOptimisticUpdate = <T>(
  store: any,
  updateFn: (id: string, data: T) => void,
  revertFn: (id: string, originalData: T) => void
) => {
  const performOptimisticUpdate = useCallback(
    async (
      id: string,
      optimisticData: T,
      asyncOperation: () => Promise<T>
    ) => {
      const originalData = store.getState().entities[id];
      
      // Apply optimistic update
      updateFn(id, optimisticData);
      
      try {
        // Perform async operation
        const result = await asyncOperation();
        
        // Update with real data
        updateFn(id, result);
        
        return result;
      } catch (error) {
        // Revert on error
        revertFn(id, originalData);
        throw error;
      }
    },
    [store, updateFn, revertFn]
  );

  return performOptimisticUpdate;
};

// Hook for debounced store updates
export const useDebouncedStoreUpdate = <T>(
  updateFn: (data: T) => void,
  delay: number = 500
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedUpdate = useCallback(
    (data: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        updateFn(data);
      }, delay);
    },
    [updateFn, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedUpdate;
};

// Hook for store persistence status
export const usePersistenceStatus = () => {
  const saveToStorage = useCallback(() => {
    // Manually trigger persistence (useful for testing)
    const state = useUserStore.getState();
    localStorage.setItem('ragdp-user-storage', JSON.stringify({
      state: {
        preferences: state.preferences,
        recentActivity: state.recentActivity,
      },
      version: 0,
    }));
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem('ragdp-user-storage');
  }, []);

  const isHydrated = useCallback(() => {
    // Check if store has been hydrated from storage
    return typeof window !== 'undefined' && localStorage.getItem('ragdp-user-storage') !== null;
  }, []);

  return {
    saveToStorage,
    clearStorage,
    isHydrated: isHydrated(),
  };
};

// Hook for cross-store operations
export const useCrossStoreOperations = () => {
  const deleteCollectionWithJobs = useCallback(async (collectionId: string) => {
    // Delete related jobs first
    const jobs = useJobsStore.getState().getJobsByTarget(collectionId);
    jobs.forEach(job => {
      useJobsStore.getState().deleteJob(job.id);
    });
    
    // Then delete collection
    useCollectionsStore.getState().deleteCollection(collectionId);
  }, []);

  const deletePipelineWithJobs = useCallback(async (pipelineId: string) => {
    // Delete related jobs first
    const jobs = useJobsStore.getState().getJobsByTarget(pipelineId);
    jobs.forEach(job => {
      useJobsStore.getState().deleteJob(job.id);
    });
    
    // Then delete pipeline
    usePipelinesStore.getState().deletePipeline(pipelineId);
  }, []);

  const getCollectionPipelines = useCallback((collectionId: string) => {
    const pipelines = usePipelinesStore.getState().getPipelinesArray();
    return pipelines.filter(pipeline => 
      pipeline.config?.collections?.includes(collectionId)
    );
  }, []);

  return {
    deleteCollectionWithJobs,
    deletePipelineWithJobs,
    getCollectionPipelines,
  };
};

// Hook for store subscriptions
export const useStoreSubscription = <T>(
  store: any,
  selector: (state: any) => T,
  callback: (value: T, prevValue: T) => void
) => {
  useEffect(() => {
    const unsubscribe = store.subscribe(selector, callback);
    return unsubscribe;
  }, [store, selector, callback]);
};

// Hook for batch operations
export const useBatchOperations = () => {
  const batchUpdateCollections = useCallback((updates: Array<{ id: string; data: any }>) => {
    const { updateCollection } = useCollectionsStore.getState();
    updates.forEach(({ id, data }) => {
      updateCollection(id, data);
    });
  }, []);

  const batchUpdatePipelines = useCallback((updates: Array<{ id: string; data: any }>) => {
    const { updatePipeline } = usePipelinesStore.getState();
    updates.forEach(({ id, data }) => {
      updatePipeline(id, data);
    });
  }, []);

  const batchUpdateJobs = useCallback((updates: Array<{ id: string; data: any }>) => {
    const { updateJob } = useJobsStore.getState();
    updates.forEach(({ id, data }) => {
      updateJob(id, data);
    });
  }, []);

  return {
    batchUpdateCollections,
    batchUpdatePipelines,
    batchUpdateJobs,
  };
};