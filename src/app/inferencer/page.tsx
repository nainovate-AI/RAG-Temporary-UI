// src/app/inferencer/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PageHeader, 
  PageContent,
  MainLayout
} from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/badge'
import { 
  Plus,
  Search,
  Zap,
  DollarSign,
  Brain,
  Play,
  Settings,
  FileText,
  MessageSquare
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

// Update pipeline data to include type
const pipelines = [
  {
    id: '1',
    name: 'Customer Support RAG',
    type: 'rag' as const,
    description: 'Multi-language support chatbot with product knowledge',
    status: 'active' as const,
    collectionIds: ['1', '2'],
    documentsCount: 5200,
    model: {
      provider: 'openai',
      name: 'gpt-4-turbo',
    },
    tags: ['customer-support', 'production'],
    queriesPerDay: 1234,
    avgLatency: 98,
    costPerDay: 10.5,
    lastQueryAt: '2024-01-15T16:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    name: 'GPT-4 Content Writer',
    type: 'llm' as const,
    description: 'AI-powered content generation for blog posts and social media',
    status: 'active' as const,
    collectionIds: [],
    documentsCount: 0,
    model: {
      provider: 'openai',
      name: 'gpt-4',
    },
    tags: ['content', 'marketing'],
    queriesPerDay: 892,
    avgLatency: 45,
    costPerDay: 8.2,
    lastQueryAt: '2024-01-15T15:30:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  // Add more pipelines...
]

const stats = [
  {
    label: 'Active Pipelines',
    value: pipelines.filter(p => p.status === 'active').length + ' of ' + pipelines.length,
    icon: Brain,
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
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const handleCreatePipeline = () => {
    router.push('/inferencer/new')
  }

  const handlePipelineClick = (pipelineId: string) => {
    router.push(`/inferencer/${pipelineId}`)
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
    const matchesType = filterType === 'all' || pipeline.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <MainLayout>
      <PageHeader
        title="AI Pipelines"
        description="Manage your AI inference and RAG pipelines"
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
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pipelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="rag">RAG Pipelines</option>
              <option value="llm">LLM Pipelines</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        {/* Pipelines Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPipelines.map((pipeline) => (
            <Card
              key={pipeline.id}
              className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
              onClick={() => handlePipelineClick(pipeline.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {pipeline.type === 'rag' ? (
                        <Badge variant="secondary" className="text-xs">
                          <FileText className="mr-1 h-3 w-3" />
                          RAG Pipeline
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          LLM Pipeline
                        </Badge>
                      )}
                      <StatusBadge status={pipeline.status} />
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2 line-clamp-2">
                  {pipeline.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{pipeline.model.name}</span>
                  <Badge variant="outline">{pipeline.model.provider}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {pipeline.type === 'rag' && (
                    <div>
                      <p className="text-muted-foreground">Collections</p>
                      <p className="font-medium">{pipeline.collectionIds.length}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Documents</p>
                    <p className="font-medium">
                      {pipeline.documentsCount > 0 ? pipeline.documentsCount.toLocaleString() : 'Direct LLM'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Queries/day</p>
                    <p className="font-medium">{pipeline.queriesPerDay?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Latency</p>
                    <p className="font-medium">{pipeline.avgLatency || '0'}ms</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
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
                : 'Create your first pipeline to get started'
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