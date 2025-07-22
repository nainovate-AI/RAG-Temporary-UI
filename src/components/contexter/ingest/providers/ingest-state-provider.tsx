'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addCollection } from '@/store/slices/collections.slice';
import { addJob } from '@/store/slices/jobs.slice';
import { dataService } from '@/services/data.service';

interface IngestFormData {
  collectionInfo?: {
    name: string;
    description: string;
    tags: string[];
    accessLevel: 'public' | 'private' | 'restricted';
  };
  documents?: {
    files: File[];
    totalSize: number;
  };
  processing?: {
    strategy: 'recursive' | 'fixed' | 'semantic';
    chunkSize: number;
    chunkOverlap: number;
    preprocessing: string[];
  };
  embedding?: {
    model: string;
    provider: string;
  };
  vectorStore?: {
    type: string;
    connectionType: 'cloud' | 'local';
    collectionName: string;
    namespace?: string;
  };
}

interface IngestState {
  formData: IngestFormData;
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

type IngestAction =
  | { type: 'SET_STEP_DATA'; step: string; data: any }
  | { type: 'SET_CURRENT_STEP'; step: number }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };

interface IngestContextType {
  state: IngestState;
  updateStepData: (step: string, data: any) => void;
  setCurrentStep: (step: number) => void;
  submitIngestion: () => Promise<void>;
  reset: () => void;
}

const IngestContext = createContext<IngestContextType | null>(null);

function ingestReducer(state: IngestState, action: IngestAction): IngestState {
  switch (action.type) {
    case 'SET_STEP_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.step]: action.data,
        },
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.step,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };
    case 'RESET':
      return {
        formData: {},
        currentStep: 0,
        isSubmitting: false,
        error: null,
      };
    default:
      return state;
  }
}

export function IngestStateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [state, localDispatch] = useReducer(ingestReducer, {
    formData: {},
    currentStep: 0,
    isSubmitting: false,
    error: null,
  });

  const updateStepData = useCallback((step: string, data: any) => {
    localDispatch({ type: 'SET_STEP_DATA', step, data });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    localDispatch({ type: 'SET_CURRENT_STEP', step });
  }, []);

  const submitIngestion = useCallback(async () => {
    console.log('1. submitIngestion started');
    localDispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    localDispatch({ type: 'SET_ERROR', error: null });

    try {
      // Create collection
      console.log('2. Creating collection...');
      const collectionData = {
        ...state.formData.collectionInfo!,
        documentCount: state.formData.documents?.files.length || 0,
        totalChunks: 0, // Will be updated after processing
        totalSize: state.formData.documents?.totalSize || 0,
        embeddingModel: {
          id: state.formData.embedding?.model || '',
          name: state.formData.embedding?.model || '',
          provider: state.formData.embedding?.provider || '',
          dimensions: 1536, // Default, should come from model metadata
        },
        vectorStore: state.formData.vectorStore!,
        chunkingConfig: {
          strategy: state.formData.processing?.strategy || 'recursive',
          chunkSize: state.formData.processing?.chunkSize || 512,
          chunkOverlap: state.formData.processing?.chunkOverlap || 64,
        },
        status: 'processing' as const,
        metadata: {
          tags: state.formData.collectionInfo?.tags || [],
          accessLevel: state.formData.collectionInfo?.accessLevel || 'public',
        },
      };

      const { data: collection, error } = await dataService.createCollection(collectionData);
      
      if (error || !collection) {
        throw new Error(error || 'Failed to create collection');
      }

      // Add to Redux store
      dispatch(addCollection(collection));
      console.log('4. Added to Redux');

      // Create ingestion job
      console.log('5. Creating job...');
      const jobData = {
        type: 'ingestion' as const,
        module: 'ingest' as const,
        targetId: collection.id,
        status: 'processing',
        state: 'uploading',
        stateDetails: {
          message: 'Uploading documents',
          startedAt: new Date().toISOString(),
          progress: {
            current: 0,
            total: state.formData.documents?.files.length || 0,
          },
        },
        config: {
          processing: state.formData.processing,
          embedding: state.formData.embedding,
          vectorStore: state.formData.vectorStore,
        },
      };

      const { data: job, error: jobError } = await dataService.createJob(jobData);
      console.log('6. Job response:', { job, jobError });

      if (jobError || !job) {
        throw new Error(jobError || 'Failed to create job');
      }

      // Add to Redux store
      dispatch(addJob(job));
      console.log('7. Job added to Redux');
     
      // Navigate to job monitoring page
      console.log('8. Redirecting to:', `/jobs/${job.id}`);
      router.push(`/jobs/${job.id}`);
      console.log('9. Redirect called');
      
    } catch (error) {
      console.error('ERROR in submitIngestion:', error);
      localDispatch({ 
        type: 'SET_ERROR', 
        error: error instanceof Error ? error.message : 'Failed to start ingestion' 
      });
    } finally {
      console.log('10. Resetting submitting state');
      localDispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [state.formData, dispatch, router]);

  const reset = useCallback(() => {
    localDispatch({ type: 'RESET' });
  }, []);

  const value: IngestContextType = {
    state,
    updateStepData,
    setCurrentStep,
    submitIngestion,
    reset,
  };

  return (
    <IngestContext.Provider value={value}>
      {children}
    </IngestContext.Provider>
  );
}

export function useIngestState() {
  const context = useContext(IngestContext);
  if (!context) {
    throw new Error('useIngestState must be used within IngestStateProvider');
  }
  return context;
}