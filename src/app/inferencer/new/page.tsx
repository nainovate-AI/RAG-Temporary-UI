// src/app/inferencer/new/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, MessageSquare, Brain, Search, Database, Sparkles, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MainLayout } from '@/components/layout/main-layout'

const pipelineTypes = [
  {
    id: 'rag',
    title: 'RAG Pipeline',
    icon: FileText,
    subtitle: 'Retrieval-Augmented Generation',
    description: 'Connect your documents with LLMs to answer questions based on your data.',
    features: [
      'Knowledge bases & support',
      'Document Q&A',
      'Contextual search',
      'Data-driven responses'
    ],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 'llm',
    title: 'LLM Inference Pipeline',
    icon: MessageSquare,
    subtitle: 'Direct Language Model',
    description: 'Use LLMs directly without document context for generation and transformation.',
    features: [
      'Content generation',
      'Text transformation',
      'Creative writing',
      'Code generation'
    ],
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
]

export default function PipelineTypePage() {
  const router = useRouter()

  const handleSelectType = (type: string) => {
    router.push(`/inferencer/new/basic?type=${type}`)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header Section - Simplified */}
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
                <h1 className="text-2xl font-bold">Create Pipeline</h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto space-y-6 mt-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Choose Pipeline Type</h2>
              <p className="text-muted-foreground">
                Select the type of AI pipeline you want to create
              </p>
            </div>

            {/* Pipeline Type Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              {pipelineTypes.map((type) => {
                const Icon = type.icon
                
                return (
                  <Card
                    key={type.id}
                    className={cn(
                      "relative cursor-pointer transition-all hover:shadow-lg",
                      "hover:-translate-y-1",
                      type.borderColor
                    )}
                    onClick={() => handleSelectType(type.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={cn("p-3 rounded-lg", type.bgColor)}>
                          <Icon className={cn("h-6 w-6", type.color)} />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="mt-4">{type.title}</CardTitle>
                      <CardDescription className="text-sm font-medium">
                        {type.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Perfect for:
                        </p>
                        <ul className="space-y-1">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div className={cn("w-1.5 h-1.5 rounded-full", type.bgColor)} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 border border-border rounded-lg">
              <Brain className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Not sure which to choose?</p>
                <p className="text-muted-foreground">
                  Choose <strong>RAG Pipeline</strong> if you want to answer questions using your own documents. 
                  Choose <strong>LLM Pipeline</strong> for general text generation without specific document context.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}