'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle,
  ChevronLeft,
  Folder,
  Search,
  Brain,
  FileText,
  Loader2,
  AlertCircle,
  Info,
  Rocket,
  Edit2,
  Clock,
  DollarSign,
  Zap,
  Hash,
  Settings,
  MessageSquare,
  Filter,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - in real app, this would come from context/session
const reviewData = {
  basic: {
    name: 'Customer Support Assistant',
    description: 'Multi-language support chatbot with product knowledge',
    useCase: 'qa',
    tags: ['customer-support', 'production'],
    collections: [
      { id: '1', name: 'Customer Support Knowledge Base', documents: 1543, chunks: 12847 },
      { id: '2', name: 'Product Documentation', documents: 892, chunks: 8234 },
    ],
  },
  retrieval: {
    searchMethod: 'hybrid',
    hybridAlpha: 0.5,
    topK: 5,
    scoreThreshold: 0.7,
    reranker: {
      enabled: true,
      model: 'cohere-rerank-english-v2',
      topN: 3,
    },
    filters: [
      { field: 'category', operator: 'equals', value: 'support' },
    ],
  },
  llm: {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 1000,
    streaming: true,
    systemPrompt: 'You are a helpful customer support assistant...',
    userPromptTemplate: 'Question: {query}',
  },
  estimates: {
    totalDocuments: 2435,
    totalChunks: 21081,
    queriesPerDay: 1000,
    avgLatency: 120, // ms
    costPerDay: 12.50,
    costBreakdown: {
      embedding: 0,
      reranking: 1.50,
      llm: 11.00,
    },
  },
}

const steps = [
  { id: 'basic', title: 'Basic Info & Collections', icon: Folder, path: '/pipelines/new' },
  { id: 'retrieval', title: 'Retrieval Config', icon: Search, path: '/pipelines/new/retrieval' },
  { id: 'llm', title: 'LLM & Prompts', icon: Brain, path: '/pipelines/new/llm' },
]

export default function ReviewDeployPage() {
  const router = useRouter()
  const [isDeploying, setIsDeploying] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleEdit = (path: string) => {
    router.push(path)
  }

  const handleDeploy = async () => {
    if (!agreedToTerms) return

    setIsDeploying(true)
    // Simulate API call to create pipeline
    setTimeout(() => {
      // In real app, this would create the pipeline and redirect
      router.push('/pipelines')
    }, 2000)
  }

  const handleBack = () => {
    router.push('/pipelines/new/llm')
  }

  const handleTestQuery = () => {
    // Could open a modal or redirect to playground with this config
    router.push('/playground?test=true')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Review & Deploy Pipeline</h2>
        <p className="text-muted-foreground">
          Review your configuration before deploying the pipeline
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-4">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Basic Information</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[0].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Pipeline Name</p>
                <p className="font-medium">{reviewData.basic.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Use Case</p>
                <Badge variant="outline" className="mt-1">Q&A / Support</Badge>
              </div>
            </div>
            {reviewData.basic.description && (
              <div>
                <p className="text-muted-foreground text-sm">Description</p>
                <p className="text-sm mt-1">{reviewData.basic.description}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-sm mb-2">Tags</p>
              <div className="flex gap-2">
                {reviewData.basic.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Collections */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Document Collections</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[0].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewData.basic.collections.map((collection) => (
                <div key={collection.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{collection.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {collection.documents.toLocaleString()} documents • {collection.chunks.toLocaleString()} chunks
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Documents</p>
                    <p className="font-medium">{reviewData.estimates.totalDocuments.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Chunks</p>
                    <p className="font-medium">{reviewData.estimates.totalChunks.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retrieval Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Retrieval Configuration</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[1].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Search Method</p>
                <p className="font-medium capitalize">{reviewData.retrieval.searchMethod}</p>
                {reviewData.retrieval.searchMethod === 'hybrid' && (
                  <p className="text-xs text-muted-foreground">α={reviewData.retrieval.hybridAlpha}</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground">Top K</p>
                <p className="font-medium">{reviewData.retrieval.topK} results</p>
              </div>
              <div>
                <p className="text-muted-foreground">Score Threshold</p>
                <p className="font-medium">{reviewData.retrieval.scoreThreshold}</p>
              </div>
            </div>
            
            {reviewData.retrieval.reranker.enabled && (
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Reranking Enabled</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Model</p>
                    <p className="font-medium text-xs">{reviewData.retrieval.reranker.model}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Top N</p>
                    <p className="font-medium">{reviewData.retrieval.reranker.topN} results</p>
                  </div>
                </div>
              </div>
            )}

            {reviewData.retrieval.filters.length > 0 && (
              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Metadata Filters
                </p>
                <div className="space-y-1">
                  {reviewData.retrieval.filters.map((filter, i) => (
                    <p key={i} className="text-xs text-muted-foreground font-mono">
                      {filter.field} {filter.operator} "{filter.value}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LLM Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">LLM Configuration</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[2].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Model</p>
                <p className="font-medium">{reviewData.llm.model}</p>
                <p className="text-xs text-muted-foreground">{reviewData.llm.provider}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Parameters</p>
                <p className="text-xs space-y-0.5">
                  <span className="block">Temperature: {reviewData.llm.temperature}</span>
                  <span className="block">Max tokens: {reviewData.llm.maxTokens}</span>
                  <span className="block">Streaming: {reviewData.llm.streaming ? 'Yes' : 'No'}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Prompts
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-secondary/50 rounded font-mono">
                  <span className="text-primary">System:</span> {reviewData.llm.systemPrompt.substring(0, 60)}...
                </div>
                <div className="p-2 bg-secondary/50 rounded font-mono">
                  <span className="text-primary">User:</span> {reviewData.llm.userPromptTemplate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance & Cost Estimates */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Deployment Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Latency</p>
                <p className="font-medium text-lg">~{reviewData.estimates.avgLatency}ms</p>
              </div>
              <div className="text-center">
                <Hash className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Queries/day</p>
                <p className="font-medium text-lg">{reviewData.estimates.queriesPerDay.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Cost/day</p>
                <p className="font-medium text-lg">${reviewData.estimates.costPerDay.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium text-lg">Ready</p>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">Cost Breakdown</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Embedding API</span>
                  <span>${reviewData.estimates.costBreakdown.embedding.toFixed(2)}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reranking API</span>
                  <span>${reviewData.estimates.costBreakdown.reranking.toFixed(2)}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LLM API</span>
                  <span>${reviewData.estimates.costBreakdown.llm.toFixed(2)}/day</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Query Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleTestQuery}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Test with Sample Query
          </Button>
        </div>

        {/* Terms and Warnings */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-600">Before Deploying</p>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>• Ensure API keys are configured for {reviewData.llm.provider}</li>
                    {reviewData.retrieval.reranker.enabled && (
                      <li>• Reranking API key required for Cohere</li>
                    )}
                    <li>• Pipeline will be active immediately after deployment</li>
                    <li>• You can pause or modify the pipeline anytime</li>
                  </ul>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  I understand the estimated costs and have configured the required API keys
                </span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isDeploying}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleDeploy}
          disabled={!agreedToTerms || isDeploying}
          size="lg"
          className="min-w-[200px]"
        >
          {isDeploying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deploying Pipeline...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 mr-2" />
              Deploy Pipeline
            </>
          )}
        </Button>
      </div>
    </div>
  )
}