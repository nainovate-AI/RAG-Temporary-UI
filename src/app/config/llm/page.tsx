'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { 
  Brain,
  Plus,
  Settings,
  Activity,
  DollarSign,
  Zap,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  TrendingUp,
  TrendingDown,
  Info,
  Link2,
  BarChart3,
  Clock,
  Hash,
  Sparkles,
  Globe,
  Shield,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

// Provider configuration
const providerInfo = {
  openai: {
    name: 'OpenAI',
    icon: '🤖',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    features: ['GPT-4 Turbo', 'Function calling', 'Vision', 'JSON mode', 'Assistants API'],
  },
  anthropic: {
    name: 'Anthropic',
    icon: '🧠',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    features: ['Claude 3 Opus', '200K context', 'Constitutional AI', 'Low hallucination'],
  },
  cohere: {
    name: 'Cohere',
    icon: '🎯',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    features: ['Command R+', 'Multilingual', 'RAG optimized', 'Grounded generation'],
  },
  google: {
    name: 'Google',
    icon: '🌐',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    features: ['Gemini Pro', 'Gemini Ultra', 'Multimodal', 'Long context'],
  },
  local: {
    name: 'Local Models',
    icon: '💻',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    features: ['Ollama', 'vLLM', 'Privacy-first', 'No API costs'],
  }
}

// Mock data with enhanced information
const mockProviders = [
  {
    id: 'openai-prod',
    provider: 'openai',
    name: 'OpenAI Production',
    status: 'active' as const,
    models: [
      { 
        id: 'gpt-4-turbo-preview', 
        name: 'GPT-4 Turbo', 
        contextWindow: 128000, 
        costPer1kTokens: { input: 0.01, output: 0.03 },
        available: true,
        performance: { latency: 1.2, reliability: 99.5 },
        usageByPipeline: [
          { pipelineId: '1', pipelineName: 'Customer Support', percentage: 45 },
          { pipelineId: '2', pipelineName: 'Technical Docs', percentage: 30 },
          { pipelineId: '3', pipelineName: 'Legal Analysis', percentage: 25 }
        ]
      },
      { 
        id: 'gpt-3.5-turbo', 
        name: 'GPT-3.5 Turbo', 
        contextWindow: 16384, 
        costPer1kTokens: { input: 0.0005, output: 0.0015 },
        available: true,
        performance: { latency: 0.8, reliability: 99.8 },
        usageByPipeline: [
          { pipelineId: '1', pipelineName: 'Customer Support', percentage: 80 },
          { pipelineId: '4', pipelineName: 'Quick Queries', percentage: 20 }
        ]
      },
    ],
    usage: {
      tokensToday: 2456789,
      costToday: 45.67,
      costTrend: 12.5, // percentage change
      requestsToday: 12345,
      avgLatency: 1.1,
      errorRate: 0.02,
      peakHour: 14, // 2 PM
    },
    limits: {
      rateLimit: 10000, // requests per minute
      dailyTokenLimit: 10000000,
      monthlyBudget: 2000,
    },
    config: {
      apiKey: 'sk-...',
      organization: 'org-...',
      maxRetries: 3,
      timeout: 30,
    },
    lastUsed: '2024-01-15T11:30:00Z',
  },
  {
    id: 'anthropic-main',
    provider: 'anthropic',
    name: 'Anthropic Claude',
    status: 'active' as const,
    models: [
      { 
        id: 'claude-3-opus', 
        name: 'Claude 3 Opus', 
        contextWindow: 200000, 
        costPer1kTokens: { input: 0.015, output: 0.075 },
        available: true,
        performance: { latency: 2.1, reliability: 99.2 },
        usageByPipeline: [
          { pipelineId: '3', pipelineName: 'Legal Analysis', percentage: 60 },
          { pipelineId: '5', pipelineName: 'Research Assistant', percentage: 40 }
        ]
      },
      { 
        id: 'claude-3-sonnet', 
        name: 'Claude 3 Sonnet', 
        contextWindow: 200000, 
        costPer1kTokens: { input: 0.003, output: 0.015 },
        available: true,
        performance: { latency: 1.5, reliability: 99.4 },
        usageByPipeline: [
          { pipelineId: '2', pipelineName: 'Technical Docs', percentage: 100 }
        ]
      },
    ],
    usage: {
      tokensToday: 892345,
      costToday: 28.90,
      costTrend: -5.2,
      requestsToday: 4567,
      avgLatency: 1.8,
      errorRate: 0.01,
      peakHour: 10,
    },
    limits: {
      rateLimit: 1000,
      dailyTokenLimit: 5000000,
      monthlyBudget: 1000,
    },
    config: {
      apiKey: 'sk-ant-...',
      maxRetries: 2,
      timeout: 60,
    },
    lastUsed: '2024-01-15T11:25:00Z',
  },
  {
    id: 'local-ollama',
    provider: 'local',
    name: 'Ollama Local',
    status: 'degraded' as const,
    models: [
      { 
        id: 'mixtral-8x7b', 
        name: 'Mixtral 8x7B', 
        contextWindow: 32768, 
        costPer1kTokens: { input: 0, output: 0 },
        available: true,
        performance: { latency: 3.5, reliability: 95.0 },
        usageByPipeline: [
          { pipelineId: '6', pipelineName: 'Development', percentage: 100 }
        ]
      },
      { 
        id: 'llama2-70b', 
        name: 'Llama 2 70B', 
        contextWindow: 4096, 
        costPer1kTokens: { input: 0, output: 0 },
        available: false,
        performance: { latency: 5.2, reliability: 92.0 },
        usageByPipeline: []
      },
    ],
    usage: {
      tokensToday: 234567,
      costToday: 0,
      costTrend: 0,
      requestsToday: 1234,
      avgLatency: 4.2,
      errorRate: 0.05,
      peakHour: 16,
    },
    limits: {
      rateLimit: 100,
      dailyTokenLimit: -1, // unlimited
      monthlyBudget: 0,
    },
    config: {
      endpoint: 'http://localhost:11434',
      timeout: 120,
    },
    lastUsed: '2024-01-15T10:45:00Z',
  }
]

