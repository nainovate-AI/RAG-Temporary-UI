'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Database,
  Cloud,
  Server,
  Zap,
  DollarSign,
  Info,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Globe,
  Lock,
  Cpu,
  HardDrive,
  Sparkles,
  Link2,
  TestTube
} from 'lucide-react'
import { cn } from '@/lib/utils'

const vectorStores = [
  {
    id: 'qdrant',
    name: 'Qdrant',
    icon: '🚀',
    type: 'cloud',
    description: 'High-performance vector database with advanced filtering',
    recommended: true,
    deployment: ['Cloud', 'Self-hosted', 'Docker'],
    pros: ['Fast performance', 'Rich filtering', 'Scalable', 'Great documentation'],
    cons: ['Requires setup', 'Learning curve'],
    pricing: 'Free tier available, $0.058/1M vectors/month',
    features: ['Payload filtering', 'Full-text search', 'Distributed mode', 'Snapshots'],
  },
  {
    id: 'pinecone',
    name: 'Pinecone',
    icon: '🌲',
    type: 'cloud',
    description: 'Fully managed vector database service',
    deployment: ['Cloud only'],
    pros: ['Fully managed', 'Easy to use', 'Auto-scaling', 'Good performance'],
    cons: ['Cloud-only', 'Can be expensive', 'Vendor lock-in'],
    pricing: 'Free tier (1M vectors), $0.096/1M vectors/month',
    features: ['Managed service', 'Auto-indexing', 'Live index updates', 'Namespaces'],
  },
  {
    id: 'weaviate',
    name: 'Weaviate',
    icon: '🔮',
    type: 'hybrid',
    description: 'AI-native vector database with semantic search',
    deployment: ['Cloud', 'Self-hosted', 'Docker'],
    pros: ['AI-native', 'GraphQL API', 'Module ecosystem', 'Hybrid search'],
    cons: ['Complex setup', 'Resource intensive'],
    pricing: 'Open source, Cloud from $25/month',
    features: ['Semantic search', 'GraphQL', 'Modules', 'Multi-tenancy'],
  },
  {
    id: 'chroma',
    name: 'Chroma',
    icon: '🎨',
    type: 'local',
    description: 'Lightweight, embedded vector database',
    deployment: ['Local', 'Self-hosted'],
    pros: ['Easy setup', 'Lightweight', 'Open source', 'Python-native'],
    cons: ['Limited scaling', 'Fewer features', 'Local only'],
    pricing: 'Free (open source)',
    features: ['Embedded mode', 'Simple API', 'Metadata filtering', 'Collections'],
  },
  {
    id: 'faiss',
    name: 'FAISS',
    icon: '⚡',
    type: 'local',
    description: 'Facebook\'s library for efficient similarity search',
    deployment: ['Local only'],
    pros: ['Very fast', 'Memory efficient', 'Battle-tested', 'Free'],
    cons: ['No built-in persistence', 'Limited features', 'Lower-level API'],
    pricing: 'Free (open source)',
    features: ['GPU support', 'Multiple index types', 'Batch operations', 'Quantization'],
  },
]

