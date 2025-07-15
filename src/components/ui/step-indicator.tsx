import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import React from 'react'

interface Step {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function MinimalStepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div 
                  className={cn(
                    "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    isActive ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.5)]" :
                    isCompleted ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
              </div>
              
              <div className="hidden sm:block">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                {isActive && (
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-[2px] max-w-[60px] transition-colors duration-300",
                isCompleted ? "bg-primary" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Alternative ultra-compact version with just icons
export function UltraMinimalStepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        
        return (
          <React.Fragment key={step.id}>
            <div className="relative group">
              <div 
                className={cn(
                  "relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                  isActive ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.5)]" :
                  isCompleted ? "bg-primary/20 text-primary" :
                  "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {step.title}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "w-12 h-[2px] transition-all duration-300",
                isCompleted ? "bg-primary" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}