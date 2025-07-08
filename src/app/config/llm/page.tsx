'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Brain,
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
  Sparkles,
  Gauge,
  Clock
} from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'

interface LLMProvider {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'cohere' | 'google' | 'local'
  status: 'active' | 'inactive' | 'error' | 'quota_exceeded'
  models: Array<{
    id: string
    name: string
    contextWindow: number
    costPer1kTokens: number
    available: boolean
  }>
  usage: {
    tokensUsed: number
    tokensLimit: number
    costToday: number
    requestsToday: number
  }
  config: {
    apiKey?: string
    endpoint?: string
    organization?: string
    maxRetries?: number
    timeout?: number
  }
  lastUsed: string
}

const mockProviders: LLMProvider[] = [
  {
    id: '1',
    name: 'OpenAI Production',
    provider: 'openai',
    status: 'active',
    models: [
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextWindow: 128000, costPer1kTokens: 0.01, available: true },
      { id: 'gpt-4', name: 'GPT-4', contextWindow: 8192, costPer1kTokens: 0.03, available: true },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', contextWindow: 16385, costPer1kTokens: 0.001, available: true },
    ],
    usage: {
      tokensUsed: 2847000,
      tokensLimit: 5000000,
      costToday: 45.32,
      requestsToday: 1234,
    },
    config: {
      apiKey: 'sk-proj-...',
      organization: 'org-ABC123',
      maxRetries: 3,
      timeout: 30,
    },
    lastUsed: '2024-01-15T11:30:00Z',
  },
  {
    id: '2',
    name: 'Anthropic Claude',
    provider: 'anthropic',
    status: 'active',
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', contextWindow: 200000, costPer1kTokens: 0.015, available: true },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', contextWindow: 200000, costPer1kTokens: 0.003, available: true },
      { id: 'claude-2.1', name: 'Claude 2.1', contextWindow: 100000, costPer1kTokens: 0.008, available: false },
    ],
    usage: {
      tokensUsed: 1523000,
      tokensLimit: 3000000,
      costToday: 28.94,
      requestsToday: 567,
    },
    config: {
      apiKey: 'sk-ant-...',
      maxRetries: 3,
      timeout: 60,
    },
    lastUsed: '2024-01-15T10:45:00Z',
  },
  {
    id: '3',
    name: 'Local Ollama',
    provider: 'local',
    status: 'active',
    models: [
      { id: 'llama3-70b', name: 'Llama 3 70B', contextWindow: 8000, costPer1kTokens: 0, available: true },
      { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', contextWindow: 32000, costPer1kTokens: 0, available: true },
      { id: 'codellama-34b', name: 'Code Llama 34B', contextWindow: 4096, costPer1kTokens: 0, available: true },
    ],
    usage: {
      tokensUsed: 892000,
      tokensLimit: -1, // Unlimited
      costToday: 0,
      requestsToday: 234,
    },
    config: {
      endpoint: 'http://localhost:11434',
      timeout: 120,
    },
    lastUsed: '2024-01-15T09:20:00Z',
  },
  {
    id: '4',
    name: 'Google Vertex AI',
    provider: 'google',
    status: 'quota_exceeded',
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro', contextWindow: 32000, costPer1kTokens: 0.00125, available: false },
      { id: 'palm-2', name: 'PaLM 2', contextWindow: 8192, costPer1kTokens: 0.002, available: false },
    ],
    usage: {
      tokensUsed: 1000000,
      tokensLimit: 1000000,
      costToday: 12.50,
      requestsToday: 456,
    },
    config: {
      apiKey: 'AIza...',
      maxRetries: 2,
      timeout: 30,
    },
    lastUsed: '2024-01-15T08:00:00Z',
  },
]

