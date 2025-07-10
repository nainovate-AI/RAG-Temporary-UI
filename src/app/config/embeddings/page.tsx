'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Brain,
  Plus,
  Settings,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Loader2,
  Key,
  Hash,
  Zap,
  X,
  Save,
  TestTube
} from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Mock data
const embeddingProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    models: [
      {
        id: 'text-embedding-ada-002',
        name: 'text-embedding-ada-002',
        dimensions: 1536,
        maxTokens: 8192,
        costPer1M: 0.10,
        status: 'active',
        usage: {
          collectionsUsing: 3,
          embeddingsCreated: 1234567,
          costToday: 12.34,
        }
      },
      {
        id: 'text-embedding-3-small',
        name: 'text-embedding-3-small',
        dimensions: 1536,
        maxTokens: 8192,
        costPer1M: 0.02,
        status: 'active',
        usage: {
          collectionsUsing: 1,
          embeddingsCreated: 456789,
          costToday: 0.91,
        }
      }
    ],
    apiKeyConfigured: true,
    totalCost: 13.25,
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🎯',
    models: [
      {
        id: 'embed-english-v3.0',
        name: 'embed-english-v3.0',
        dimensions: 1024,
        maxTokens: 512,
        costPer1M: 0.10,
        status: 'active',
        usage: {
          collectionsUsing: 2,
          embeddingsCreated: 890123,
          costToday: 8.90,
        }
      }
    ],
    apiKeyConfigured: true,
    totalCost: 8.90,
  },
  {
    id: 'local',
    name: 'Local Models',
    icon: '💻',
    models: [
      {
        id: 'bge-large-en-v1.5',
        name: 'bge-large-en-v1.5',
        dimensions: 1024,
        maxTokens: 512,
        costPer1M: 0,
        status: 'active',
        usage: {
          collectionsUsing: 1,
          embeddingsCreated: 234567,
          costToday: 0,
        }
      }
    ],
    apiKeyConfigured: false,
    totalCost: 0,
  }
]

const availableProviders = [
  { id: 'openai', name: 'OpenAI', icon: '🤖' },
  { id: 'cohere', name: 'Cohere', icon: '🎯' },
  { id: 'voyage', name: 'Voyage AI', icon: '🚀' },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠' },
  { id: 'local', name: 'Local/Self-hosted', icon: '💻' },
]

