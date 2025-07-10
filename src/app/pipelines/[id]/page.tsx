'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Play,
  Pause,
  Settings,
  Trash2,
  Activity,
  Brain,
  Search,
  Folder,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  BarChart3,
  FileText,
  Hash,
  Calendar,
  Edit2,
  RefreshCw,
  ExternalLink,
  Copy
} from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'
import { Pipeline } from '@/types'
import { cn } from '@/lib/utils'

// Mock data - in real app, fetch based on ID
const pipeline: Pipeline = {
  id: '1',
  name: 'Customer Support Assistant',
  description: 'Multi-language support chatbot with product knowledge',
  type: 'Q&A • Multi-language • GPT-4',
  status: 'active',
  collectionIds: ['1', '2'],
  retrievalConfig: {
    searchMethod: 'hybrid',
    topK: 5,
    scoreThreshold: 0.7,
    reranker: {
      enabled: true,
      model: 'cohere-rerank-v2',
    },
  },
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful customer support assistant...',
    userPromptTemplate: 'Question: {query}',
    streaming: true,
  },
  documentsCount: 5200,
  queriesPerDay: 1234,
  avgLatency: 98,
  accuracy: 94,
  costPerDay: 127.43,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  tags: ['customer-support', 'production'],
  lastQueryAt: '2024-01-15T16:45:00Z',
  metrics: {
    totalQueries: 45678,
    failureRate: 2.1,
  },
}

// Mock collections data
const collections = [
  {
    id: '1',
    name: 'Customer Support Knowledge Base',
    documents: 1543,
    chunks: 12847,
    status: 'ready',
  },
  {
    id: '2',
    name: 'Product Documentation',
    documents: 892,
    chunks: 8234,
    status: 'ready',
  },
]

// Mock recent queries
const recentQueries = [
  {
    id: '1',
    query: 'How do I reset my password?',
    response: 'To reset your password, go to the login page...',
    latency: 95,
    tokens: 234,
    timestamp: '2024-01-15T16:45:00Z',
  },
  {
    id: '2',
    query: 'What are the pricing plans?',
    response: 'We offer three pricing plans: Basic, Pro, and Enterprise...',
    latency: 102,
    tokens: 456,
    timestamp: '2024-01-15T16:30:00Z',
  },
]

export default function PipelineDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const pipelineId = params.id as string
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'queries' | 'analytics'>('overview')

  const handleToggleStatus = () => {
    // Toggle between active and paused
    console.log('Toggle pipeline status')
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this pipeline?')) {
      // Delete pipeline
      router.push('/pipelines')
    }
  }

  const handleEdit = () => {
    // Navigate to edit mode or open edit modal
    console.log('Edit pipeline')
  }

  const handleTestQuery = () => {
    router.push(`/playground?pipeline=${pipelineId}`)
  }

  return (
    <MainLayout>
      <PageHeader
        title={pipeline.name}
        description={pipeline.description}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/pipelines')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={handleTestQuery}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Test Query
          </Button>
          {pipeline.status === 'active' ? (
            <Button
              variant="outline"
              onClick={handleToggleStatus}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleToggleStatus}
            >
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleEdit}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        {/* Status and Metadata */}
        <div className="flex items-center gap-4 mb-6">
          <StatusBadge status={pipeline.status} />
          <Badge variant="secondary">{pipeline.llmConfig.model}</Badge>
          {pipeline.retrievalConfig.reranker?.enabled && (
            <Badge variant="outline">Reranked</Badge>
          )}
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Created {formatDate(pipeline.createdAt)}
          </span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Last used {formatDate(pipeline.lastQueryAt || pipeline.updatedAt)}
          </span>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <nav className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'config', label: 'Configuration', icon: Settings },
              { id: 'queries', label: 'Recent Queries', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Queries Today</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(pipeline.queriesPerDay)}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 text-green-500" /> 12% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pipeline.avgLatency}ms</div>
                  <p className="text-xs text-muted-foreground">Target: &lt;200ms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pipeline.accuracy}%</div>
                  <p className="text-xs text-muted-foreground">Based on feedback</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${pipeline.costPerDay.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Projected: ${(pipeline.costPerDay * 30).toFixed(0)}/mo</p>
                </CardContent>
              </Card>
            </div>

            {/* Document Collections */}
            <Card>
              <CardHeader>
                <CardTitle>Document Collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {collections.map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{collection.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(collection.documents)} documents • {formatNumber(collection.chunks)} chunks
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={collection.status} />
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    Total: {formatNumber(pipeline.documentsCount)} documents across {collections.length} collections
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {pipeline.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Retrieval Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Retrieval Configuration</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Search Method</p>
                    <p className="font-medium capitalize">{pipeline.retrievalConfig.searchMethod}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Top K</p>
                    <p className="font-medium">{pipeline.retrievalConfig.topK} results</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Score Threshold</p>
                    <p className="font-medium">{pipeline.retrievalConfig.scoreThreshold}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reranking</p>
                    <p className="font-medium">
                      {pipeline.retrievalConfig.reranker?.enabled 
                        ? pipeline.retrievalConfig.reranker.model 
                        : 'Disabled'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LLM Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>LLM Configuration</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Provider</p>
                    <p className="font-medium capitalize">{pipeline.llmConfig.provider}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Model</p>
                    <p className="font-medium">{pipeline.llmConfig.model}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Temperature</p>
                    <p className="font-medium">{pipeline.llmConfig.temperature}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Tokens</p>
                    <p className="font-medium">{pipeline.llmConfig.maxTokens}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <div>
                    <p className="text-sm font-medium mb-1">System Prompt</p>
                    <pre className="text-xs bg-secondary p-3 rounded-lg overflow-x-auto">
                      {pipeline.llmConfig.systemPrompt}
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">User Prompt Template</p>
                    <pre className="text-xs bg-secondary p-3 rounded-lg overflow-x-auto">
                      {pipeline.llmConfig.userPromptTemplate}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'queries' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQueries.map((query) => (
                  <div key={query.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">{query.query}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {query.response}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {query.latency}ms
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {query.tokens} tokens
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(query.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mr-2" />
                  Analytics charts would go here
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageContent>
    </MainLayout>
  )
}