const providerInfo = {
  openai: {
    name: 'OpenAI',
    icon: '🤖',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    features: ['GPT-4 Turbo', 'Function calling', 'Vision', 'JSON mode'],
  },
  anthropic: {
    name: 'Anthropic',
    icon: '🧠',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    features: ['200K context', 'Constitutional AI', 'Low hallucination', 'Code generation'],
  },
  cohere: {
    name: 'Cohere',
    icon: '🎯',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    features: ['Command R+', 'Multilingual', 'RAG optimized', 'Embeddings'],
  },
  google: {
    name: 'Google',
    icon: '🌐',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    features: ['Gemini Pro', 'Multimodal', 'Long context', 'Safety filters'],
  },
  local: {
    name: 'Local Models',
    icon: '💻',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    features: ['Privacy-first', 'No API costs', 'Offline capable', 'Custom models'],
  },
}

export default function LLMProvidersPage() {
  const [providers] = useState(mockProviders)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({})

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKey(prev => ({ ...prev, [providerId]: !prev[providerId] }))
  }

  const toggleModelsExpanded = (providerId: string) => {
    setExpandedModels(prev => ({ ...prev, [providerId]: !prev[providerId] }))
  }

  const calculateTotalCost = () => {
    return providers.reduce((sum, provider) => sum + provider.usage.costToday, 0)
  }

  const calculateTotalRequests = () => {
    return providers.reduce((sum, provider) => sum + provider.usage.requestsToday, 0)
  }

  return (
    <MainLayout>
      <PageHeader
        title="LLM Provider Configuration"
        description="Manage language model providers and API keys"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{providers.length}</p>
                  <p className="text-sm text-muted-foreground">Providers</p>
                </div>
                <Brain className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {providers.reduce((sum, p) => sum + p.models.filter(m => m.available).length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Models</p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-500/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{formatNumber(calculateTotalRequests())}</p>
                  <p className="text-sm text-muted-foreground">Requests Today</p>
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

        {/* Providers List */}
        <div className="grid gap-6">
          {providers.map((provider) => {
            const info = providerInfo[provider.provider]
            const isSelected = selectedProvider === provider.id
            const isExpanded = expandedModels[provider.id]
            const usagePercent = provider.usage.tokensLimit > 0 
              ? (provider.usage.tokensUsed / provider.usage.tokensLimit) * 100
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
                          {info.name} • {provider.models.length} models available
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
                  {/* Usage Stats */}
                  <div className="space-y-4">
                    {/* Token Usage Progress */}
                    {provider.usage.tokensLimit > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Token Usage</span>
                          <span className="font-medium">
                            {formatNumber(provider.usage.tokensUsed)} / {formatNumber(provider.usage.tokensLimit)}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              usagePercent > 90 ? 'bg-red-500' : 
                              usagePercent > 70 ? 'bg-yellow-500' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xl font-semibold">{formatNumber(provider.usage.requestsToday)}</p>
                        <p className="text-xs text-muted-foreground">Requests</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-semibold">${provider.usage.costToday.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Cost Today</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-semibold">
                          {provider.config.timeout || 30}s
                        </p>
                        <p className="text-xs text-muted-foreground">Timeout</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {info.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Models */}
                    <div>
                      <button
                        onClick={() => toggleModelsExpanded(provider.id)}
                        className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                      >
                        <Sparkles className="h-4 w-4" />
                        Available Models ({provider.models.filter(m => m.available).length})
                        <span className="text-muted-foreground ml-auto">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-3 space-y-2">
                          {provider.models.map((model) => (
                            <div 
                              key={model.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                model.available 
                                  ? 'border-border bg-background' 
                                  : 'border-border/50 bg-muted/30 opacity-60'
                              }`}
                            >
                              <div>
                                <p className="font-medium text-sm">{model.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatNumber(model.contextWindow)} tokens • ${model.costPer1kTokens}/1K
                                </p>
                              </div>
                              <Badge variant={model.available ? "success" : "secondary"}>
                                {model.available ? "Available" : "Disabled"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
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
                            <label className="text-sm font-medium mb-2 block">Max Retries</label>
                            <Input 
                              type="number"
                              value={provider.config.maxRetries || 3} 
                              readOnly 
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Timeout (seconds)</label>
                            <Input 
                              type="number"
                              value={provider.config.timeout || 30} 
                              readOnly 
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button variant="outline">
                            <Zap className="mr-2 h-4 w-4" />
                            Test Connection
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
                      {provider.config.organization && (
                        <span>Org: {provider.config.organization}</span>
                      )}
                    </div>
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