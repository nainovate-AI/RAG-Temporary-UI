'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Download,
  MoreVertical,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Zap,
  FileText,
  Search,
  Brain,
  Folder,
  Clock,
  BarChart3,
  Play,
  Pause,
  Settings,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'
import { Pipeline } from '@/types'
import { cn } from '@/lib/utils'

// Mock data with updated structure
const pipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Customer Support Assistant',
    description: 'Multi-language support chatbot with product knowledge',
    type: 'Q&A • Multi-language • GPT-4',
    status: 'active',
    collectionIds: ['1', '2'], // References to document collections
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
  },
  {
    id: '2',
    name: 'Technical Documentation Search',
    description: 'Code-aware search for API docs and developer guides',
    type: 'Search • Code-aware • Claude 3',
    status: 'active',
    collectionIds: ['3'], 
    retrievalConfig: {
      searchMethod: 'vector',
      topK: 10,
      reranker: {
        enabled: false,
        model: '',
      },
    },
    llmConfig: {
      provider: 'anthropic',
      model: 'claude-3-opus',
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt: 'You are a technical documentation assistant...',
      userPromptTemplate: 'Technical Question: {query}',
      streaming: true,
    },
    documentsCount: 3800,
    queriesPerDay: 892,
    avgLatency: 156,
    accuracy: 92,
    costPerDay: 98.50,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z',
    tags: ['technical', 'developers'],
  },
  {
    id: '3',
    name: 'Legal Contract Analyzer',
    description: 'Extract and analyze contract terms and compliance',
    type: 'Analysis • Legal • GPT-4',
    status: 'paused',
    collectionIds: ['4'],
    retrievalConfig: {
      searchMethod: 'hybrid',
      topK: 20,
      scoreThreshold: 0.8,
      reranker: {
        enabled: true,
        model: 'cohere-rerank-v2',
      },
    },
    llmConfig: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 3000,
      systemPrompt: 'You are a legal document analyst...',
      userPromptTemplate: 'Analyze: {query}',
      streaming: false,
    },
    documentsCount: 1200,
    queriesPerDay: 45,
    avgLatency: 523,
    accuracy: 97,
    costPerDay: 34.20,
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
    tags: ['legal', 'compliance'],
  },
]

const stats = [
  {
    label: 'Active Pipelines',
    value: pipelines.filter(p => p.status === 'active').length,
    total: pipelines.length,
    icon: Activity,
    color: 'text-green-500',
  },
  {
    label: 'Total Queries Today',
    value: pipelines.reduce((sum, p) => sum + (p.queriesPerDay || 0), 0),
    icon: Search,
    color: 'text-blue-500',
  },
  {
    label: 'Avg Response Time',
    value: Math.round(pipelines.reduce((sum, p) => sum + (p.avgLatency || 0), 0) / pipelines.length) + 'ms',
    icon: Zap,
    color: 'text-orange-500',
  },
  {
    label: 'Daily Cost',
    value: '$' + pipelines.reduce((sum, p) => sum + (p.costPerDay || 0), 0).toFixed(2),
    icon: DollarSign,
    color: 'text-purple-500',
  },
]

export default function PipelinesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const handleCreatePipeline = () => {
    router.push('/pipelines/new')
  }

  const handlePipelineClick = (pipelineId: string) => {
    router.push(`/pipelines/${pipelineId}`)
  }

  const handlePlayground = (pipelineId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/playground?pipeline=${pipelineId}`)
  }

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = 
      pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pipeline.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || pipeline.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <MainLayout>
      <PageHeader
        title="RAG Pipelines"
        description="Manage your retrieval-augmented generation pipelines"
      >
        <Button onClick={handleCreatePipeline}>
          <Plus className="mr-2 h-4 w-4" />
          New Pipeline
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat.value}
                  </div>
                  {stat.total && (
                    <p className="text-xs text-muted-foreground">
                      of {stat.total} total
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search pipelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        {/* Pipelines Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPipelines.map((pipeline) => (
            <Card
              key={pipeline.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
              onClick={() => handlePipelineClick(pipeline.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {pipeline.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {pipeline.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle menu
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <StatusBadge status={pipeline.status} />
                  <Badge variant="secondary" className="text-xs">
                    {pipeline.llmConfig.model}
                  </Badge>
                  {pipeline.retrievalConfig.reranker?.enabled && (
                    <Badge variant="outline" className="text-xs">
                      Reranked
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Collections Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Folder className="h-4 w-4" />
                  <span>{pipeline.collectionIds.length} collection{pipeline.collectionIds.length > 1 ? 's' : ''}</span>
                  <span className="text-xs">•</span>
                  <span>{formatNumber(pipeline.documentsCount)} docs</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Queries/day
                    </p>
                    <p className="font-medium">{formatNumber(pipeline.queriesPerDay)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Latency
                    </p>
                    <p className="font-medium">{pipeline.avgLatency}ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Accuracy
                    </p>
                    <p className="font-medium">{pipeline.accuracy}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Cost/day
                    </p>
                    <p className="font-medium">${pipeline.costPerDay.toFixed(2)}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {pipeline.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    {pipeline.lastQueryAt 
                      ? `Last used ${formatDate(pipeline.lastQueryAt)}`
                      : `Updated ${formatDate(pipeline.updatedAt)}`
                    }
                  </p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handlePlayground(pipeline.id, e)}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle settings
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPipelines.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No pipelines found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first RAG pipeline to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={handleCreatePipeline}>
                <Plus className="mr-2 h-4 w-4" />
                Create Pipeline
              </Button>
            )}
          </div>
        )}
      </PageContent>
    </MainLayout>
  )
}