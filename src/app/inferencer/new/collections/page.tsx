// src/app/inferencer/new/collections/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Database,
  FileText,
  Check,
  Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBytes } from '@/lib/utils'

// This would come from your API
const availableCollections = [
  {
    id: '1',
    name: 'Customer Support Knowledge Base',
    description: 'FAQs, troubleshooting guides, and support articles',
    documentCount: 1543,
    totalChunks: 12847,
    totalSize: 125832192, // bytes
    embeddingModel: {
      name: 'text-embedding-ada-002',
      provider: 'openai',
    },
    status: 'ready' as const,
    metadata: {
      tags: ['support', 'faq', 'help'],
      category: 'Support',
      language: 'en',
    },
    updatedAt: '2024-01-15T10:30:00Z',
  },
  // Add more collections...
]

export default function CollectionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pipelineType = searchParams.get('type')
  
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

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

  const canProceed = selectedCollections.length > 0

  const handleNext = () => {
    if (canProceed) {
      router.push(`/inferencer/new/retrieval?type=${pipelineType}`)
    }
  }

  const handleBack = () => {
    router.push(`/inferencer/new/basic?type=${pipelineType}`)
  }

  // Calculate total stats
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
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Select Document Collections</p>
          <p className="text-muted-foreground">
            Choose one or more document collections that your RAG pipeline will search through 
            to answer queries. You can add more collections later.
          </p>
        </div>
      </div>

      {/* Search & Create New Collection */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/contexter/ingest/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Collection
        </Button>
      </div>

      {/* Collections Grid */}
      <div className="grid gap-4">
        {filteredCollections.map((collection) => {
          const isSelected = selectedCollections.includes(collection.id)
          
          return (
            <Card
              key={collection.id}
              className={cn(
                "cursor-pointer transition-all",
                isSelected && "border-primary bg-primary/5"
              )}
              onClick={() => toggleCollection(collection.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{collection.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {collection.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all",
                    isSelected 
                      ? "bg-primary border-primary" 
                      : "border-border"
                  )}>
                    {isSelected && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{collection.documentCount.toLocaleString()} docs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>{collection.totalChunks.toLocaleString()} chunks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{formatBytes(collection.totalSize)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Model:</span>
                    <span>{collection.embeddingModel.name}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {collection.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected Stats */}
      {selectedCollections.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Selected: {selectedCollections.length} collection{selectedCollections.length !== 1 ? 's' : ''}
              </div>
              <div className="flex gap-4 text-sm">
                <span>{selectedStats.documents.toLocaleString()} documents</span>
                <span>{selectedStats.chunks.toLocaleString()} chunks</span>
                <span>{formatBytes(selectedStats.size)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed}>
          Next: Retrieval Config
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}