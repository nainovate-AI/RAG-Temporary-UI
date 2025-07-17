// src/app/inferencer/new/layout.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { MinimalStepIndicator } from '@/components/ui/step-indicator'
import { 
  Folder,
  Search,
  Brain,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Cpu,
  Zap,
  Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { PipelineType } from '@/types/pipeline.types'

// Define all possible steps
const allSteps = {
  basic: {
    id: 'basic',
    title: 'Basic Info',
    description: 'Name and description',
    icon: Folder,
    path: '/inferencer/new/basic',
  },
  collections: {
    id: 'collections',
    title: 'Collections',
    description: 'Select data sources',
    icon: Database,
    path: '/inferencer/new/collections',
  },
  retrieval: {
    id: 'retrieval',
    title: 'Retrieval Config',
    description: 'Search settings',
    icon: Search,
    path: '/inferencer/new/retrieval',
  },
  memory: {
    id: 'memory',
    title: 'Memory',
    description: 'Conversation memory',
    icon: Brain,
    path: '/inferencer/new/memory',
  },
  mcp: {
    id: 'mcp',
    title: 'MCP Tools',
    description: 'External tools',
    icon: Cpu,
    path: '/inferencer/new/mcp',
  },
  llm: {
    id: 'llm',
    title: 'LLM & Prompts',
    description: 'Model and prompts',
    icon: MessageSquare,
    path: '/inferencer/new/llm',
  },
  review: {
    id: 'review',
    title: 'Review & Deploy',
    description: 'Confirm settings',
    icon: CheckCircle,
    path: '/inferencer/new/review',
  },
}

// Get steps based on pipeline type
const getStepsForPipelineType = (type: PipelineType) => {
  if (type === 'rag') {
    return [
      allSteps.basic,
      allSteps.collections,
      allSteps.retrieval,
      allSteps.memory,
      allSteps.mcp,
      allSteps.llm,
      allSteps.review,
    ]
  }
  
  // LLM pipeline
  return [
    allSteps.basic,
    allSteps.memory,
    allSteps.mcp,
    allSteps.llm,
    allSteps.review,
  ]
}

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get pipeline type from URL params
  const pipelineType = searchParams.get('type') as PipelineType | null
  
  // Check if we're on the pipeline type selection page
  const isTypeSelectionPage = pathname === '/inferencer/new'
  
  // Don't show layout wrapper for type selection page
  if (isTypeSelectionPage) {
    return <>{children}</>
  }
  
  // If no pipeline type is set but we're past the selection page, redirect
  if (!pipelineType) {
    router.push('/inferencer/new')
    return null
  }
  
  // Get steps based on pipeline type
  const steps = getStepsForPipelineType(pipelineType)
  const currentStepIndex = steps.findIndex(step => pathname === step.path)
  
  const headerTitle = pipelineType === 'llm' 
    ? 'Create LLM Pipeline' 
    : 'Create RAG Pipeline'
    
  const headerDescription = pipelineType === 'llm'
    ? 'Configure direct language model inference'
    : 'Configure retrieval-augmented generation for your documents'
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/inferencer')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{headerTitle}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {headerDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Step Indicator - Only show after pipeline type is selected */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
            <MinimalStepIndicator 
              steps={steps} 
              currentStep={currentStepIndex}
            />
          </div>

          {/* Main Content Area */}
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}