export default function VectorStoreConfigPage() {
  const router = useRouter()
  const [selectedStore, setSelectedStore] = useState('qdrant')
  const [connectionType, setConnectionType] = useState<'cloud' | 'self-hosted'>('cloud')
  const [collectionName, setCollectionName] = useState('')
  const [connectionUrl, setConnectionUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [namespace, setNamespace] = useState('')
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const selectedStoreData = vectorStores.find(s => s.id === selectedStore)
  
  const handleNext = () => {
    // Save configuration to session/context
    router.push('/documents/ingest/new/review')
  }

  const handleBack = () => {
    router.push('/documents/ingest/new/embedding')
  }

  const handleTestConnection = async () => {
    setTestStatus('testing')
    // Simulate connection test
    setTimeout(() => {
      setTestStatus('success')
    }, 2000)
  }

  const generateCollectionName = () => {
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    setCollectionName(`collection_${timestamp}`)
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Vector Store Configuration</p>
          <p className="text-muted-foreground">
            Choose where to store your document embeddings. Consider factors like scale, 
            performance requirements, and whether you need cloud or on-premise deployment.
          </p>
        </div>
      </div>

      {/* Vector Store Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Vector Store</CardTitle>
          <CardDescription>
            Choose the vector database for storing embeddings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {vectorStores.map((store) => {
              const isSelected = selectedStore === store.id

              return (
                <div
                  key={store.id}
                  className={cn(
                    "relative border rounded-lg p-4 cursor-pointer transition-all",
                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedStore(store.id)}
                >
                  {store.recommended && (
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  )}

                  <div className="flex gap-4">
                    {/* Icon and basic info */}
                    <div className="text-3xl">{store.icon}</div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{store.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {store.type === 'cloud' && <Cloud className="h-3 w-3 mr-1" />}
                            {store.type === 'local' && <Server className="h-3 w-3 mr-1" />}
                            {store.type === 'hybrid' && <Database className="h-3 w-3 mr-1" />}
                            {store.type}
                          </Badge>
                          {isSelected && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {store.description}
                        </p>
                      </div>

                      {/* Deployment options */}
                      <div className="flex flex-wrap gap-2">
                        {store.deployment.map((option) => (
                          <Badge key={option} variant="secondary" className="text-xs">
                            {option}
                          </Badge>
                        ))}
                      </div>

                      {/* Pricing */}
                      <p className="text-xs text-muted-foreground">
                        <DollarSign className="inline h-3 w-3" /> {store.pricing}
                      </p>

                      {/* Expanded details when selected */}
                      {isSelected && (
                        <div className="pt-3 border-t space-y-3">
                          {/* Features */}
                          <div>
                            <p className="text-xs font-medium mb-1">Key Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {store.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Pros and Cons */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-medium text-green-600 mb-1">Pros:</p>
                              <ul className="space-y-0.5">
                                {store.pros.map((pro, i) => (
                                  <li key={i} className="text-muted-foreground">• {pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-orange-600 mb-1">Cons:</p>
                              <ul className="space-y-0.5">
                                {store.cons.map((con, i) => (
                                  <li key={i} className="text-muted-foreground">• {con}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connection Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Settings</CardTitle>
          <CardDescription>
            Configure how to connect to {selectedStoreData?.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Type (for hybrid stores) */}
          {selectedStoreData && selectedStoreData.deployment.length > 1 && (
            <div className="space-y-2">
                <Label>Deployment Type</Label>
                <div className="flex gap-4">
                {selectedStoreData.deployment.includes('Cloud') && (
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="connection-type"
                        value="cloud"
                        checked={connectionType === 'cloud'}
                        onChange={() => setConnectionType('cloud')}
                    />
                    <span className="text-sm">Cloud Managed</span>
                    </label>
                )}
                {selectedStoreData.deployment.includes('Self-hosted') && (
                    <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="connection-type"
                        value="self-hosted"
                        checked={connectionType === 'self-hosted'}
                        onChange={() => setConnectionType('self-hosted')}
                    />
                    <span className="text-sm">Self-hosted</span>
                    </label>
                )}
                </div>
            </div>
        )}

          {/* Collection/Index Name */}
          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name *</Label>
            <div className="flex gap-2">
              <Input
                id="collection-name"
                placeholder="e.g., my_documents_v1"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateCollectionName}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Unique identifier for this document collection in the vector store
            </p>
          </div>

          {/* Connection URL (for self-hosted) */}
          {(connectionType === 'self-hosted' || selectedStoreData?.type === 'local') && (
            <div className="space-y-2">
              <Label htmlFor="connection-url">Connection URL</Label>
              <Input
                id="connection-url"
                placeholder="http://localhost:6333"
                value={connectionUrl}
                onChange={(e) => setConnectionUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                URL of your {selectedStoreData?.name} instance
              </p>
            </div>
          )}

          {/* API Key (for cloud services) */}
          {connectionType === 'cloud' && selectedStoreData?.type !== 'local' && (
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your {selectedStoreData?.name} API key for authentication
              </p>
            </div>
          )}

          {/* Namespace (for Pinecone) */}
          {selectedStore === 'pinecone' && (
            <div className="space-y-2">
              <Label htmlFor="namespace">Namespace (optional)</Label>
              <Input
                id="namespace"
                placeholder="default"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Partition your vectors within the index
              </p>
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
                  <Cpu className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
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
        </CardContent>
      </Card>

      {/* Storage Estimation */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Estimates</CardTitle>
          <CardDescription>
            Approximate storage requirements for your collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Vector Count</p>
              <p className="font-medium">~1,000 vectors</p>
            </div>
            <div>
              <p className="text-muted-foreground">Storage Size</p>
              <p className="font-medium">~6.2 MB</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly Cost</p>
              <p className="font-medium">
                {selectedStoreData?.pricing.includes('Free') ? (
                  <span className="text-green-600">Free tier</span>
                ) : (
                  '~$0.06'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!collectionName}
        >
          Next: Review & Start
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}