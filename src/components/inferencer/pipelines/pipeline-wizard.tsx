'use client';

import { useMemo } from 'react';
import { useModuleFlow } from '@/hooks/useModuleService';
import { WizardContainer } from '@/components/shared/wizard';
import { usePipelineState } from './providers/pipeline-state-provider';
import { useRouter } from 'next/navigation';

// Import step components
import { BasicInfoStep } from './steps/BasicInfoStep';
import { CollectionsStep } from './steps/CollectionsStep';
import { RetrievalConfigStep } from './steps/RetrievalConfigStep';
import { MemoryStep } from './steps/MemoryStep';
import { MCPStep } from './steps/MCPStep';
import { LLMConfigStep } from './steps/LLMConfigStep';
import { ReviewDeployStep } from './steps/ReviewDeployStep';

// Map component names to actual components
const stepComponents = {
  BasicInfoStep,
  CollectionsStep,
  RetrievalConfigStep,
  MemoryStep,
  MCPStep,
  LLMConfigStep,
  ReviewDeployStep,
};

export function PipelineWizard() {
  const router = useRouter();
  const { state, submitPipeline, setPipelineType } = usePipelineState();
  
  // Get steps based on pipeline type
  const steps = useModuleFlow('pipeline', state.pipelineType);

  // Map steps to include actual components
  const stepsWithComponents = useMemo(() => {
    return steps.map(step => ({
      id: step.id,
      title: step.title,
      description: step.description,
      enabled: step.enabled,
      required: step.required,
      order: step.order,
      component: stepComponents[step.component as keyof typeof stepComponents] || (() => <div>Component not found</div>),
    }));
  }, [steps]);

  const handleComplete = async (formData: any) => {
    console.log('PipelineWizard - handleComplete called with:', formData);
    try {
      await submitPipeline();
      console.log('PipelineWizard - submitPipeline completed');
    } catch (error) {
      console.error('PipelineWizard - Error:', error);
    }
  };

  const handleStepChange = (stepIndex: number, stepId: string) => {
    console.log(`Step changed to: ${stepId} (index: ${stepIndex})`);
    
    // If moving to basic-info step and pipeline type changed, update it
    if (stepId === 'basic-info' && state.formData.basicInfo?.type) {
      setPipelineType(state.formData.basicInfo.type);
    }
  };

  return (
    <WizardContainer
      steps={stepsWithComponents}
      initialData={state.formData}
      onComplete={handleComplete}
      onStepChange={handleStepChange}
      className="max-w-4xl mx-auto"
    />
  );
}