'use client'

import { usePathname } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { Card } from '@/components/ui/card'
import { 
  Folder,
  Search,
  Brain,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/inferencer')}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Create RAG Pipeline
                </h1>
                <p className="text-muted-foreground mt-1">
                  Configure retrieval-augmented generation for your documents
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <Card className="p-8 bg-card/50 backdrop-blur border-primary/10">
            <div className="relative">
              {/* Progress Line Background */}
              <div className="absolute left-0 right-0 top-[25px] h-[2px] bg-border/50" />
              
              {/* Active Progress Line */}
              <div 
                className="absolute left-0 top-[25px] h-[2px] bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out"
                style={{ 
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStepIndex
                  const isCompleted = index < currentStepIndex
                  const isUpcoming = index > currentStepIndex

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex flex-col items-center group cursor-pointer transition-all duration-200",
                        isCompleted && "cursor-pointer"
                      )}
                      onClick={() => {
                        if (isCompleted) {
                          router.push(step.path)
                        }
                      }}
                    >
                      {/* Step Circle */}
                      <div className="relative">
                        <div
                          className={cn(
                            "w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300",
                            "ring-4 ring-offset-2 ring-offset-background",
                            isActive && "bg-primary text-primary-foreground ring-primary/30 scale-110 shadow-lg shadow-primary/25",
                            isCompleted && "bg-primary text-primary-foreground ring-primary/20 hover:scale-105",
                            isUpcoming && "bg-muted text-muted-foreground ring-transparent"
                          )}
                        >
                          {isCompleted && index !== currentStepIndex ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        
                        {/* Active Pulse */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        )}
                      </div>

                      {/* Step Label */}
                      <div className="mt-4 text-center">
                        <p className={cn(
                          "text-sm font-semibold transition-colors",
                          isActive && "text-primary",
                          isCompleted && "text-foreground",
                          isUpcoming && "text-muted-foreground"
                        )}>
                          {step.title}
                        </p>
                        <p className={cn(
                          "text-xs mt-1 hidden md:block transition-opacity",
                          isActive ? "text-muted-foreground opacity-100" : "opacity-60"
                        )}>
                          {step.description}
                        </p>
                      </div>

                      {/* Step Number */}
                      <div className={cn(
                        "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        isActive && "bg-primary text-primary-foreground",
                        isCompleted && "bg-primary/20 text-primary",
                        isUpcoming && "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Main Content Area */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}