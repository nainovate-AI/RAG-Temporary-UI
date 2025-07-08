'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  Target,
  Gauge,
  Users,
  FileText
} from 'lucide-react'
import { formatNumber, formatDate } from '@/lib/utils'

// Mock data for charts
const queryVolumeData = [
  { day: 'Mon', queries: 6842 },
  { day: 'Tue', queries: 7234 },
  { day: 'Wed', queries: 8012 },
  { day: 'Thu', queries: 7856 },
  { day: 'Fri', queries: 9234 },
  { day: 'Sat', queries: 5467 },
  { day: 'Sun', queries: 4982 },
]

const pipelineMetrics = [
  {
    id: '1',
    name: 'Customer Support RAG v2',
    queries: 20142,
    avgLatency: 98,
    p95Latency: 156,
    successRate: 96.2,
    accuracy: 94.7,
    costPerQuery: 0.012,
    performance: 'excellent',
  },
  {
    id: '2',
    name: 'Technical Documentation',
    queries: 13428,
    avgLatency: 156,
    p95Latency: 234,
    successRate: 94.8,
    accuracy: 92.3,
    costPerQuery: 0.018,
    performance: 'good',
  },
  {
    id: '3',
    name: 'Legal Contract Analysis',
    queries: 11024,
    avgLatency: 201,
    p95Latency: 312,
    successRate: 97.1,
    accuracy: 96.8,
    costPerQuery: 0.025,
    performance: 'good',
  },
  {
    id: '4',
    name: 'Sales Enablement',
    queries: 3298,
    avgLatency: 112,
    p95Latency: 178,
    successRate: 91.3,
    accuracy: 88.9,
    costPerQuery: 0.015,
    performance: 'warning',
  },
]

const latencyDistribution = [
  { range: '0-50ms', count: 8234, percentage: 16.5 },
  { range: '50-100ms', count: 15678, percentage: 31.4 },
  { range: '100-200ms', count: 18234, percentage: 36.5 },
  { range: '200-500ms', count: 6234, percentage: 12.5 },
  { range: '500ms+', count: 1547, percentage: 3.1 },
]

const errorBreakdown = [
  { type: 'Rate Limit', count: 234, percentage: 28.5 },
  { type: 'Timeout', count: 189, percentage: 23.0 },
  { type: 'Invalid Query', count: 156, percentage: 19.0 },
  { type: 'Model Error', count: 123, percentage: 15.0 },
  { type: 'Vector DB', count: 89, percentage: 10.8 },
  { type: 'Other', count: 30, percentage: 3.7 },
]

export default function PerformancePage() {
  const [dateRange, setDateRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('latency')

  const totalQueries = queryVolumeData.reduce((sum, day) => sum + day.queries, 0)
  const avgQueriesPerDay = Math.round(totalQueries / queryVolumeData.length)
  const totalErrors = errorBreakdown.reduce((sum, error) => sum + error.count, 0)
  const overallSuccessRate = ((totalQueries - totalErrors) / totalQueries * 100).toFixed(1)

  return (
    <MainLayout>
      <PageHeader
        title="Performance Analytics"
        description="Monitor and analyze your RAG system performance"
      >
        <div className="flex items-center gap-3">
          <div className="flex bg-muted/30 rounded-lg p-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  dateRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Queries
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalQueries)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑ 18.2%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Latency
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124ms</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↓ 12.5%</span> improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallSuccessRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑ 2.1%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Error Rate
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.6%</div>
              <p className="text-xs text-muted-foreground">
                {totalErrors} errors total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Query Volume Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Query Volume</CardTitle>
                <Badge variant="secondary">{avgQueriesPerDay}/day avg</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                  {queryVolumeData.map((day, index) => {
                    const height = (day.queries / 10000) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative flex-1 flex items-end">
                          <div
                            className="w-full bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer rounded-t"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                              {formatNumber(day.queries)}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latency Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Latency Distribution</CardTitle>
                <Badge variant="secondary">P95: 234ms</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latencyDistribution.map((range) => (
                  <div key={range.range}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{range.range}</span>
                      <span className="font-medium">{formatNumber(range.count)} ({range.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          range.range.includes('+') ? 'bg-red-500' :
                          range.range.startsWith('200') ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${range.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-semibold">45ms</p>
                  <p className="text-xs text-muted-foreground">P50</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">124ms</p>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">234ms</p>
                  <p className="text-xs text-muted-foreground">P95</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pipeline Performance</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <select className="px-3 py-1 text-sm border border-input bg-background rounded-lg">
                  <option>Sort by: Queries</option>
                  <option>Sort by: Latency</option>
                  <option>Sort by: Success Rate</option>
                  <option>Sort by: Cost</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Pipeline</th>
                    <th className="px-4 py-3 text-left font-medium">Queries</th>
                    <th className="px-4 py-3 text-left font-medium">Avg Latency</th>
                    <th className="px-4 py-3 text-left font-medium">P95 Latency</th>
                    <th className="px-4 py-3 text-left font-medium">Success Rate</th>
                    <th className="px-4 py-3 text-left font-medium">Accuracy</th>
                    <th className="px-4 py-3 text-left font-medium">Cost/Query</th>
                    <th className="px-4 py-3 text-left font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pipelineMetrics.map((pipeline) => (
                    <tr key={pipeline.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium">{pipeline.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        {formatNumber(pipeline.queries)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={pipeline.avgLatency < 150 ? 'text-green-500' : 'text-yellow-500'}>
                          {pipeline.avgLatency}ms
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {pipeline.p95Latency}ms
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${pipeline.successRate}%` }}
                            />
                          </div>
                          <span className="text-xs">{pipeline.successRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {pipeline.accuracy}%
                      </td>
                      <td className="px-4 py-4">
                        ${pipeline.costPerQuery}
                      </td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant={
                            pipeline.performance === 'excellent' ? 'success' :
                            pipeline.performance === 'good' ? 'default' :
                            'warning'
                          }
                        >
                          {pipeline.performance}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Error Analysis */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Error Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errorBreakdown.map((error, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-blue-500' :
                        index === 4 ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`} />
                      <span className="text-sm font-medium">{error.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {error.count} ({error.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Errors</span>
                  <span className="font-semibold">{totalErrors}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Query Volume</p>
                      <p className="text-xs text-muted-foreground">Growing steadily</p>
                    </div>
                  </div>
                  <span className="text-green-500 font-semibold">+18.2%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Response Time</p>
                      <p className="text-xs text-muted-foreground">Improving</p>
                    </div>
                  </div>
                  <span className="text-green-500 font-semibold">-12.5%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Error Rate</p>
                      <p className="text-xs text-muted-foreground">Stable</p>
                    </div>
                  </div>
                  <span className="text-yellow-500 font-semibold">~1.6%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Accuracy</p>
                      <p className="text-xs text-muted-foreground">High performance</p>
                    </div>
                  </div>
                  <span className="text-blue-500 font-semibold">93.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </MainLayout>
  )
}