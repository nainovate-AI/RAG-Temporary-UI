'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Target,
  Plus,
  Settings,
  Trash2,
  CheckCircle,
  AlertCircle,
  Zap,
  DollarSign,
  TrendingUp,
  Globe,
  Lock,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Gauge,
  Clock,
  Activity,
  Info
} from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'

interface EmbeddingProvider {
  id: string
  name: string
  provider: 'openai' | 'cohere' | 'voyage' | 'huggingface' | 'local'
  model: string
  status: 'active' | 'inactive' | 'error' | 'rate_limited'
  dimensions: number
  maxInputTokens: number
  performance: {
    avgLatency: number
    throughput: number // embeddings per second
    successRate: number
  }
  usage: {
    embeddingsToday: number
    tokensProcessed: number
    costToday: number
    rateLimit: number
    rateLimitRemaining: number
  }
  config: {
    apiKey?: string
    endpoint?: string
    batchSize?: number
    maxRetries?: number
  }
  lastUsed: string
}

const mockEmbeddingProviders: EmbeddingProvider[] = [
  {
    id: '1',
    name: 'OpenAI Ada-002',
    provider: 'openai',
    model: 'text-embedding-ada-002',
    status: 'active',
    dimensions: 1536,
    maxInputTokens: 8191,
    performance: {
      avgLatency: 124,
      throughput: 450,
      successRate: 99.8,
    },
    usage: {
      embeddingsToday: 45892,
      tokensProcessed: 12847000,
      costToday: 5.14,
      rateLimit: 1000000,
      rateLimitRemaining: 954108,
    },
    config: {
      apiKey: 'sk-proj-...',
      batchSize: 100,
      maxRetries: 3,
    },
    lastUsed: '2024-01-15T11:45:00Z',
  },
  {
    id: '2',
    name: 'Cohere Embed v3',
    provider: 'cohere',
    model: 'embed-english-v3.0',
    status: 'active',
    dimensions: 1024,
    maxInputTokens: 512,
    performance: {
      avgLatency: 98,
      throughput: 620,
      successRate: 99.5,
    },
    usage: {
      embeddingsToday: 23456,
      tokensProcessed: 6789000,
      costToday: 2.71,
      rateLimit: 500000,
      rateLimitRemaining: 476544,
    },
    config: {
      apiKey: 'co-...',
      batchSize: 96,
      maxRetries: 3,
    },
    lastUsed: '2024-01-15T11:30:00Z',
  },
  {
    id: '3',
    name: 'BGE Large EN',
    provider: 'huggingface',
    model: 'BAAI/bge-large-en-v1.5',
    status: 'active',
    dimensions: 1024,
    maxInputTokens: 512,
    performance: {
      avgLatency: 156,
      throughput: 320,
      successRate: 98.2,
    },
    usage: {
      embeddingsToday: 18234,
      tokensProcessed: 4567000,
      costToday: 0.91,
      rateLimit: 100000,
      rateLimitRemaining: 81766,
    },
    config: {
      apiKey: 'hf-...',
      endpoint: 'https://api-inference.huggingface.co',
      batchSize: 32,
      maxRetries: 2,
    },
    lastUsed: '2024-01-15T10:20:00Z',
  },
  {
    id: '4',
    name: 'Local Sentence Transformers',
    provider: 'local',
    model: 'all-MiniLM-L6-v2',
    status: 'active',
    dimensions: 384,
    maxInputTokens: 256,
    performance: {
      avgLatency: 45,
      throughput: 1200,
      successRate: 100,
    },
    usage: {
      embeddingsToday: 67890,
      tokensProcessed: 8901234,
      costToday: 0,
      rateLimit: -1, // Unlimited
      rateLimitRemaining: -1,
    },
    config: {
      endpoint: 'http://localhost:8080',
      batchSize: 64,
    },
    lastUsed: '2024-01-15T11:50:00Z',
  },
  {
    id: '5',
    name: 'Voyage AI',
    provider: 'voyage',
    model: 'voyage-02',
    status: 'rate_limited',
    dimensions: 1024,
    maxInputTokens: 4096,
    performance: {
      avgLatency: 134,
      throughput: 380,
      successRate: 97.8,
    },
    usage: {
      embeddingsToday: 10000,
      tokensProcessed: 2500000,
      costToday: 1.25,
      rateLimit: 10000,
      rateLimitRemaining: 0,
    },
    config: {
      apiKey: 'vo-...',
      batchSize: 50,
      maxRetries: 3,
    },
    lastUsed: '2024-01-15T09:00:00Z',
  },
]

const providerInfo = {
  openai: {
    name: 'OpenAI',
    icon: '🎯',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    features: ['Industry standard', 'High quality', 'Fast', 'Multilingual'],
  },
  cohere: {
    name: 'Cohere',
    icon: '🌊',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    features: ['Compress API', 'Multi-lingual', 'Domain-specific', 'Fast inference'],
  },
  voyage: {
    name: 'Voyage AI',
    icon: '🚀',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    features: ['Domain-specific', 'Finance optimized', 'Code optimized', 'Legal optimized'],
  },
  huggingface: {
    name: 'HuggingFace',
    icon: '🤗',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    features: ['Open models', 'Community driven', 'Customizable', 'Self-hostable'],
  },
  local: {
    name: 'Local Models',
    icon: '💻',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    features: ['Privacy-first', 'No API costs', 'Low latency', 'Offline capable'],
  },
}

