// src/app/inferencer/new/basic/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Info, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PipelineType } from '@/types/pipeline.types'

const useCases = {
  rag: [
    { id: 'qa', label: 'Q&A / Support', icon: '💬' },
    { id: 'search', label: 'Semantic Search', icon: '🔍' },
    { id: 'chat', label: 'Conversational AI', icon: '🤖' },
    { id: 'analysis', label: 'Document Analysis', icon: '📊' },
    { id: 'extraction', label: 'Information Extraction', icon: '📋' },
    { id: 'custom', label: 'Custom', icon: '⚙️' },
  ],
  llm: [
    { id: 'content', label: 'Content Generation', icon: '✍️' },
    { id: 'transform', label: 'Text Transformation', icon: '🔄' },
    { id: 'code', label: 'Code Generation', icon: '💻' },
    { id: 'summarize', label: 'Summarization', icon: '📝' },
    { id: 'extract', label: 'Data Extraction', icon: '📊' },
    { id: 'custom', label: 'Custom', icon: '⚙️' },
  ],
}

export default function BasicInfoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pipelineType = searchParams.get('type') as PipelineType
  
  const [pipelineName, setPipelineName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedUseCase, setSelectedUseCase] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')

  const currentUseCases = useCases[pipelineType] || useCases.llm

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const canProceed = pipelineName.trim() && selectedUseCase

  const handleNext = () => {
    if (canProceed) {
      // Save data to session/context
      const nextPath = pipelineType === 'rag' 
        ? '/inferencer/new/collections'
        : '/inferencer/new/memory'
      router.push(`${nextPath}?type=${pipelineType}`)
    }
  }

  const handleBack = () => {
    router.push('/inferencer/new')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Pipeline Information</p>
          <p className="text-muted-foreground">
            {pipelineType === 'rag' 
              ? 'Set up the basic information for your RAG pipeline. You\'ll select document collections in the next step.'
              : 'Configure the basic settings for your LLM inference pipeline.'
            }
          </p>
        </div>
      </div>

      {/* Pipeline Information */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Information</CardTitle>
          <CardDescription>
            Provide basic details about your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pipeline Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Pipeline Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder={pipelineType === 'rag' ? 'e.g., Customer Support Assistant' : 'e.g., GPT-4 Content Writer'}
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder={pipelineType === 'rag' 
                ? 'Describe the purpose of this RAG pipeline...'
                : 'Describe what this LLM pipeline will be used for...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Use Case Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Use Case <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentUseCases.map((useCase) => (
                <div
                  key={useCase.id}
                  className={cn(
                    "flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all",
                    selectedUseCase === useCase.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedUseCase(useCase.id)}
                >
                  <span className="text-xl">{useCase.icon}</span>
                  <span className="text-sm font-medium">{useCase.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!currentTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed}>
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}