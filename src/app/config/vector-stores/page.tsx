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
  Database,
  Plus,
  Settings,
  Activity,
  HardDrive,
  Folder,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Server,
  Cloud,
  Shield,
  Zap,
  Globe,
  Hash,
  Clock,
  TrendingUp
} from 'lucide-react'
import { cn, formatNumber, formatBytes } from '@/lib/utils'

// Mock data for vector stores
const vectorStores = [
  {
    id: 'qdrant-prod',
    name: 'Qdrant Production',
    provider: 'qdrant',
    icon: '🔷',
    status: 'active' as const,
    endpoint: 'https://qdrant-prod.example.com:6333',
    collections: [
      {
        id: 'customer-support',
        name: 'customer-support',
        vectorCount: 1234567,
        dimensions: 1536,
        storageSize: 2147483648, // 2GB
        indexType: 'hnsw',
        lastUpdated: '2024-01-15T10:30:00Z',
      },
      {
        id: 'product-docs',
        name: 'product-docs',
        vectorCount: 892345,
        dimensions: 1536,
        storageSize: 1073741824, // 1GB
        indexType: 'hnsw',
        lastUpdated: '2024-01-15T09:15:00Z',
      },
      {
        id: 'legal-contracts',
        name: 'legal-contracts',
        vectorCount: 234567,
        dimensions: 1024,
        storageSize: 536870912, // 512MB
        indexType: 'hnsw',
        lastUpdated: '2024-01-14T16:45:00Z',
      }
    ],
    metrics: {
      totalVectors: 2361479,
      totalStorage: 3758096384, // 3.5GB
      queriesPerSecond: 45.2,
      avgLatency: 12.5,
      uptime: 99.9,
    },
    config: {
      authentication: true,
      tls: true,
      replication: 3,
    }
  },
  {
    id: 'pinecone-main',
    name: 'Pinecone US-East',
    provider: 'pinecone',
    icon: '🌲',
    status: 'active' as const,
    endpoint: 'us-east-1.pinecone.io',
    collections: [
      {
        id: 'embeddings-v2',
        name: 'embeddings-v2',
        vectorCount: 5678901,
        dimensions: 1536,
        storageSize: 8589934592, // 8GB
        indexType: 'p2',
        lastUpdated: '2024-01-15T11:00:00Z',
      }
    ],
    metrics: {
      totalVectors: 5678901,
      totalStorage: 8589934592,
      queriesPerSecond: 89.7,
      avgLatency: 8.3,
      uptime: 99.99,
    },
    config: {
      environment: 'us-east-1',
      plan: 'production',
      pods: 2,
    }
  },
  {
    id: 'chroma-local',
    name: 'Chroma Local',
    provider: 'chroma',
    icon: '🎨',
    status: 'maintenance' as const,
    endpoint: 'http://localhost:8000',
    collections: [
      {
        id: 'test-collection',
        name: 'test-collection',
        vectorCount: 12345,
        dimensions: 384,
        storageSize: 134217728, // 128MB
        indexType: 'l2',
        lastUpdated: '2024-01-15T08:00:00Z',
      }
    ],
    metrics: {
      totalVectors: 12345,
      totalStorage: 134217728,
      queriesPerSecond: 12.1,
      avgLatency: 5.2,
      uptime: 95.5,
    },
    config: {
      persistence: true,
      anonymousAccess: false,
    }
  }
]

