'use client'

import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { 
  FileText, 
  Link2, 
  Search, 
  Zap,
  Plus,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react'
import { formatNumber, getGreeting } from '@/lib/utils'

// Mock data - replace with API calls
const stats = [
  {
    title: 'Total Documents',
    value: 12847,
    change: 15,
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Active Pipelines',
    value: 8,
    change: 2,
    icon: Link2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Queries Today',
    value: 3421,
    change: 8,
    icon: Search,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Avg. Latency',
    value: '145ms',
    change: -12,
    icon: Zap,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

const activePipelines = [
  {
    id: '1',
    name: 'Customer Support RAG',
    type: 'Q&A • Multi-domain',
    status: 'active' as const,
    documents: 5200,
    queriesPerDay: 1234,
    avgLatency: '98ms',
  },
  {
    id: '2',
    name: 'Technical Documentation',
    type: 'Search • Code-aware',
    status: 'processing' as const,
    documents: 3800,
    queriesPerDay: 892,
    avgLatency: '156ms',
  },
  {
    id: '3',
    name: 'Legal Contract Analysis',
    type: 'Extraction • Compliance',
    status: 'active' as const,
    documents: 1200,
    queriesPerDay: 342,
    avgLatency: '201ms',
  },
]

const recentQueries = [
  {
    id: '1',
    query: 'How do I integrate the payment SDK with React?',
    pipeline: 'Technical Docs',
    latency: '87ms',
    tokens: 421,
    time: '2 min ago',
  },
  {
    id: '2',
    query: "What's the refund policy for enterprise subscriptions?",
    pipeline: 'Customer Support',
    latency: '102ms',
    tokens: 356,
    time: '5 min ago',
  },
  {
    id: '3',
    query: 'Find all clauses related to termination in the contract',
    pipeline: 'Legal Analysis',
    latency: '245ms',
    tokens: 892,
    time: '8 min ago',
  },
]

export default function DashboardPage() {
  const greeting = getGreeting()

  return (
    <MainLayout>
      <PageHeader
        title={`${greeting}, Alex`}
        description="Here's your RAG system overview"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Pipeline
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={stat.change > 0 ? 'text-green-500' : 'text-red-500'}>
                      {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                    </span>
                    {' '}from last week
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Active Pipelines */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Active Pipelines</h2>
            <Button variant="outline" size="sm">View all →</Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activePipelines.map((pipeline) => (
              <Card key={pipeline.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{pipeline.type}</p>
                    </div>
                    <StatusBadge status={pipeline.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-semibold">{formatNumber(pipeline.documents)}</p>
                      <p className="text-xs text-muted-foreground">Documents</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{formatNumber(pipeline.queriesPerDay)}</p>
                      <p className="text-xs text-muted-foreground">Queries/day</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold">{pipeline.avgLatency}</p>
                      <p className="text-xs text-muted-foreground">Avg. latency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Queries */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Queries</h2>
            <Button variant="outline" size="sm">View all →</Button>
          </div>
          
          <Card>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Query</th>
                    <th className="px-6 py-3 text-left font-medium">Pipeline</th>
                    <th className="px-6 py-3 text-left font-medium">Latency</th>
                    <th className="px-6 py-3 text-left font-medium">Tokens</th>
                    <th className="px-6 py-3 text-left font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentQueries.map((query) => (
                    <tr key={query.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium line-clamp-1">{query.query}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {query.pipeline}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${parseInt(query.latency) > 200 ? 'text-orange-500' : 'text-green-500'}`}>
                          {query.latency}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {query.tokens}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {query.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </PageContent>
    </MainLayout>
  )
}