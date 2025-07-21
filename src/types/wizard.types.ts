export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<WizardStepProps>;
  validation?: (data: any) => ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: Record<string, string>;
}

export interface WizardStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Record<string, string>;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export interface WizardState {
  currentStepIndex: number;
  formData: Record<string, any>;
  errors: Record<string, Record<string, string>>;
  visited: string[];
  isSubmitting: boolean;
}

export type WizardAction =
  | { type: 'SET_STEP_DATA'; stepId: string; data: any }
  | { type: 'SET_STEP_ERRORS'; stepId: string; errors: Record<string, string> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; index: number }
  | { type: 'MARK_VISITED'; stepId: string }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET' };