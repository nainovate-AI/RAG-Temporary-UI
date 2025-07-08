'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Database,
  Plus,
  Settings,
  Trash2,
  CheckCircle,
  AlertCircle,
  Cloud,
  HardDrive,
  Zap,
  Shield,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface VectorStore {
  id: string
  name: string
  provider: 'qdrant' | 'pinecone' | 'weaviate' | 'chroma' | 'faiss'
  type: 'cloud' | 'local'
  status: 'connected' | 'disconnected' | 'error'
  collections: number
  totalVectors: number
  storageUsed: string
  lastSync: string
  config: {
    endpoint?: string
    apiKey?: string
    region?: string
    dimensions?: number
  }
}

const mockVectorStores: VectorStore[] = [
  {
    id: '1',
    name: 'Production Qdrant',
    provider: 'qdrant',
    type: 'cloud',
    status: 'connected',
    collections: 3,
    totalVectors: 1250000,
    storageUsed: '2.4 GB',
    lastSync: '2024-01-15T10:30:00Z',
    config: {
      endpoint: 'https://qdrant-prod.us-east-1.aws.cloud.qdrant.io',
      region: 'us-east-1',
      dimensions: 1536
    }
  },
  {
    id: '2',
    name: 'Pinecone Primary',
    provider: 'pinecone',
    type: 'cloud',
    status: 'connected',
    collections: 2,
    totalVectors: 890000,
    storageUsed: '1.8 GB',
    lastSync: '2024-01-15T09:45:00Z',
    config: {
      endpoint: 'https://prod-index.pinecone.io',
      region: 'us-west-2',
      dimensions: 1024
    }
  },
  {
    id: '3',
    name: 'Local Development',
    provider: 'faiss',
    type: 'local',
    status: 'connected',
    collections: 5,
    totalVectors: 45000,
    storageUsed: '156 MB',
    lastSync: '2024-01-15T11:00:00Z',
    config: {
      endpoint: 'localhost:6333',
      dimensions: 768
    }
  },
  {
    id: '4',
    name: 'Staging Weaviate',
    provider: 'weaviate',
    type: 'cloud',
    status: 'error',
    collections: 0,
    totalVectors: 0,
    storageUsed: '0 MB',
    lastSync: '2024-01-14T15:30:00Z',
    config: {
      endpoint: 'https://staging.weaviate.network',
      region: 'eu-central-1'
    }
  },
]

const providerInfo = {
  qdrant: {
    name: 'Qdrant',
    icon: '🎯',
    features: ['High performance', 'Hybrid search', 'Filtering', 'Geo-search'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  pinecone: {
    name: 'Pinecone',
    icon: '🌲',
    features: ['Serverless', 'Auto-scaling', 'Real-time', 'Global deployment'],
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  weaviate: {
    name: 'Weaviate',
    icon: '🔮',
    features: ['GraphQL API', 'Semantic search', 'Multi-modal', 'Schema-based'],
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  chroma: {
    name: 'Chroma',
    icon: '🎨',
    features: ['Open source', 'Simple API', 'Embeddings DB', 'Local-first'],
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  faiss: {
    name: 'FAISS',
    icon: '🚀',
    features: ['Facebook AI', 'CPU/GPU', 'Billion-scale', 'Local only'],
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
}

export default function VectorStoresPage() {
  const [vectorStores] = useState(mockVectorStores)
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [selectedStore, setSelectedStore] = useState<string | null>(null)

  const toggleApiKeyVisibility = (storeId: string) => {
    setShowApiKey(prev => ({ ...prev, [storeId]: !prev[storeId] }))
  }

  const handleTestConnection = (storeId: string) => {
    console.log('Testing connection for:', storeId)
    // In a real app, this would test the connection
  }

  const handleDeleteStore = (storeId: string) => {
    console.log('Deleting store:', storeId)
    // In a real app, this would delete the store
  }

  return (
    <MainLayout>
      <PageHeader
        title="Vector Store Configuration"
        description="Manage your vector databases and connections"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vector Store
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{vectorStores.length}</p>
                  <p className="text-sm text-muted-foreground">Total Stores</p>
                </div>
                <Database className="h-8 w-8 text-muted-foreground/40" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {vectorStores.filter(s => s.status === 'connected').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">2.2M</p>
                  <p className="text-sm text-muted-foreground">Total Vectors</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">4.4 GB</p>
                  <p className="text-sm text-muted-foreground">Total Storage</p>
                </div>
                <HardDrive className="h-8 w-8 text-blue-500/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vector Stores List */}
        <div className="grid gap-6">
          {vectorStores.map((store) => {
            const provider = providerInfo[store.provider]
            const isSelected = selectedStore === store.id
            
            return (
              <Card 
                key={store.id} 
                className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${provider.bgColor}`}>
                        <span className="text-2xl">{provider.icon}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {store.name}
                          {store.type === 'cloud' ? (
                            <Cloud className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <HardDrive className="h-4 w-4 text-muted-foreground" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {provider.name} • {store.config.endpoint}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={store.status} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedStore(isSelected ? null : store.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-2xl font-semibold">{store.collections}</p>
                      <p className="text-xs text-muted-foreground">Collections</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">
                        {store.totalVectors > 1000000 
                          ? `${(store.totalVectors / 1000000).toFixed(1)}M`
                          : store.totalVectors > 1000
                          ? `${(store.totalVectors / 1000).toFixed(0)}K`
                          : store.totalVectors}
                      </p>
                      <p className="text-xs text-muted-foreground">Vectors</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{store.storageUsed}</p>
                      <p className="text-xs text-muted-foreground">Storage</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">
                        {store.config.dimensions || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">Dimensions</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Expanded Configuration */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Endpoint</label>
                        <div className="flex gap-2">
                          <Input 
                            value={store.config.endpoint} 
                            readOnly 
                            className="font-mono text-sm"
                          />
                          <Button variant="outline" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {store.config.apiKey && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">API Key</label>
                          <div className="flex gap-2">
                            <Input 
                              type={showApiKey[store.id] ? "text" : "password"}
                              value="sk-proj-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx" 
                              readOnly 
                              className="font-mono text-sm"
                            />
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => toggleApiKeyVisibility(store.id)}
                            >
                              {showApiKey[store.id] ? (
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

                      <div className="flex gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handleTestConnection(store.id)}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Test Connection
                        </Button>
                        <Button variant="outline">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Console
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    <span>Last synced: {formatDate(store.lastSync)}</span>
                    {store.config.region && (
                      <span>Region: {store.config.region}</span>
                    )}
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