export default function EnhancedLLMProvidersPage() {
  const [providers, setProviders] = useState(mockProviders)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  
  // New provider form state
  const [newProvider, setNewProvider] = useState({
    name: '',
    provider: '',
    apiKey: '',
    endpoint: '',
    organization: '',
    rateLimit: '',
    monthlyBudget: '',
  })

  // Calculate totals
  const totalStats = {
    totalProviders: providers.length,
    activeProviders: providers.filter(p => p.status === 'active').length,
    totalCostToday: providers.reduce((acc, p) => acc + p.usage.costToday, 0),
    totalTokensToday: providers.reduce((acc, p) => acc + p.usage.tokensToday, 0),
    totalRequests: providers.reduce((acc, p) => acc + p.usage.requestsToday, 0),
    avgLatency: providers.reduce((acc, p) => acc + p.usage.avgLatency, 0) / providers.length,
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-500/10'
      case 'degraded':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'error':
        return 'text-red-500 bg-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="h-3 w-3 text-red-500" />
    if (trend < 0) return <ArrowDown className="h-3 w-3 text-green-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  const handleTestConnection = async () => {
    setTestStatus('testing')
    setTimeout(() => {
      setTestStatus('success')
    }, 2000)
  }

  const handleSaveProvider = () => {
    console.log('Saving provider:', newProvider)
    setShowAddModal(false)
    // Reset form
    setNewProvider({
      name: '',
      provider: '',
      apiKey: '',
      endpoint: '',
      organization: '',
      rateLimit: '',
      monthlyBudget: '',
    })
    setSelectedProvider('')
    setTestStatus('idle')
  }

  return (
    <MainLayout>
      <PageHeader
        title="LLM Providers"
        description="Manage language model providers and monitor usage"
      >
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Providers</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.activeProviders}/{totalStats.totalProviders}</div>
              <p className="text-xs text-muted-foreground">Active providers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Today</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStats.totalCostToday.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalStats.totalTokensToday)}</div>
              <p className="text-xs text-muted-foreground">Today's usage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalStats.totalRequests)}</div>
              <p className="text-xs text-muted-foreground">API calls today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.avgLatency.toFixed(1)}s</div>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">Overall reliability</p>
            </CardContent>
          </Card>
        </div>

        {/* Providers List */}
        <div className="space-y-4">
          {providers.map((provider) => {
            const info = providerInfo[provider.provider as keyof typeof providerInfo]
            const isExpanded = expandedProvider === provider.id

            return (
              <Card key={provider.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-lg",
                        info.bgColor
                      )}>
                        <span className="text-2xl">{info.icon}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <CardTitle>{provider.name}</CardTitle>
                          <Badge className={getStatusColor(provider.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(provider.status)}
                              {provider.status}
                            </span>
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <span>{info.name}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{provider.models.length} models</span>
                          <span className="text-muted-foreground">•</span>
                          <span>Last used {new Date(provider.lastUsed).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedProvider(isExpanded ? null : provider.id)}
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        <ChevronRight className={cn(
                          "ml-2 h-4 w-4 transition-transform",
                          isExpanded && "rotate-90"
                        )} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Provider Metrics */}
                  <div className="grid grid-cols-6 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Cost Today</p>
                      <p className="font-medium flex items-center gap-1">
                        ${provider.usage.costToday.toFixed(2)}
                        {getTrendIcon(provider.usage.costTrend)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tokens</p>
                      <p className="font-medium">{formatNumber(provider.usage.tokensToday)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Requests</p>
                      <p className="font-medium">{formatNumber(provider.usage.requestsToday)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Latency</p>
                      <p className="font-medium">{provider.usage.avgLatency}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Error Rate</p>
                      <p className="font-medium">{(provider.usage.errorRate * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Peak Hour</p>
                      <p className="font-medium">{provider.usage.peakHour}:00</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Details */}
                {isExpanded && (
                  <CardContent className="pt-0">
                    {/* Models List */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium mb-3">Available Models</h4>
                      {provider.models.map((model) => (
                        <div
                          key={model.id}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{model.name}</span>
                              <Badge variant={model.available ? 'secondary' : 'outline'}>
                                {model.available ? 'Available' : 'Unavailable'}
                              </Badge>
                              <Badge variant="outline">
                                {model.contextWindow.toLocaleString()} tokens
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Input: ${model.costPer1kTokens.input}/1K
                              </span>
                              <span className="text-muted-foreground">
                                Output: ${model.costPer1kTokens.output}/1K
                              </span>
                            </div>
                          </div>

                          {/* Model Performance */}
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Zap className="h-3 w-3 text-muted-foreground" />
                              <span>Latency: {model.performance.latency}s</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                              <span>Reliability: {model.performance.reliability}%</span>
                            </div>
                          </div>

                          {/* Usage by Pipeline */}
                          {model.usageByPipeline.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground">Usage by Pipeline</p>
                              <div className="space-y-1">
                                {model.usageByPipeline.map((usage) => (
                                  <div key={usage.pipelineId} className="flex items-center gap-2">
                                    <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                                      <div
                                        className="h-full bg-primary transition-all"
                                        style={{ width: `${usage.percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground w-32">
                                      {usage.pipelineName}
                                    </span>
                                    <span className="text-xs font-medium w-10 text-right">
                                      {usage.percentage}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Limits & Configuration */}
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Limits & Quotas</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rate Limit</span>
                            <span>{provider.limits.rateLimit.toLocaleString()} req/min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Daily Token Limit</span>
                            <span>
                              {provider.limits.dailyTokenLimit === -1 
                                ? 'Unlimited' 
                                : formatNumber(provider.limits.dailyTokenLimit)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly Budget</span>
                            <span>${provider.limits.monthlyBudget.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Configuration</h4>
                        <div className="flex flex-wrap gap-2">
                          {provider.config.apiKey && (
                            <Badge variant="outline">
                              <Shield className="mr-1 h-3 w-3" />
                              API Key Configured
                            </Badge>
                          )}
                          {provider.config.organization && (
                            <Badge variant="outline">
                              <Globe className="mr-1 h-3 w-3" />
                              Organization Set
                            </Badge>
                          )}
                          {provider.config.endpoint && (
                            <Badge variant="outline">
                              <Link2 className="mr-1 h-3 w-3" />
                              Custom Endpoint
                            </Badge>
                          )}
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            {provider.config.timeout}s timeout
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Provider Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {info.features.map((feature) => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Add Provider Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add LLM Provider</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAddModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Provider Selection */}
                  <div className="space-y-2">
                    <Label>Provider Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(providerInfo).map(([key, info]) => (
                        <div
                          key={key}
                          className={cn(
                            "border rounded-lg p-3 cursor-pointer transition-all",
                            selectedProvider === key
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                          onClick={() => setSelectedProvider(key)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{info.icon}</span>
                            <span className="font-medium">{info.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedProvider && (
                    <>
                      {/* Provider Configuration */}
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="provider-name">Configuration Name</Label>
                          <Input
                            id="provider-name"
                            placeholder="e.g., Production GPT-4"
                            value={newProvider.name}
                            onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                          />
                        </div>

                        {selectedProvider !== 'local' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="api-key">API Key</Label>
                              <Input
                                id="api-key"
                                type="password"
                                placeholder={`Enter your ${providerInfo[selectedProvider as keyof typeof providerInfo].name} API key`}
                                value={newProvider.apiKey}
                                onChange={(e) => setNewProvider({ ...newProvider, apiKey: e.target.value })}
                              />
                            </div>

                            {selectedProvider === 'openai' && (
                              <div className="space-y-2">
                                <Label htmlFor="organization">Organization ID (Optional)</Label>
                                <Input
                                  id="organization"
                                  placeholder="org-..."
                                  value={newProvider.organization}
                                  onChange={(e) => setNewProvider({ ...newProvider, organization: e.target.value })}
                                />
                              </div>
                            )}
                          </>
                        )}

                        {selectedProvider === 'local' && (
                          <div className="space-y-2">
                            <Label htmlFor="endpoint">Endpoint URL</Label>
                            <Input
                              id="endpoint"
                              placeholder="e.g., http://localhost:11434"
                              value={newProvider.endpoint}
                              onChange={(e) => setNewProvider({ ...newProvider, endpoint: e.target.value })}
                            />
                          </div>
                        )}

                        {/* Limits Configuration */}
                        <div className="space-y-4 pt-4 border-t">
                          <h4 className="text-sm font-medium">Limits & Quotas</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="rate-limit">Rate Limit (req/min)</Label>
                              <Input
                                id="rate-limit"
                                type="number"
                                placeholder="e.g., 1000"
                                value={newProvider.rateLimit}
                                onChange={(e) => setNewProvider({ ...newProvider, rateLimit: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="monthly-budget">Monthly Budget ($)</Label>
                              <Input
                                id="monthly-budget"
                                type="number"
                                placeholder="e.g., 1000"
                                value={newProvider.monthlyBudget}
                                onChange={(e) => setNewProvider({ ...newProvider, monthlyBudget: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Test Connection */}
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium">Test Connection</p>
                              <p className="text-xs text-muted-foreground">
                                Verify API key and settings
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={handleTestConnection}
                              disabled={testStatus === 'testing'}
                            >
                              {testStatus === 'testing' && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {testStatus === 'success' && (
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                              )}
                              {testStatus === 'error' && (
                                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              {testStatus === 'idle' ? 'Test' : 
                               testStatus === 'testing' ? 'Testing...' :
                               testStatus === 'success' ? 'Connected' : 'Failed'}
                            </Button>
                          </div>
                          {testStatus === 'success' && (
                            <p className="text-xs text-green-600 mt-2">
                              Successfully connected and verified models
                            </p>
                          )}
                          {testStatus === 'error' && (
                            <p className="text-xs text-red-600 mt-2">
                              Failed to connect. Please check your API key.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setShowAddModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProvider}
                          disabled={
                            !newProvider.name || 
                            (selectedProvider !== 'local' && !newProvider.apiKey) ||
                            (selectedProvider === 'local' && !newProvider.endpoint) ||
                            testStatus !== 'success'
                          }
                        >
                          Add Provider
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </PageContent>
    </MainLayout>
  )
}