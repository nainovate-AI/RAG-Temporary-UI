'use client'

import { ReactNode } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { CheckCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, name: 'Basic Info', href: '/pipelines/new' },
  { id: 2, name: 'Document Processing', href: '/pipelines/new/processing' },
  { id: 3, name: 'Retrieval', href: '/pipelines/new/retrieval' },
  { id: 4, name: 'Generation', href: '/pipelines/new/generation' },
]

export default function NewPipelineLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  const currentStepIndex = steps.findIndex(step => step.href === pathname)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-border bg-background px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <a href="/pipelines" className="hover:text-foreground transition-colors">
              Pipelines
            </a>
            <span>/</span>
            <span>New Pipeline</span>
          </div>
          <h1 className="text-3xl font-bold">Configure New Pipeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up your RAG pipeline with document processing, retrieval, and generation settings
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-8">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-0 top-5 w-full h-0.5 bg-muted">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      isCompleted && "bg-green-500 text-white",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className={cn(
                      "mt-2 text-sm font-medium",
                      isCurrent && "text-foreground",
                      !isCurrent && "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {children}
        </div>
      </div>
    </MainLayout>
  )
}

