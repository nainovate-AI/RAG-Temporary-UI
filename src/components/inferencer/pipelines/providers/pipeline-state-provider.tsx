'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addPipeline } from '@/store/slices/pipelines.slice';
import { addJob } from '@/store/slices/jobs.slice';
import { dataService } from '@/services/data.service';

interface PipelineFormData {
  basicInfo?: {
    name: string;
    description: string;
    type: 'rag' | 'llm';
    useCase: string;
    tags: string[];
  };
  collections?: string[]; // Collection IDs
  retrieval?: {
    searchMethod: 'vector' | 'hybrid' | 'keyword';
    topK: number;
    scoreThreshold?: number;
    hybridAlpha?: number;
    reranker?: {
      enabled: boolean;
      model?: string;
      topN?: number;
    };
  };
  memory?: {
    type: 'buffer' | 'summary' | 'kg';
    windowSize?: number;
    storageBackend?: string;
    ttl?: number;
  };
  mcp?: {
    enabled: boolean;
    servers: Array<{
      id: string;
      name: string;
      type: string;
    }>;
  };
  llm?: {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
    userPromptTemplate: string;
    streaming: boolean;
  };
}

interface PipelineState {
  formData: PipelineFormData;
  pipelineType: 'rag' | 'llm';
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;
}

type PipelineAction =
  | { type: 'SET_PIPELINE_TYPE'; pipelineType: 'rag' | 'llm' }
  | { type: 'SET_STEP_DATA'; step: string; data: any }
  | { type: 'SET_CURRENT_STEP'; step: number }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };

interface PipelineContextType {
  state: PipelineState;
  setPipelineType: (type: 'rag' | 'llm') => void;
  updateStepData: (step: string, data: any) => void;
  setCurrentStep: (step: number) => void;
  submitPipeline: () => Promise<void>;
  reset: () => void;
}

const PipelineContext = createContext<PipelineContextType | null>(null);

function pipelineReducer(state: PipelineState, action: PipelineAction): PipelineState {
  switch (action.type) {
    case 'SET_PIPELINE_TYPE':
      return {
        ...state,
        pipelineType: action.pipelineType,
        formData: {
          ...state.formData,
          basicInfo: {
            ...state.formData.basicInfo,
            type: action.pipelineType,
          } as any,
        },
      };
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
        pipelineType: 'rag',
        currentStep: 0,
        isSubmitting: false,
        error: null,
      };
    default:
      return state;
  }
}

export function PipelineStateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [state, localDispatch] = useReducer(pipelineReducer, {
    formData: {},
    pipelineType: 'rag',
    currentStep: 0,
    isSubmitting: false,
    error: null,
  });

  const setPipelineType = useCallback((type: 'rag' | 'llm') => {
    localDispatch({ type: 'SET_PIPELINE_TYPE', pipelineType: type });
  }, []);

  const updateStepData = useCallback((step: string, data: any) => {
    localDispatch({ type: 'SET_STEP_DATA', step, data });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    localDispatch({ type: 'SET_CURRENT_STEP', step });
  }, []);

  const submitPipeline = useCallback(async () => {
    localDispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    localDispatch({ type: 'SET_ERROR', error: null });

    try {
      // Create pipeline
      const pipelineData = {
        name: state.formData.basicInfo?.name || '',
        description: state.formData.basicInfo?.description || '',
        type: state.pipelineType,
        module: 'pipeline' as const,
        status: 'draft',
        state: 'configuring',
        stateDetails: {
          message: 'Setting up pipeline configuration',
          lastStateChange: new Date().toISOString(),
        },
        config: {
          basic: state.formData.basicInfo,
          collections: state.formData.collections || [],
          retrieval: state.formData.retrieval,
          memory: state.formData.memory,
          mcp: state.formData.mcp,
          llm: state.formData.llm,
        },
      };

      const { data: pipeline, error } = await dataService.createPipeline(pipelineData);
      
      if (error || !pipeline) {
        throw new Error(error || 'Failed to create pipeline');
      }

      // Add to Redux store
      dispatch(addPipeline(pipeline));

      // Create deployment job
      const jobData = {
        type: 'pipeline_deployment' as const,
        module: 'pipeline' as const,
        targetId: pipeline.id,
        status: 'processing',
        state: 'deploying',
        stateDetails: {
          message: 'Deploying pipeline resources',
          startedAt: new Date().toISOString(),
        },
        config: {
          pipelineType: state.pipelineType,
        },
      };

      const { data: job, error: jobError } = await dataService.createJob(jobData);
      
      if (jobError || !job) {
        throw new Error(jobError || 'Failed to create deployment job');
      }

      // Add to Redux store
      dispatch(addJob(job));

      // Navigate to pipeline details page
      router.push(`/inferencer/pipelines/${pipeline.id}`);
      
    } catch (error) {
      console.error('Pipeline creation error:', error);
      localDispatch({ 
        type: 'SET_ERROR', 
        error: error instanceof Error ? error.message : 'Failed to create pipeline' 
      });
    } finally {
      localDispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [state.formData, state.pipelineType, dispatch, router]);

  const reset = useCallback(() => {
    localDispatch({ type: 'RESET' });
  }, []);

  const value: PipelineContextType = {
    state,
    setPipelineType,
    updateStepData,
    setCurrentStep,
    submitPipeline,
    reset,
  };

  return (
    <PipelineContext.Provider value={value}>
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipelineState() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipelineState must be used within PipelineStateProvider');
  }
  return context;
}