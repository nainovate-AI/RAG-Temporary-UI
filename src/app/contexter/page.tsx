'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus,
  Upload,
  Search,
  FileText,
  Database,
  Clock,
  HardDrive,
  Filter,
  MoreVertical,
  FolderOpen,
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  RefreshCw,
  Download,
  Grid3x3,
  List
} from 'lucide-react'
import { formatNumber, formatBytes, formatDate } from '@/lib/utils'
import { DocumentCollection } from '@/types'

// Mock data - replace with API calls
const collections: DocumentCollection[] = [
  {
    id: '1',
    name: 'Customer Support Knowledge Base',
    description: 'Product documentation, FAQs, and support articles for customer service',
    documentCount: 1543,
    totalChunks: 12847,
    totalSize: 256789012, // bytes
    embeddingModel: {
      id: 'text-embedding-ada-002',
      name: 'text-embedding-ada-002',
      provider: 'openai',
      dimensions: 1536,
    },
    vectorStore: {
      type: 'qdrant',
      collectionName: 'customer_support_v2',
    },
    chunkingConfig: {
      strategy: 'recursive',
      chunkSize: 512,
      chunkOverlap: 64,
    },
    status: 'ready',
    metadata: {
      tags: ['support', 'documentation', 'faqs'],
      category: 'Customer Service',
      language: 'en',
      accessLevel: 'public',
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastAccessedAt: '2024-01-15T14:22:00Z',
  },
  {
    id: '2',
    name: 'Technical API Documentation',
    description: 'API references, integration guides, and code examples',
    documentCount: 892,
    totalChunks: 8234,
    totalSize: 128456789,
    embeddingModel: {
      id: 'bge-large-en-v1.5',
      name: 'bge-large-en-v1.5',
      provider: 'BAAI',
      dimensions: 1024,
    },
    vectorStore: {
      type: 'pinecone',
      collectionName: 'tech_docs_prod',
      namespace: 'api-docs',
    },
    chunkingConfig: {
      strategy: 'recursive',
      chunkSize: 1024,
      chunkOverlap: 128,
    },
    status: 'processing',
    progress: {
      current: 567,
      total: 892,
      stage: 'embedding',
    },
    metadata: {
      tags: ['api', 'technical', 'developers'],
      category: 'Technical Documentation',
      language: 'en',
      accessLevel: 'restricted',
    },
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-15T15:45:00Z',
  },
  {
    id: '3',
    name: 'Legal Contracts Archive',
    description: 'Historical contracts, agreements, and legal documents',
    documentCount: 342,
    totalChunks: 4567,
    totalSize: 89234567,
    embeddingModel: {
      id: 'text-embedding-ada-002',
      name: 'text-embedding-ada-002',
      provider: 'openai',
      dimensions: 1536,
    },
    vectorStore: {
      type: 'qdrant',
      collectionName: 'legal_contracts',
    },
    chunkingConfig: {
      strategy: 'fixed',
      chunkSize: 2048,
      chunkOverlap: 256,
    },
    status: 'error',
    error: 'Vector store connection failed',
    metadata: {
      tags: ['legal', 'contracts', 'compliance'],
      category: 'Legal',
      language: 'en',
      accessLevel: 'private',
    },
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
  },
]

export default function DocumentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const handleNewIngestion = () => {
    router.push('/contexter/ingest')
  }

  const handleCollectionClick = (collectionId: string) => {
    router.push(`/contexter/collections/${collectionId}`)
  }

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || collection.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalStats = {
    documents: collections.reduce((sum, col) => sum + col.documentCount, 0),
    chunks: collections.reduce((sum, col) => sum + col.totalChunks, 0),
    storage: collections.reduce((sum, col) => sum + col.totalSize, 0),
    collections: collections.length,
  }

  return (
    <MainLayout>
      <PageHeader
        title="Document Collections"
        description="Manage your document collections and ingestion pipelines"
      >
        <Button onClick={handleNewIngestion}>
          <Upload className="mr-2 h-4 w-4" />
          New Ingestion
        </Button>
      </PageHeader>

      <PageContent>
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.collections}</div>
              <p className="text-xs text-muted-foreground">
                {collections.filter(c => c.status === 'processing').length} processing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalStats.documents)}</div>
              <p className="text-xs text-muted-foreground">
                Across all collections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chunks</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalStats.chunks)}</div>
              <p className="text-xs text-muted-foreground">
                Embedded vectors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(totalStats.storage)}</div>
              <p className="text-xs text-muted-foreground">
                Original documents
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready</option>
              <option value="processing">Processing</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-accent' : ''}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-accent' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Collections Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCollections.map((collection) => (
              <Card
                key={collection.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCollectionClick(collection.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{collection.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle menu
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <StatusBadge status={collection.status} />
                    {collection.metadata.accessLevel && (
                      <Badge variant="outline">
                        {collection.metadata.accessLevel}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Progress bar for processing collections */}
                    {collection.status === 'processing' && collection.progress && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{collection.progress.stage}</span>
                          <span>{Math.round((collection.progress.current / collection.progress.total) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(collection.progress.current / collection.progress.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error message */}
                    {collection.status === 'error' && collection.error && (
                      <div className="flex items-start gap-2 p-2 bg-destructive/10 text-destructive rounded-md">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <p className="text-xs">{collection.error}</p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Documents</p>
                        <p className="font-medium">{formatNumber(collection.documentCount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Chunks</p>
                        <p className="font-medium">{formatNumber(collection.totalChunks)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Embedding</p>
                        <p className="font-medium text-xs">{collection.embeddingModel.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Vector Store</p>
                        <p className="font-medium">{collection.vectorStore.type}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {collection.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {collection.metadata.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{collection.metadata.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Updated {formatDate(collection.updatedAt)}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle refresh
                          }}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle download
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-2">
            {filteredCollections.map((collection) => (
              <Card
                key={collection.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleCollectionClick(collection.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{collection.name}</h3>
                          <StatusBadge status={collection.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {collection.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{formatNumber(collection.documentCount)}</p>
                          <p className="text-xs text-muted-foreground">Documents</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{formatNumber(collection.totalChunks)}</p>
                          <p className="text-xs text-muted-foreground">Chunks</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{formatBytes(collection.totalSize)}</p>
                          <p className="text-xs text-muted-foreground">Size</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle menu
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first document collection'}
            </p>
            {!searchQuery && (
              <Button onClick={handleNewIngestion}>
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </Button>
            )}
          </div>
        )}
      </PageContent>
    </MainLayout>
  )
}