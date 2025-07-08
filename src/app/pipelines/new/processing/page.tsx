'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select } from '@/components/ui/select'
import { 
  FileText, 
  Scissors, 
  Layers,
  Info,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const chunkingStrategies = [
  {
    id: 'recursive',
    name: 'Recursive Split',
    description: 'Smart paragraph-aware splitting',
    icon: FileText,
    recommended: true,
  },
  {
    id: 'fixed',
    name: 'Fixed Size',
    description: 'Split by character count',
    icon: Scissors,
  },
  {
    id: 'semantic',
    name: 'Semantic',
    description: 'AI-powered semantic boundaries',
    icon: Layers,
  },
]

const embeddingModels = [
  {
    id: 'text-embedding-ada-002',
    name: 'text-embedding-ada-002',
    provider: 'OpenAI',
    dimensions: 1536,
    recommended: true,
  },
  {
    id: 'bge-large-en-v1.5',
    name: 'bge-large-en-v1.5',
    provider: 'BAAI',
    dimensions: 1024,
  },
  {
    id: 'e5-large-v2',
    name: 'e5-large-v2',
    provider: 'Microsoft',
    dimensions: 1024,
  },
  {
    id: 'voyage-02',
    name: 'voyage-02',
    provider: 'Voyage AI',
    dimensions: 1024,
  },
]

const vectorStores = [
  { value: 'qdrant', label: 'Qdrant Cloud' },
  { value: 'pinecone', label: 'Pinecone' },
  { value: 'weaviate', label: 'Weaviate' },
  { value: 'chroma', label: 'Chroma' },
  { value: 'faiss', label: 'FAISS (Local)' },
]

export default function DocumentProcessingPage() {
  const router = useRouter()
  const [selectedStrategy, setSelectedStrategy] = useState('recursive')
  const [selectedEmbedding, setSelectedEmbedding] = useState('text-embedding-ada-002')
  const [chunkSize, setChunkSize] = useState(512)
  const [chunkOverlap, setChunkOverlap] = useState(64)
  const [selectedVectorStore, setSelectedVectorStore] = useState('qdrant')
  const [collectionName, setCollectionName] = useState('')
  const [enableMetadata, setEnableMetadata] = useState(true)

  const handleNext = () => {
    router.push('/pipelines/new/retrieval')
  }

  const handlePrevious = () => {
    router.push('/pipelines/new')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Document Processing Tips</p>
          <p className="text-muted-foreground">
            Document processing settings affect retrieval quality. Smaller chunks provide more precise 
            context but may miss broader information. Adjust based on your use case.
          </p>
        </div>
      </div>

      {/* Chunking Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Chunking Strategy</CardTitle>
          <CardDescription>Choose how documents are split into searchable chunks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {chunkingStrategies.map((strategy) => {
              const Icon = strategy.icon
              const isSelected = selectedStrategy === strategy.id
              
              return (
                <button
                  key={strategy.id}
                  onClick={() => setSelectedStrategy(strategy.id)}
                  className={cn(
                    "relative p-6 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  {strategy.recommended && (
                    <Badge className="absolute top-3 right-3" variant="default">
                      Recommended
                    </Badge>
                  )}
                  <Icon className={cn(
                    "h-10 w-10 mb-3",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h3 className="font-semibold mb-1">{strategy.name}</h3>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  {isSelected && (
                    <CheckCircle className="absolute bottom-3 right-3 h-5 w-5 text-primary" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-6">
            <Slider
              label="Chunk Size"
              value={chunkSize}
              onChange={setChunkSize}
              min={128}
              max={2048}
              step={128}
              formatValue={(value) => `${value} tokens`}
              helperText="Recommended: 256-512 for Q&A, 512-1024 for summarization"
            />

            <Slider
              label="Chunk Overlap"
              value={chunkOverlap}
              onChange={setChunkOverlap}
              min={0}
              max={256}
              step={16}
              formatValue={(value) => `${value} tokens`}
              helperText="Overlap ensures context continuity between chunks"
            />
          </div>
        </CardContent>
      </Card>

      {/* Embedding Model */}
      <Card>
        <CardHeader>
          <CardTitle>Embedding Model</CardTitle>
          <CardDescription>Select the model to convert text into vector representations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {embeddingModels.map((model) => {
              const isSelected = selectedEmbedding === model.id
              
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedEmbedding(model.id)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  {model.recommended && (
                    <Badge className="absolute top-3 right-3" variant="default">
                      Recommended
                    </Badge>
                  )}
                  <h3 className="font-semibold mb-1">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {model.provider} • {model.dimensions} dimensions
                  </p>
                  {isSelected && (
                    <CheckCircle className="absolute bottom-3 right-3 h-5 w-5 text-primary" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableMetadata}
                onChange={(e) => setEnableMetadata(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">
                Extract and preserve document metadata (title, date, author)
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Vector Store Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Vector Store</CardTitle>
          <CardDescription>Select and configure your vector database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Vector Database"
            value={selectedVectorStore}
            onChange={(e) => setSelectedVectorStore(e.target.value)}
            options={vectorStores}
          />

          <div>
            <label className="block text-sm font-medium mb-2">Collection Name</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g., customer-support-v2"
              className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use lowercase letters, numbers, and hyphens only
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Index Configuration (Optional)</label>
            <textarea
              placeholder="Additional index configuration (JSON)"
              rows={4}
              className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
              defaultValue={`{
  "metric": "cosine",
  "ef_construction": 200,
  "m": 16
}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button variant="ghost">Save as Draft</Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrevious}>
            ← Previous
          </Button>
          <Button onClick={handleNext}>
            Next: Retrieval →
          </Button>
        </div>
      </div>
    </div>
  )
}