export default function EmbeddingsPage() {
  const [providers] = useState(mockEmbeddingProviders)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKey(prev => ({ ...prev, [providerId]: !prev[providerId] }))
  }

  const calculateTotalEmbeddings = () => {
    return providers.reduce((sum, provider) => sum + provider.usage.embeddingsToday, 0)
  }

  const calculateTotalCost = () => {
    return providers.reduce((sum, provider) => sum + provider.usage.costToday, 0)
  }

  const calculateAvgLatency = () => {
    const activeProviders = providers.filter(p => p.status === 'active')
    if (activeProviders.length === 0) return 0
    const totalLatency = activeProviders.reduce((sum, p) => sum + p.performance.avgLatency, 0)
    return Math.round(totalLatency / activeProviders.length)
  }

  return (
    <MainLayout>
      <PageHeader
        title="Embedding Configuration"
        description="Manage embedding models for document vectorization"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </PageHeader>

      <PageContent>
        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg mb-8">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-primary mb-1">Embedding Model Selection Tips</p>
            <p className="text-muted-foreground">
              Choose embedding models based on your needs: OpenAI Ada-002 for general purpose, 
              domain-specific models for specialized content, or local models for privacy. 
              Higher dimensions typically mean better quality but increased storage costs.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{formatNumber(calculateTotalEmbeddings())}</p>
                  <p className="text-sm text-muted-foreground">Embeddings Today</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{calculateAvgLatency()}ms</p>
                  <p className="text-sm text-muted-foreground">Avg Latency</p>
                </div>
                <Gauge className="h-8 w-8 text-yellow-500/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">99.1%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${calculateTotalCost().toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Cost Today</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embedding Providers List */}
        <div className="grid gap-6">
          {providers.map((provider) => {
            const info = providerInfo[provider.provider]
            const isSelected = selectedProvider === provider.id
            const rateUsagePercent = provider.usage.rateLimit > 0 
              ? ((provider.usage.rateLimit - provider.usage.rateLimitRemaining) / provider.usage.rateLimit) * 100
              : 0
            
            return (
              <Card 
                key={provider.id} 
                className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${info.bgColor}`}>
                        <span className="text-2xl">{info.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {provider.name}
                          {provider.provider === 'local' && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {provider.model} • {provider.dimensions} dimensions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={provider.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedProvider(isSelected ? null : provider.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xl font-semibold">{provider.performance.avgLatency}ms</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Avg Latency</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xl font-semibold">{provider.performance.throughput}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Emb/sec</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xl font-semibold">{provider.performance.successRate}%</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Success</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <p className="text-xl font-semibold">${provider.usage.costToday.toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Cost Today</p>
                    </div>
                  </div>

                  {/* Rate Limit Progress */}
                  {provider.usage.rateLimit > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Rate Limit Usage</span>
                        <span className="font-medium">
                          {formatNumber(provider.usage.rateLimit - provider.usage.rateLimitRemaining)} / {formatNumber(provider.usage.rateLimit)}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            rateUsagePercent > 90 ? 'bg-red-500' : 
                            rateUsagePercent > 70 ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(rateUsagePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Usage Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-semibold">{formatNumber(provider.usage.embeddingsToday)}</p>
                      <p className="text-xs text-muted-foreground">Embeddings</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-semibold">{formatNumber(provider.usage.tokensProcessed)}</p>
                      <p className="text-xs text-muted-foreground">Tokens</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-lg font-semibold">{provider.maxInputTokens}</p>
                      <p className="text-xs text-muted-foreground">Max Input</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {info.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Expanded Configuration */}
                  {isSelected && (
                    <div className="pt-4 border-t border-border space-y-4">
                      {provider.config.endpoint && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Endpoint</label>
                          <div className="flex gap-2">
                            <Input 
                              value={provider.config.endpoint} 
                              readOnly 
                              className="font-mono text-sm"
                            />
                            <Button variant="outline" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {provider.config.apiKey && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">API Key</label>
                          <div className="flex gap-2">
                            <Input 
                              type={showApiKey[provider.id] ? "text" : "password"}
                              value={provider.config.apiKey} 
                              readOnly 
                              className="font-mono text-sm"
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => toggleApiKeyVisibility(provider.id)}
                            >
                              {showApiKey[provider.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="outline" size="icon">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Batch Size</label>
                          <Input 
                            type="number"
                            value={provider.config.batchSize || 32} 
                            readOnly 
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Max Retries</label>
                          <Input 
                            type="number"
                            value={provider.config.maxRetries || 3} 
                            readOnly 
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button variant="outline">
                          <Zap className="mr-2 h-4 w-4" />
                          Test Embedding
                        </Button>
                        <Button variant="outline">
                          <Activity className="mr-2 h-4 w-4" />
                          Benchmark
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Docs
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last used: {formatDate(provider.lastUsed)}
                    </span>
                    <span>
                      Batch: {provider.config.batchSize || 32} embeddings
                    </span>
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