'use client'

import { usePathname } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { MinimalStepIndicator } from '@/components/ui/step-indicator'
import { 
  Folder,
  Search,
  Brain,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const steps = [
  {
    id: 'basic',
    title: 'Basic Info & Collections',
    description: 'Name and select data',
    icon: Folder,
    path: '/inferencer/new',
  },
  {
    id: 'retrieval',
    title: 'Retrieval Config',
    description: 'Search settings',
    icon: Search,
    path: '/inferencer/new/retrieval',
  },
  {
    id: 'llm',
    title: 'LLM & Prompts',
    description: 'Model and prompts',
    icon: Brain,
    path: '/inferencer/new/llm',
  },
  {
    id: 'review',
    title: 'Review & Deploy',
    description: 'Confirm settings',
    icon: CheckCircle,
    path: '/inferencer/new/review',
  },
]

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  
  const currentStepIndex = steps.findIndex(step => pathname === step.path)
  
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
                <h1 className="text-2xl font-bold">Create RAG Pipeline</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure retrieval-augmented generation for your documents
                </p>
              </div>
            </div>
          </div>

          {/* Minimal Step Indicator with glow effect */}
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