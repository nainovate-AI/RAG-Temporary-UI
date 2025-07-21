'use client';

import { useMemo } from 'react';
import { useModuleFlow } from '@/hooks/useModuleService';
import { WizardContainer } from '@/components/shared/wizard';
import { useIngestState } from './providers/ingest-state-provider';
import { useRouter } from 'next/navigation';

// Import step components
import { CollectionInfoStep } from './steps/collection-info-step';
import { DocumentUploadStep } from './steps/document-upload-step';
import { ProcessingStep } from './steps/processing-step';
import { EmbeddingStep } from './steps/embedding-step';
import { VectorStoreStep } from './steps/vector-store-step';
import { ReviewStep } from './steps/review-step';

// Map component names to actual components
const stepComponents = {
  CollectionInfoStep,
  DocumentUploadStep,
  ProcessingStep,
  EmbeddingStep,
  VectorStoreStep,
  ReviewStep,
};

export function IngestWizard() {
  const router = useRouter();
  const steps = useModuleFlow('ingest', 'document');
  const { state, submitIngestion } = useIngestState();

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
    await submitIngestion();
  };

  const handleStepChange = (stepIndex: number, stepId: string) => {
    // You can add analytics or other side effects here
    console.log(`Step changed to: ${stepId} (index: ${stepIndex})`);
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