'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
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
  Brain
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { Pipeline } from '@/types'

// Mock data
const pipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Customer Support RAG v2',
    description: 'Multi-language customer support with enhanced context retrieval',
    type: 'Q&A • Multi-language • GPT-4',
    status: 'active',
    model: {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      costPer1kTokens: 0.01,
      contextWindow: 128000,
    },
    documentsCount: 5200,
    queriesPerDay: 1234,
    avgLatency: 98,
    accuracy: 94,
    costPerDay: 127.43,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    tags: ['customer-support', 'production'],
  },
  {
    id: '2',
    name: 'Technical Documentation',
    description: 'Code-aware search for technical documentation and API references',
    type: 'Search • Code-aware • Claude 3',
    status: 'processing',
    model: {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      costPer1kTokens: 0.015,
      contextWindow: 200000,
    },
    documentsCount: 3800,
    queriesPerDay: 892,
    avgLatency: 156,
    accuracy: 92,
    costPerDay: 89.21,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    tags: ['technical', 'documentation'],
  },
  {
    id: '3',
    name: 'Legal Contract Analysis',
    description: 'Extract and analyze legal clauses with compliance checking',
    type: 'Extraction • Compliance • GPT-4',
    status: 'active',
    model: {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      costPer1kTokens: 0.01,
      contextWindow: 128000,
    },
    documentsCount: 1200,
    queriesPerDay: 342,
    avgLatency: 201,
    accuracy: 97,
    costPerDay: 56.78,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    tags: ['legal', 'compliance'],
  },
  {
    id: '4',
    name: 'Product Knowledge Base',
    description: 'FAQ and product information retrieval system',
    type: 'FAQ • Support • GPT-3.5',
    status: 'error',
    model: {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      costPer1kTokens: 0.001,
      contextWindow: 16000,
    },
    documentsCount: 2100,
    queriesPerDay: 0,
    avgLatency: 0,
    accuracy: 0,
    costPerDay: 0,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    tags: ['product', 'faq'],
  },
  {
    id: '5',
    name: 'HR Policy Assistant',
    description: 'Internal HR policy Q&A with privacy-focused local LLM',
    type: 'Internal • Q&A • Llama 3',
    status: 'inactive',
    model: {
      id: 'llama-3-70b',
      name: 'Llama 3 70B',
      provider: 'meta',
      costPer1kTokens: 0,
      contextWindow: 8000,
    },
    documentsCount: 456,
    queriesPerDay: 0,
    avgLatency: 124,
    accuracy: 89,
    costPerDay: 0,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-10T11:00:00Z',
    tags: ['hr', 'internal'],
  },
  {
    id: '6',
    name: 'Sales Enablement',
    description: 'Sales team knowledge base integrated with CRM data',
    type: 'Knowledge • CRM • GPT-4',
    status: 'active',
    model: {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      costPer1kTokens: 0.01,
      contextWindow: 128000,
    },
    documentsCount: 892,
    queriesPerDay: 567,
    avgLatency: 112,
    accuracy: 91,
    costPerDay: 45.32,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-15T07:30:00Z',
    tags: ['sales', 'crm'],
  },
]

const filterTabs = [
  { label: 'All Pipelines', value: 'all', count: pipelines.length },
  { label: 'Active', value: 'active', count: pipelines.filter(p => p.status === 'active').length },
  { label: 'Inactive', value: 'inactive', count: pipelines.filter(p => p.status === 'inactive').length },
  { label: 'Issues', value: 'issues', count: pipelines.filter(p => p.status === 'error' || p.status === 'processing').length },
]

const statusIcons = {
  active: CheckCircle,
  inactive: XCircle,
  processing: Activity,
  error: AlertCircle,
}

export default function PipelinesPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredPipelines = pipelines.filter(pipeline => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'active') return pipeline.status === 'active'
    if (activeFilter === 'inactive') return pipeline.status === 'inactive'
    if (activeFilter === 'issues') return pipeline.status === 'error' || pipeline.status === 'processing'
    return true
  })

  const handleCreatePipeline = () => {
    router.push('/pipelines/new')
  }

  const handlePipelineClick = (pipelineId: string) => {
    router.push(`/pipelines/${pipelineId}`)
  }

  return (
    <MainLayout>
      <PageHeader
        title="Pipeline Management"
        description="Configure and monitor your RAG pipelines"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button onClick={handleCreatePipeline}>
          <Plus className="mr-2 h-4 w-4" />
          New Pipeline
        </Button>
      </PageHeader>

      <PageContent>
        {/* Filter Tabs */}
        <div className="flex gap-6 mb-8 border-b border-border">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeFilter === tab.value
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {tab.count}
              </Badge>
              {activeFilter === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Pipelines Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPipelines.map((pipeline) => {
            const StatusIcon = statusIcons[pipeline.status]
            
            return (
              <Card 
                key={pipeline.id} 
                className="card-hover relative overflow-hidden"
                onClick={() => handlePipelineClick(pipeline.id)}
              >
                {/* Status line at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  pipeline.status === 'active' ? 'bg-green-500' :
                  pipeline.status === 'inactive' ? 'bg-gray-500' :
                  pipeline.status === 'processing' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{pipeline.type}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle menu click
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-3">
                    <StatusBadge status={pipeline.status} />
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Performance Chart Placeholder */}
                  <div className="h-16 bg-muted/30 rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" 
                      style={{
                        clipPath: 'polygon(0% 80%, 10% 70%, 20% 75%, 30% 65%, 40% 60%, 50% 55%, 60% 50%, 70% 45%, 80% 40%, 90% 35%, 100% 30%, 100% 100%, 0% 100%)'
                      }}
                    />
                    <span className="absolute top-2 left-3 text-xs text-muted-foreground">Response time (7d)</span>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <p className="text-lg font-semibold">{formatNumber(pipeline.documentsCount)}</p>
                      <p className="text-xs text-muted-foreground">Documents</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{formatNumber(pipeline.queriesPerDay)}</p>
                      <p className="text-xs text-muted-foreground">Queries/day</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{pipeline.avgLatency}ms</p>
                      <p className="text-xs text-muted-foreground">Avg latency</p>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {pipeline.accuracy}% accuracy
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="mr-1 h-3 w-3" />
                      ${pipeline.costPerDay}/day
                    </Badge>
                    {pipeline.status === 'active' && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="mr-1 h-3 w-3" />
                        Auto-scaled
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push('/playground')
                      }}
                    >
                      Test
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/pipelines/${pipeline.id}/config`)
                      }}
                    >
                      Configure
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/analytics/pipeline/${pipeline.id}`)
                      }}
                    >
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </PageContent>
    </MainLayout>
  )
}