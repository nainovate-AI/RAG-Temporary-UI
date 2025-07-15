'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { 
  FileText, 
  Link2, 
  Search, 
  Zap,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function InferencerDashboardPage() {
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
      query: 'Debug null pointer exception in checkout flow',
      pipeline: 'Technical Docs',
      latency: '156ms',
      tokens: 512,
      time: '12 min ago',
    },
  ]

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.change > 0 ? (
                    <span className="text-green-600">+{stat.change}%</span>
                  ) : stat.change < 0 ? (
                    <span className="text-red-600">{stat.change}%</span>
                  ) : (
                    <span>No change</span>
                  )}{' '}
                  from last week
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Active Pipelines section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Active Pipelines</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid gap-4">
          {activePipelines.map((pipeline) => (
            <Card key={pipeline.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{pipeline.name}</h3>
                    <p className="text-sm text-muted-foreground">{pipeline.type}</p>
                  </div>
                  <StatusBadge status={pipeline.status} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="font-medium">{formatNumber(pipeline.documents)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Queries/day</p>
                    <p className="font-medium">{formatNumber(pipeline.queriesPerDay)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Latency</p>
                    <p className="font-medium">{pipeline.avgLatency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Queries section */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Queries</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentQueries.map((query) => (
                <div key={query.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium line-clamp-1">{query.query}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{query.pipeline}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {query.latency}
                        </span>
                        <span>•</span>
                        <span>{query.tokens} tokens</span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{query.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}