const providerInfo: Record<string, {
  name: string
  features: string[]
  color: string
  bgColor: string
}> = {
  qdrant: {
    name: 'Qdrant',
    features: ['High performance', 'Filtering', 'Payload storage', 'Distributed'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  pinecone: {
    name: 'Pinecone',
    features: ['Fully managed', 'Auto-scaling', 'High availability', 'Enterprise ready'],
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  chroma: {
    name: 'Chroma',
    features: ['Open source', 'Easy to use', 'Metadata filtering', 'Local deployment'],
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  weaviate: {
    name: 'Weaviate',
    features: ['GraphQL API', 'Hybrid search', 'Multi-modal', 'Schema support'],
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  faiss: {
    name: 'FAISS',
    features: ['Facebook AI', 'GPU support', 'Multiple indexes', 'Research proven'],
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  }
}

const availableProviders = [
  { id: 'qdrant', name: 'Qdrant', icon: '🔷' },
  { id: 'pinecone', name: 'Pinecone', icon: '🌲' },
  { id: 'chroma', name: 'Chroma', icon: '🎨' },
  { id: 'weaviate', name: 'Weaviate', icon: '🌐' },
  { id: 'faiss', name: 'FAISS', icon: '🔍' },
]

export default function VectorStoresConfigPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [storeName, setStoreName] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [cloudRegion, setCloudRegion] = useState('')
  const [useAuth, setUseAuth] = useState(true)
  const [useTLS, setUseTLS] = useState(true)
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [expandedStore, setExpandedStore] = useState<string | null>(null)

  // Calculate total stats
  const totalStats = {
    totalStores: vectorStores.length,
    totalCollections: vectorStores.reduce((acc, store) => acc + store.collections.length, 0),
    totalVectors: vectorStores.reduce((acc, store) => acc + store.metrics.totalVectors, 0),
    totalStorage: vectorStores.reduce((acc, store) => acc + store.metrics.totalStorage, 0),
  }

  const handleTestConnection = async () => {
    setTestStatus('testing')
    // Simulate API test
    setTimeout(() => {
      setTestStatus('success')
    }, 2000)
  }

  const handleSaveStore = () => {
    // Save the new vector store
    console.log('Saving store:', { selectedProvider, storeName, endpoint, cloudRegion })
    setShowAddModal(false)
    // Reset form
    setSelectedProvider('')
    setStoreName('')
    setEndpoint('')
    setApiKey('')
    setCloudRegion('')
    setTestStatus('idle')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="h-4 w-4 text-green-500" />
      case 'maintenance':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-500/10'
      case 'maintenance':
        return 'text-yellow-500 bg-yellow-500/10'
      default:
        return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <MainLayout>
      <PageHeader
        title="Vector Stores"
        description="Manage vector databases and collections"
      >
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vector Store
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalStores}</div>
              <p className="text-xs text-muted-foreground">Connected databases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalCollections}</div>
              <p className="text-xs text-muted-foreground">Across all stores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vectors</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalStats.totalVectors)}</div>
              <p className="text-xs text-muted-foreground">Indexed embeddings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(totalStats.totalStorage)}</div>
              <p className="text-xs text-muted-foreground">Total across stores</p>
            </CardContent>
          </Card>
        </div>

        {/* Vector Stores List */}
        <div className="space-y-4">
          {vectorStores.map((store) => {
            const provider = providerInfo[store.provider]
            const isExpanded = expandedStore === store.id

            return (
              <Card key={store.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-lg",
                        provider.bgColor
                      )}>
                        <span className="text-2xl">{store.icon}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <CardTitle>{store.name}</CardTitle>
                          <Badge className={getStatusColor(store.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(store.status)}
                              {store.status}
                            </span>
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <span>{provider.name}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-mono text-xs">{store.endpoint}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedStore(isExpanded ? null : store.id)}
                      >
                        {isExpanded ? 'Hide Details' : 'View Collections'}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Store Metrics */}
                  <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Collections</p>
                      <p className="font-medium">{store.collections.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Vectors</p>
                      <p className="font-medium">{formatNumber(store.metrics.totalVectors)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Storage</p>
                      <p className="font-medium">{formatBytes(store.metrics.totalStorage)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">QPS</p>
                      <p className="font-medium">{store.metrics.queriesPerSecond}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Latency</p>
                      <p className="font-medium">{store.metrics.avgLatency}ms</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Collections View */}
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Collections</h4>
                        <Button size="sm" variant="outline">
                          <Plus className="mr-2 h-3 w-3" />
                          Create Collection
                        </Button>
                      </div>
                      {store.collections.map((collection) => (
                        <div
                          key={collection.id}
                          className="border rounded-lg p-4 space-y-3 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Folder className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm">{collection.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{collection.indexType}</Badge>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">Vectors</p>
                              <p className="font-medium">{formatNumber(collection.vectorCount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Dimensions</p>
                              <p className="font-medium">{collection.dimensions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Size</p>
                              <p className="font-medium">{formatBytes(collection.storageSize)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Last Updated</p>
                              <p className="font-medium">
                                {new Date(collection.lastUpdated).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Store Configuration */}
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Configuration</h4>
                      <div className="flex flex-wrap gap-2">
                        {store.config.authentication && (
                          <Badge variant="outline">
                            <Shield className="mr-1 h-3 w-3" />
                            Authentication
                          </Badge>
                        )}
                        {store.config.tls && (
                          <Badge variant="outline">
                            <Shield className="mr-1 h-3 w-3" />
                            TLS Enabled
                          </Badge>
                        )}
                        {store.config.replication && (
                          <Badge variant="outline">
                            <Server className="mr-1 h-3 w-3" />
                            Replication: {store.config.replication}
                          </Badge>
                        )}
                        {store.config.environment && (
                          <Badge variant="outline">
                            <Globe className="mr-1 h-3 w-3" />
                            {store.config.environment}
                          </Badge>
                        )}
                        {store.config.plan && (
                          <Badge variant="outline">
                            <Zap className="mr-1 h-3 w-3" />
                            {store.config.plan}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Add Vector Store Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <div className="fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Add Vector Store</CardTitle>
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
                      {/* Store Configuration */}
                      <div className="space-y-4 pt-4 border-t">
                        <div className="space-y-2">
                          <Label htmlFor="store-name">Store Name</Label>
                          <Input
                            id="store-name"
                            placeholder="e.g., Production Vector Store"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                          />
                        </div>

                        {selectedProvider === 'pinecone' ? (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="cloud-region">Cloud Region</Label>
                              <Input
                                id="cloud-region"
                                placeholder="e.g., us-east-1"
                                value={cloudRegion}
                                onChange={(e) => setCloudRegion(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="api-key">API Key</Label>
                              <Input
                                id="api-key"
                                type="password"
                                placeholder="Enter your Pinecone API key"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="endpoint">Endpoint URL</Label>
                              <Input
                                id="endpoint"
                                placeholder="e.g., http://localhost:6333"
                                value={endpoint}
                                onChange={(e) => setEndpoint(e.target.value)}
                              />
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="use-auth">Authentication</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Require API key for access
                                  </p>
                                </div>
                                <Switch
                                  id="use-auth"
                                  checked={useAuth}
                                  onCheckedChange={setUseAuth}
                                />
                              </div>
                              {useAuth && (
                                <div className="space-y-2">
                                  <Label htmlFor="api-key">API Key</Label>
                                  <Input
                                    id="api-key"
                                    type="password"
                                    placeholder="Enter API key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                  />
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="use-tls">TLS/SSL</Label>
                                  <p className="text-xs text-muted-foreground">
                                    Use secure connection
                                  </p>
                                </div>
                                <Switch
                                  id="use-tls"
                                  checked={useTLS}
                                  onCheckedChange={setUseTLS}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {/* Test Connection */}
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium">Test Connection</p>
                              <p className="text-xs text-muted-foreground">
                                Verify settings before saving
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
                              Successfully connected to vector store
                            </p>
                          )}
                          {testStatus === 'error' && (
                            <p className="text-xs text-red-600 mt-2">
                              Failed to connect. Please check your settings.
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
                          onClick={handleSaveStore}
                          disabled={
                            !storeName || 
                            (selectedProvider === 'pinecone' ? !cloudRegion || !apiKey : !endpoint) ||
                            testStatus !== 'success'
                          }
                        >
                          Add Vector Store
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