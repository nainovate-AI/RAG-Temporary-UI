import { WizardStepProps } from './wizard.types';

// This is specifically for wizard components that need actual React components
export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<WizardStepProps>;
  enabled: boolean;
  required: boolean;
  order: number;
}

// For display-only components that just need step info
export interface StepInfo {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
  required: boolean;
  order: number;
}