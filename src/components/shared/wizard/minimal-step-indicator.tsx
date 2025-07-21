'use client';

import { StepInfo } from '@/types/wizard-components.types';
import { cn } from '@/lib/utils';

interface MinimalStepIndicatorProps {
  steps: StepInfo[];  // Changed to StepInfo
  currentStepIndex: number;
  className?: string;
}

export function MinimalStepIndicator({
  steps,
  currentStepIndex,
  className,
}: MinimalStepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Step Progress */}
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-primary">
          Step {currentStepIndex + 1}
        </span>
        <span className="text-sm text-muted-foreground">
          of {steps.length}
        </span>
      </div>

      {/* Separator */}
      <span className="text-muted-foreground">•</span>

      {/* Current Step Name */}
      <span className="text-sm text-muted-foreground">
        {steps[currentStepIndex]?.title}
      </span>

      {/* Progress Bar */}
      <div className="flex-1 ml-4">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}