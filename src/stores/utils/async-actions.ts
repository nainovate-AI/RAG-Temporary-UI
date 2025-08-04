import { dataService } from '@/services/data.service';
import { 
  useCollectionsStore, 
  usePipelinesStore, 
  useJobsStore,
  useModelsStore,
  useEmbeddingsStore,
  useVectorStoresStore 
} from '../index';

//types
type PipelineStatusUpdate = {
  id: string ; // adjust based on your actual pipelineId type
  status: string;       // or a union like 'pending' | 'success' | ...
  state: string;        // or a union like 'idle' | 'running' | ...
  message: string;
};

// Collections async actions
export const useCollectionsActions = () => {
  const { setCollections, setLoading, setError, addCollection, updateCollection } = useCollectionsStore();

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getCollections();
      if (response.data) {
        setCollections(response.data.collections);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (collectionData: any) => {
    try {
      const response = await dataService.createCollection(collectionData);
      if (response.data) {
        addCollection(response.data);
        return response.data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create collection');
      throw error;
    }
  };

  const refreshCollection = async (id: string) => {
    try {
      const response = await dataService.getCollection(id);
      if (response.data) {
        updateCollection(id, response.data);
        return response.data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to refresh collection');
      throw error;
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await dataService.deleteCollection(id);
      useCollectionsStore.getState().deleteCollection(id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete collection');
      throw error;
    }
  };

  return { 
    loadCollections, 
    createCollection, 
    refreshCollection, 
    deleteCollection 
  };
};

// Pipelines async actions
export const usePipelinesActions = () => {
  const { setPipelines, setLoading, setError, addPipeline, updatePipeline } = usePipelinesStore();

  const loadPipelines = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getPipelines();
      if (response.data) {
        setPipelines(response.data.pipelines);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load pipelines');
    } finally {
      setLoading(false);
    }
  };

  const createPipeline = async (pipelineData: any) => {
    try {
      const response = await dataService.createPipeline(pipelineData);
      if (response.data) {
        addPipeline(response.data);
        return response.data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create pipeline');
      throw error;
    }
  };
  

//   const deployPipeline = async (id: string) => {
//     try {
//       const response = await dataService.deployPipeline(id);
//       if (response.data) {
//         updatePipeline(id, { status: 'deploying', state: 'deploying' });
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to deploy pipeline');
//       throw error;
//     }
//   };

  const stopPipeline = async (data: PipelineStatusUpdate) => {
    try {
      const response = await dataService.updatePipeline(data.id, { status: data.status, state: data.state});
      if (response.data) {
        updatePipeline(data.id, { status: data.status, state: data.state });
        return response.data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to stop pipeline');
      throw error;
    }
  };

  const deletePipeline = async (id: string) => {
    try {
      await dataService.deletePipeline(id);
      usePipelinesStore.getState().deletePipeline(id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete pipeline');
      throw error;
    }
  };

  return { 
    loadPipelines, 
    createPipeline, 
    stopPipeline,
    // deployPipeline, 
    // stopPipeline, 
    deletePipeline 
  };
};

// Jobs async actions
export const useJobsActions = () => {
  const { setJobs, setLoading, setError, addJob, updateJob } = useJobsStore();

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getJobs();
      if (response.data) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: any) => {
    try {
      const response = await dataService.createJob(jobData);
      if (response.data) {
        addJob(response.data);
        return response.data;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create job');
      throw error;
    }
  };

  const pollJobStatus = async (jobId: string) => {
    try {
      const response = await dataService.getJob(jobId);
      if (response.data) {
        updateJob(jobId, response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to poll job status:', error);
    }
  };

//   const cancelJob = async (jobId: string) => {
//     try {
//       const response = await dataService.cancelJob(jobId);
//       if (response.data) {
//         updateJob(jobId, { status: 'cancelled', state: 'cancelled' });
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to cancel job');
//       throw error;
//     }
//   };

//   const retryJob = async (jobId: string) => {
//     try {
//       const response = await dataService.retryJob(jobId);
//       if (response.data) {
//         updateJob(jobId, { status: 'processing', state: 'retrying', error: undefined });
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to retry job');
//       throw error;
//     }
//   };

  return { 
    loadJobs, 
    createJob, 
    pollJobStatus, 
    // cancelJob, 
    // retryJob 
  };
};

// Models async actions
export const useModelsActions = () => {
  const { setModels, setLoading, setError, updateModelStatus } = useModelsStore();

  const loadModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getModels();
      if (response.data) {
        setModels(response.data.models);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load models');
    } finally {
      setLoading(false);
    }
  };

//   const activateModel = async (id: string) => {
//     try {
//       const response = await dataService.activateModel(id);
//       if (response.success) {
//         updateModelStatus(id, 'active');
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to activate model');
//       throw error;
//     }
//   };

//   const deactivateModel = async (id: string) => {
//     try {
//       const response = await dataService.deactivateModel(id);
//       if (response.success) {
//         updateModelStatus(id, 'inactive');
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to deactivate model');
//       throw error;
//     }
//   };

  return { 
    loadModels, 
    // activateModel, 
    // deactivateModel 
  };
};

// Embeddings async actions
export const useEmbeddingsActions = () => {
  const { setEmbeddings, setLoading, setError, updateEmbeddingStatus } = useEmbeddingsStore();

  const loadEmbeddings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getEmbeddings();
      if (response.data) {
        setEmbeddings(response.data.embeddings);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load embeddings');
    } finally {
      setLoading(false);
    }
  };

//   const activateEmbedding = async (id: string) => {
//     try {
//       const response = await dataService.activateEmbedding(id);
//       if (response.success) {
//         updateEmbeddingStatus(id, 'active');
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to activate embedding');
//       throw error;
//     }
//   };

//   const deactivateEmbedding = async (id: string) => {
//     try {
//       const response = await dataService.deactivateEmbedding(id);
//       if (response.success) {
//         updateEmbeddingStatus(id, 'inactive');
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to deactivate embedding');
//       throw error;
//     }
//   };

  return { 
    loadEmbeddings, 
    // activateEmbedding, 
    // deactivateEmbedding 
  };
};

// Vector Stores async actions
export const useVectorStoresActions = () => {
  const { setVectorStores, setLoading, setError, updateVectorStoreStatus, updateConnectionStatus } = useVectorStoresStore();

  const loadVectorStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getVectorStores();
      if (response.data) {
        setVectorStores(response.data.vectorStores);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load vector stores');
    } finally {
      setLoading(false);
    }
  };

//   const testConnection = async (id: string) => {
//     try {
//       updateConnectionStatus(id, 'disconnected'); // Show testing state
//       const response = await dataService.testVectorStoreConnection(id);
//       if (response.success) {
//         updateConnectionStatus(id, 'connected');
//         return response.data;
//       } else {
//         updateConnectionStatus(id, 'error');
//         throw new Error('Connection failed');
//       }
//     } catch (error) {
//       updateConnectionStatus(id, 'error');
//       setError(error instanceof Error ? error.message : 'Failed to test connection');
//       throw error;
//     }
//   };

//   const activateVectorStore = async (id: string) => {
//     try {
//       const response = await dataService.activateVectorStore(id);
//       if (response.success) {
//         updateVectorStoreStatus(id, 'active');
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to activate vector store');
//       throw error;
//     }
//   };

//   const deactivateVectorStore = async (id: string) => {
//     try {
//       const response = await dataService.deactivateVectorStore(id);
//       if (response.success) {
//         updateVectorStoreStatus(id, 'inactive');
//         return response.data;
//       }
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'Failed to deactivate vector store');
//       throw error;
//     }
//   };

  return { 
    loadVectorStores, 
    // testConnection, 
    // activateVectorStore, 
    // deactivateVectorStore 
  };
};

// Universal data loader
export const useDataLoader = () => {
  const { loadCollections } = useCollectionsActions();
  const { loadPipelines } = usePipelinesActions();
  const { loadJobs } = useJobsActions();
  const { loadModels } = useModelsActions();
  const { loadEmbeddings } = useEmbeddingsActions();
  const { loadVectorStores } = useVectorStoresActions();

  const loadAllData = async () => {
    try {
      // Load all data in parallel
      await Promise.all([
        loadCollections(),
        loadPipelines(),
        loadJobs(),
        loadModels(),
        loadEmbeddings(),
        loadVectorStores(),
      ]);
    } catch (error) {
      console.error('Failed to load all data:', error);
    }
  };

  const refreshAllData = async () => {
    await loadAllData();
  };

  return { 
    loadAllData, 
    refreshAllData,
    loadCollections,
    loadPipelines,
    loadJobs,
    loadModels,
    loadEmbeddings,
    loadVectorStores,
  };
};