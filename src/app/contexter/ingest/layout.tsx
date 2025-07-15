'use client'

import { usePathname } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { MinimalStepIndicator } from '@/components/ui/step-indicator'
import { 
  Upload, 
  Settings, 
  Brain, 
  Database, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const steps = [
  {
    id: 'upload',
    title: 'Upload Documents',
    description: 'Select files to ingest',
    icon: Upload,
    path: '/contexter/ingest/new',
  },
  {
    id: 'processing',
    title: 'Processing Config',
    description: 'Configure chunking',
    icon: Settings,
    path: '/contexter/ingest/new/processing',
  },
  {
    id: 'embedding',
    title: 'Embedding',
    description: 'Choose embedding model',
    icon: Brain,
    path: '/contexter/ingest/new/embedding',
  },
  {
    id: 'vectorstore',
    title: 'Vector Store',
    description: 'Storage configuration',
    icon: Database,
    path: '/contexter/ingest/new/vector-store',
  },
  {
    id: 'review',
    title: 'Review & Start',
    description: 'Confirm and begin',
    icon: CheckCircle,
    path: '/contexter/ingest/new/review',
  },
]

export default function IngestLayout({
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
                onClick={() => router.push('/contexter')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Create Document Collection</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Ingest and process documents into a searchable collection
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