export default function EmbeddingsConfigPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [modelId, setModelId] = useState('')
  const [modelName, setModelName] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const totalStats = {
    totalModels: embeddingProviders.reduce((acc, p) => acc + p.models.length, 0),
    totalEmbeddings: embeddingProviders.reduce((acc, p) => 
      acc + p.models.reduce((sum, m) => sum + m.usage.embeddingsCreated, 0), 0
    ),
    totalCost: embeddingProviders.reduce((acc, p) => acc + p.totalCost, 0),
    activeCollections: embeddingProviders.reduce((acc, p) => 
      acc + p.models.reduce((sum, m) => sum + m.usage.collectionsUsing, 0), 0
    ),
  }

  const handleTestConnection = async () => {
    setTestStatus('testing')
    // Simulate API test
    setTimeout(() => {
      setTestStatus('success')
    }, 2000)
  }

  const handleSaveModel = () => {
    // Save the new embedding model
    console.log('Saving model:', { selectedProvider, modelId, modelName, dimensions })
    setShowAddModal(false)
    // Reset form
    setSelectedProvider('')
    setModelId('')
    setModelName('')
    setDimensions('')
    setApiKey('')
    setEndpoint('')
    setTestStatus('idle')
  }

  return (
    <MainLayout>
      <PageHeader
        title="Embedding Models"
        description="Manage embedding models for document processing"
      >
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Embedding Model
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalModels}</div>
              <p className="text-xs text-muted-foreground">Across all providers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Embeddings Created</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalStats.totalEmbeddings)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Collections</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.activeCollections}</div>
              <p className="text-xs text-muted-foreground">Using embeddings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStats.totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Across all models</p>
            </CardContent>
          </Card>
        </div>

        {/* Providers and Models */}
        <div className="space-y-6">
          {embeddingProviders.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <CardTitle>{provider.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {provider.models.length} model{provider.models.length > 1 ? 's' : ''} configured
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {provider.apiKeyConfigured ? (
                      <Badge variant="secondary" className="gap-1">
                        <Key className="h-3 w-3" />
                        API Key Configured
                      </Badge>
                    ) : provider.id !== 'local' && (
                      <Badge variant="outline" className="gap-1 text-orange-600">
                        <AlertCircle className="h-3 w-3" />
                        API Key Required
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {provider.models.map((model) => (
                    <div key={model.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div>
                            <h4 className="font-medium">{model.name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                {model.dimensions} dimensions
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {model.maxTokens} max tokens
                              </span>
                              {model.costPer1M > 0 && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  ${model.costPer1M}/1M tokens
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 pt-2 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground">Collections Using</p>
                              <p className="font-medium">{model.usage.collectionsUsing}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Embeddings Created</p>
                              <p className="font-medium">{formatNumber(model.usage.embeddingsCreated)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Cost Today</p>
                              <p className="font-medium">${model.usage.costToday.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Status</p>
                              <Badge variant={model.status === 'active' ? 'secondary' : 'outline'}>
                                {model.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Model Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add Embedding Model</CardTitle>
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
                    <Label>Provider</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className={cn(
                            "border rounded-lg p-3 cursor-pointer transition-all",
                            selectedProvider === provider.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                          onClick={() => setSelectedProvider(provider.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{provider.icon}</span>
                            <span className="font-medium">{provider.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedProvider && (
                    <>
                      {/* Model Configuration */}
                      <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="model-id">Model ID</Label>
                            <Input
                              id="model-id"
                              placeholder="e.g., text-embedding-3-large"
                              value={modelId}
                              onChange={(e) => setModelId(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="model-name">Display Name</Label>
                            <Input
                              id="model-name"
                              placeholder="e.g., Text Embedding Large"
                              value={modelName}
                              onChange={(e) => setModelName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dimensions">Embedding Dimensions</Label>
                          <Input
                            id="dimensions"
                            type="number"
                            placeholder="e.g., 1536"
                            value={dimensions}
                            onChange={(e) => setDimensions(e.target.value)}
                          />
                        </div>

                        {selectedProvider !== 'local' && (
                          <div className="space-y-2">
                            <Label htmlFor="api-key">API Key</Label>
                            <Input
                              id="api-key"
                              type="password"
                              placeholder="Enter your API key"
                              value={apiKey}
                              onChange={(e) => setApiKey(e.target.value)}
                            />
                          </div>
                        )}

                        {selectedProvider === 'local' && (
                          <div className="space-y-2">
                            <Label htmlFor="endpoint">Model Endpoint</Label>
                            <Input
                              id="endpoint"
                              placeholder="http://localhost:8080/embeddings"
                              value={endpoint}
                              onChange={(e) => setEndpoint(e.target.value)}
                            />
                          </div>
                        )}

                        {/* Test Connection */}
                        <div className="flex items-center gap-4 pt-4">
                          <Button
                            variant="outline"
                            onClick={handleTestConnection}
                            disabled={testStatus === 'testing'}
                          >
                            {testStatus === 'testing' ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <TestTube className="mr-2 h-4 w-4" />
                                Test Connection
                              </>
                            )}
                          </Button>

                          {testStatus === 'success' && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm">Connection successful</span>
                            </div>
                          )}

                          {testStatus === 'error' && (
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">Connection failed</span>
                            </div>
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
                          onClick={handleSaveModel}
                          disabled={!modelId || !modelName || !dimensions || (selectedProvider !== 'local' && !apiKey)}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Model
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