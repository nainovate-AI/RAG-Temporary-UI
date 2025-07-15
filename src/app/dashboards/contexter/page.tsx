'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { 
  FileText, 
  Database,
  Brain,
  HardDrive,
  TrendingUp,
  Clock,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react'
import { formatNumber, formatBytes, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function ContexterDashboardPage() {
  // Stats data
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
      title: 'Vector Stores',
      value: 5,
      change: 0,
      icon: Database,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Embeddings',
      value: '2.8M',
      change: 12,
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Storage Used',
      value: '4.2GB',
      change: 8,
      icon: HardDrive,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  // Document collections data
  const collections = [
    {
      id: '1',
      name: 'Customer Support Knowledge Base',
      documentCount: 5432,
      totalChunks: 48291,
      size: 1287364782,
      status: 'ready' as const,
      lastUpdated: '2024-01-15T10:30:00Z',
      vectorStore: 'Qdrant',
    },
    {
      id: '2',
      name: 'Product Documentation',
      documentCount: 3218,
      totalChunks: 31057,
      size: 892734521,
      status: 'processing' as const,
      lastUpdated: '2024-01-14T15:45:00Z',
      vectorStore: 'Pinecone',
    },
    {
      id: '3',
      name: 'Legal Contracts',
      documentCount: 892,
      totalChunks: 12847,
      size: 456123789,
      status: 'ready' as const,
      lastUpdated: '2024-01-13T09:20:00Z',
      vectorStore: 'Qdrant',
    },
  ]

  // Recent ingestion jobs
  const recentJobs = [
    {
      id: '1',
      name: 'Q1 2024 Reports',
      documents: 45,
      status: 'completed' as const,
      startTime: '2024-01-15T14:30:00Z',
      duration: '12m 34s',
    },
    {
      id: '2',
      name: 'Product Release Notes',
      documents: 12,
      status: 'processing' as const,
      startTime: '2024-01-15T15:00:00Z',
      progress: 67,
    },
    {
      id: '3',
      name: 'Support FAQs Update',
      documents: 156,
      status: 'failed' as const,
      startTime: '2024-01-15T13:00:00Z',
      error: 'Token limit exceeded',
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

      {/* Document Collections */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Document Collections</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid gap-4">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(collection.documentCount)} documents • {formatNumber(collection.totalChunks)} chunks • {formatBytes(collection.size)}
                    </p>
                  </div>
                  <StatusBadge status={collection.status} />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      {collection.vectorStore}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated {formatDate(collection.lastUpdated)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Ingestion Jobs */}
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Ingestion Jobs</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{job.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.documents} documents • Started {formatDate(job.startTime)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {job.status === 'processing' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{job.progress}%</span>
                        </div>
                      ) : job.status === 'failed' ? (
                        <span className="text-sm text-destructive">{job.error}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Duration: {job.duration}</span>
                      )}
                      <StatusBadge status={job.status} />
                    </div>
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