'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardNavigationProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  canProceed?: boolean;
  className?: string;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
}

export function WizardNavigation({
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  isSubmitting = false,
  canProceed = true,
  className,
  nextLabel = 'Next',
  backLabel = 'Back',
  submitLabel = 'Complete',
}: WizardNavigationProps) {
  return (
    <div className={cn('flex justify-between items-center', className)}>
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </Button>

      <Button
        onClick={onNext}
        disabled={!canProceed || isSubmitting}
        className="gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {isLastStep ? submitLabel : nextLabel}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </>
        )}
      </Button>
    </div>
  );
}
