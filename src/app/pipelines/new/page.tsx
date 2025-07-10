'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge, StatusBadge } from '@/components/ui/badge'
import { 
  Info,
  Database,
  FileText,
  CheckCircle,
  Folder,
  Calendar,
  Hash,
  HardDrive,
  Lock,
  Globe,
  Search,
  Filter,
  ChevronRight,
  Plus
} from 'lucide-react'
import { DocumentCollection } from '@/types'
import { formatDate, formatBytes, formatNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Mock data - replace with API call
const availableCollections: DocumentCollection[] = [
  {
    id: '1',
    name: 'Customer Support Knowledge Base',
    description: 'Product documentation, FAQs, and support articles',
    documentCount: 1543,
    totalChunks: 12847,
    totalSize: 256789012,
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
    status: 'ready',
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
    status: 'ready',
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

const useCases = [
  { id: 'qa', label: 'Q&A / Support', icon: '💬' },
  { id: 'search', label: 'Semantic Search', icon: '🔍' },
  { id: 'chat', label: 'Conversational AI', icon: '🤖' },
  { id: 'analysis', label: 'Document Analysis', icon: '📊' },
  { id: 'extraction', label: 'Information Extraction', icon: '📋' },
  { id: 'custom', label: 'Custom', icon: '⚙️' },
]

export default function NewPipelinePage() {
  const router = useRouter()
  const [pipelineName, setPipelineName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedUseCase, setSelectedUseCase] = useState('')
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')

  const filteredCollections = availableCollections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const canProceed = pipelineName.trim() && selectedUseCase && selectedCollections.length > 0

  const handleNext = () => {
    if (canProceed) {
      // Save data to session/context
      router.push('/pipelines/new/retrieval')
    }
  }

  // Calculate total stats for selected collections
  const selectedStats = selectedCollections.reduce((acc, id) => {
    const collection = availableCollections.find(c => c.id === id)
    if (collection) {
      acc.documents += collection.documentCount
      acc.chunks += collection.totalChunks
      acc.size += collection.totalSize
    }
    return acc
  }, { documents: 0, chunks: 0, size: 0 })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header - Remove this if using layout */}
      <div>
        <h1 className="text-3xl font-bold">Create RAG Pipeline</h1>
        <p className="text-muted-foreground mt-2">
          Configure a new retrieval-augmented generation pipeline
        </p>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Getting Started</p>
          <p className="text-muted-foreground">
            RAG pipelines combine your document collections with language models to answer questions 
            and generate content based on your data. Start by selecting the collections you want to use.
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Information</CardTitle>
          <CardDescription>
            Provide basic details about your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pipeline-name">Pipeline Name *</Label>
            <Input
              id="pipeline-name"
              placeholder="e.g., Customer Support Assistant"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background text-foreground rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground"
              placeholder="Describe the purpose of this pipeline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Use Case *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {useCases.map((useCase) => (
                <div
                  key={useCase.id}
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-all text-center",
                    selectedUseCase === useCase.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedUseCase(useCase.id)}
                >
                  <div className="text-2xl mb-1">{useCase.icon}</div>
                  <p className="text-sm font-medium">{useCase.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1">×</button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collection Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Document Collections *</CardTitle>
              <CardDescription>
                Choose one or more collections to use for retrieval
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/documents/ingest/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Collection
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* Rest of the content remains exactly the same */}
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

          {/* Selected Stats */}
          {selectedCollections.length > 0 && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium mb-2">
                Selected: {selectedCollections.length} collection{selectedCollections.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Documents</p>
                  <p className="font-medium">{formatNumber(selectedStats.documents)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Chunks</p>
                  <p className="font-medium">{formatNumber(selectedStats.chunks)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Size</p>
                  <p className="font-medium">{formatBytes(selectedStats.size)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Collection List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredCollections.map((collection) => {
              const isSelected = selectedCollections.includes(collection.id)
              
              return (
                <div
                  key={collection.id}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                  onClick={() => toggleCollection(collection.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{collection.name}</h4>
                        {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{collection.description}</p>
                      
                      {/* Collection Metadata */}
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {formatNumber(collection.documentCount)} docs
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {formatNumber(collection.totalChunks)} chunks
                        </div>
                        <div className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {collection.vectorStore.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Updated {formatDate(collection.updatedAt)}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {collection.metadata.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          {collection.metadata.accessLevel === 'private' && <Lock className="h-3 w-3 mr-1" />}
                          {collection.metadata.accessLevel === 'public' && <Globe className="h-3 w-3 mr-1" />}
                          {collection.metadata.accessLevel}
                        </Badge>
                      </div>
                    </div>

                    {/* Status */}
                    <StatusBadge status={collection.status} />
                  </div>
                </div>
              )
            })}
          </div>

          {filteredCollections.length === 0 && (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No collections found</p>
              <Button
                variant="link"
                onClick={() => router.push('/documents/ingest/new')}
                className="mt-2"
              >
                Create a new collection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/pipelines')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
        >
          Next: Retrieval Configuration
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}