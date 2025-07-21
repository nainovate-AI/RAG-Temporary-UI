'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCollections } from '@/store/slices/collections.slice';
import { setPipelines } from '@/store/slices/pipelines.slice';
import { setModels } from '@/store/slices/models.slice';
import { setEmbeddings } from '@/store/slices/embeddings.slice';
import { setVectorStores } from '@/store/slices/vector-stores.slice';
import { setJobs } from '@/store/slices/jobs.slice';
import { dataService } from '@/services/data.service';

interface AppStateProviderProps {
  children: React.ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load initial data when app mounts
    const loadInitialData = async () => {
      try {
        // Load collections
        const collectionsResponse = await dataService.getCollections();
        if (collectionsResponse.data) {
          dispatch(setCollections(collectionsResponse.data.collections));
        }

        // Load pipelines
        const pipelinesResponse = await dataService.getPipelines();
        if (pipelinesResponse.data) {
          dispatch(setPipelines(pipelinesResponse.data.pipelines));
        }

        // Load models
        const modelsResponse = await dataService.getModels();
        if (modelsResponse.data) {
          dispatch(setModels(modelsResponse.data.models));
        }

        // Load embeddings
        const embeddingsResponse = await dataService.getEmbeddings();
        if (embeddingsResponse.data) {
          dispatch(setEmbeddings(embeddingsResponse.data.embeddings));
        }

        // Load vector stores
        const vectorStoresResponse = await dataService.getVectorStores();
        if (vectorStoresResponse.data) {
          dispatch(setVectorStores(vectorStoresResponse.data.vectorStores));
        }

        // Load active jobs
        const jobsResponse = await dataService.getJobs();
        if (jobsResponse.data) {
          dispatch(setJobs(jobsResponse.data.jobs));
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [dispatch]);

  return <>{children}</>;
}