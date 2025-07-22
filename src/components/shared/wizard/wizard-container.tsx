'use client';

import { useReducer, useCallback } from 'react';
import { WizardState, WizardAction, ValidationResult, WizardStepProps } from '@/types/wizard.types';
import { WizardStep } from '@/types/wizard-components.types';
import { StepIndicator } from './step-indicator';
import { WizardNavigation } from './wizard-navigation';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WizardContainerProps {
  steps: WizardStep[];
  initialData?: Record<string, any>;
  onComplete: (data: any) => Promise<void>;
  onStepChange?: (stepIndex: number, stepId: string) => void;
  className?: string;
}


function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.stepId]: action.data,
        },
      };
    
    case 'SET_STEP_ERRORS':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.stepId]: action.errors,
        },
      };
    
    case 'NEXT_STEP':
      return {
        ...state,
        currentStepIndex: Math.min(state.currentStepIndex + 1, state.visited.length),
      };
    
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
      };
    
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStepIndex: action.index,
      };
    
    case 'MARK_VISITED':
      if (state.visited.includes(action.stepId)) {
        return state;
      }
      return {
        ...state,
        visited: [...state.visited, action.stepId],
      };
    
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    
    case 'RESET':
      return {
        currentStepIndex: 0,
        formData: {},
        errors: {},
        visited: [],
        isSubmitting: false,
      };
    
    default:
      return state;
  }
}

export function WizardContainer({
  steps,
  initialData = {},
  onComplete,
  onStepChange,
  className,
}: WizardContainerProps) {
  const initialState: WizardState = {
    currentStepIndex: 0,
    formData: initialData,
    errors: {},
    visited: [steps[0]?.id].filter(Boolean),
    isSubmitting: false,
  };

  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const currentStep = steps[state.currentStepIndex];
  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === steps.length - 1;

  // Mark step as visited when changing steps
  const handleStepChange = useCallback((index: number) => {
    const step = steps[index];
    if (step) {
      dispatch({ type: 'MARK_VISITED', stepId: step.id });
      dispatch({ type: 'GO_TO_STEP', index });
      onStepChange?.(index, step.id);
    }
  }, [steps, onStepChange]);

  // Handle step data changes
  const handleDataChange = useCallback((data: any) => {
    if (currentStep) {
      dispatch({ type: 'SET_STEP_DATA', stepId: currentStep.id, data });
    }
  }, [currentStep]);

  // Validate current step
  const validateCurrentStep = useCallback((): ValidationResult => {
    if (!currentStep) {
      return { isValid: false };
    }

    const stepData = state.formData[currentStep.id];

    // Check for step-specific validation flag
    if (stepData && '_isValid' in stepData) {
      return { isValid: stepData._isValid };
    }

    // Original validation logic for other steps
    if (currentStep.required && (!stepData || Object.keys(stepData).length === 0)) {
      return {
        isValid: false,
        errors: { general: 'Please complete all required fields' },
      };
    }

    return { isValid: true };
  }, [currentStep, state.formData]);

  // Handle next step
  const handleNext = useCallback(async () => {
    const validation = validateCurrentStep();
    
    if (!validation.isValid) {
      dispatch({
        type: 'SET_STEP_ERRORS',
        stepId: currentStep.id,
        errors: validation.errors || {},
      });
      return;
    }

    // Clear errors for current step
    dispatch({
      type: 'SET_STEP_ERRORS',
      stepId: currentStep.id,
      errors: {},
    });

    if (isLastStep) {
      // Handle completion
      console.log('Wizard - Calling onComplete with data:', state.formData);
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
      try {
        await onComplete(state.formData);
        console.log('Wizard - onComplete finished');
      } catch (error) {
        console.error('Error completing wizard:', error);
      } finally {
        dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
      }
    } else {
      // Move to next step
      const nextIndex = state.currentStepIndex + 1;
      const nextStep = steps[nextIndex];
      if (nextStep) {
        dispatch({ type: 'MARK_VISITED', stepId: nextStep.id });
        dispatch({ type: 'NEXT_STEP' });
        onStepChange?.(nextIndex, nextStep.id);
      }
    }
  }, [currentStep, isLastStep, onComplete, state.formData, validateCurrentStep, steps, state.currentStepIndex, onStepChange]);

  // Handle previous step
  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      dispatch({ type: 'PREVIOUS_STEP' });
      const prevIndex = state.currentStepIndex - 1;
      const prevStep = steps[prevIndex];
      if (prevStep) {
        onStepChange?.(prevIndex, prevStep.id);
      }
    }
  }, [isFirstStep, state.currentStepIndex, steps, onStepChange]);

  
  if (!currentStep) {
    return <div>No steps configured</div>;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Step Indicator - pass only the info it needs */}
      <StepIndicator
        steps={steps.map(({ id, title, description, enabled, required, order }) => ({
          id,
          title,
          description,
          enabled,
          required,
          order
        }))}
        currentStepIndex={state.currentStepIndex}
        visitedSteps={state.visited}
        onStepClick={(index) => {
          const step = steps[index];
          if (step && state.visited.includes(step.id)) {
            handleStepChange(index);
          }
        }}
      />

      {/* Step Content */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{currentStep.title}</h2>
          {currentStep.description && (
            <p className="text-muted-foreground mt-2">{currentStep.description}</p>
          )}
        </div>

        {currentStep && (() => {
          const StepComponent = currentStep.component;
          return (
            <StepComponent
              data={state.formData[currentStep.id] || {}}
              onChange={handleDataChange}
              onNext={handleNext}
              onBack={handleBack}
              errors={state.errors[currentStep.id]}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
            />
          );
        })()}
      </Card>

      {/* Navigation */}
      <WizardNavigation
        onNext={handleNext}
        onBack={handleBack}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={state.isSubmitting}
        canProceed={validateCurrentStep().isValid}
      />
    </div>
  );
}