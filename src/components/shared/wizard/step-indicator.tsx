'use client';

import { StepInfo } from '@/types/wizard-components.types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: StepInfo[];  // Now uses StepInfo which doesn't have component
  currentStepIndex: number;
  visitedSteps: string[];
  onStepClick?: (index: number) => void;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStepIndex,
  visitedSteps,
  onStepClick,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isVisited = visitedSteps.includes(step.id);
          const isClickable = isVisited && onStepClick;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  isActive && 'ring-2 ring-primary ring-offset-2',
                  isClickable && 'cursor-pointer',
                  !isClickable && 'cursor-default'
                )}
              >
                <div
                  className={cn(
                    'w-full h-full rounded-full flex items-center justify-center transition-colors duration-200',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && !isActive && 'bg-primary/80 text-primary-foreground',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground',
                    isClickable && !isActive && 'hover:bg-primary/20'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
              </button>

              {/* Step Label */}
              <div className="ml-3 flex-1">
                <p
                  className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    isActive && 'text-foreground',
                    !isActive && isVisited && 'text-muted-foreground',
                    !isActive && !isVisited && 'text-muted-foreground/50'
                  )}
                >
                  {step.title}
                </p>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      'h-0.5 w-full transition-colors duration-300',
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}