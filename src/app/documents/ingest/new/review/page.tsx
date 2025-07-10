'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle,
  ChevronLeft,
  Upload,
  Settings,
  Brain,
  Database,
  FileText,
  Loader2,
  AlertCircle,
  Info,
  Play,
  Edit2,
  Clock,
  DollarSign,
  HardDrive,
  Hash,
  Folder
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data - in real app, this would come from context/session
const reviewData = {
  collection: {
    name: 'Customer Support Knowledge Base',
    description: 'Product documentation, FAQs, and support articles for customer service',
    tags: ['support', 'documentation', 'faqs'],
    accessLevel: 'public',
  },
  documents: {
    count: 10,
    totalSize: 25600000, // 25.6 MB
    files: [
      { name: 'product-guide.pdf', size: 5242880 },
      { name: 'faq-collection.docx', size: 2097152 },
      { name: 'troubleshooting.md', size: 524288 },
      // ... more files
    ],
  },
  processing: {
    strategy: 'recursive',
    chunkSize: 512,
    chunkOverlap: 64,
    preprocessing: ['remove_html', 'extract_metadata'],
  },
  embedding: {
    model: 'text-embedding-ada-002',
    provider: 'OpenAI',
    dimensions: 1536,
    batchSize: 100,
  },
  vectorStore: {
    type: 'qdrant',
    connectionType: 'cloud',
    collectionName: 'customer_support_v2',
  },
  estimates: {
    chunks: 1000,
    processingTime: 5, // minutes
    cost: 0.10,
    storage: 6200000, // 6.2 MB
  },
}

const steps = [
  { id: 'collection', title: 'Collection Info', icon: Folder, path: '/documents/ingest/new' },
  { id: 'processing', title: 'Processing', icon: Settings, path: '/documents/ingest/new/processing' },
  { id: 'embedding', title: 'Embedding', icon: Brain, path: '/documents/ingest/new/embedding' },
  { id: 'vectorstore', title: 'Vector Store', icon: Database, path: '/documents/ingest/new/vector-store' },
]

export default function ReviewPage() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleEdit = (path: string) => {
    router.push(path)
  }

  const handleStartIngestion = async () => {
    if (!agreedToTerms) return

    setIsStarting(true)
    
    try {
        // In a real app, this would:
        // 1. Create the ingestion job via API
        // 2. Get the collection ID from the response
        // 3. Redirect to the documents page
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Redirect to documents page
        // The documents page will show the new collection with "processing" status
        router.push('/documents')
        
        // Alternative: If you want to go directly to the specific collection page:
        // const newCollectionId = 'generated-id-from-api'
        // router.push(`/documents/collections/${newCollectionId}`)
        
    } catch (error) {
        console.error('Failed to start ingestion:', error)
        setIsStarting(false)
        // Show error toast/notification
    }
    }

  const handleBack = () => {
    router.push('/documents/ingest/new/vector-store')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Review Configuration</h2>
        <p className="text-muted-foreground">
          Review your settings before starting the ingestion process
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-4">
        {/* Collection Info */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Collection Information</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[0].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{reviewData.collection.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Access Level</p>
                <Badge variant="outline">{reviewData.collection.accessLevel}</Badge>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Description</p>
              <p className="text-sm mt-1">{reviewData.collection.description}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">Tags</p>
              <div className="flex gap-2">
                {reviewData.collection.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Documents</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[0].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Files</p>
                <p className="font-medium">{reviewData.documents.count} documents</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Size</p>
                <p className="font-medium">{(reviewData.documents.totalSize / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Processing Configuration</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[1].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Strategy</p>
                <p className="font-medium capitalize">{reviewData.processing.strategy}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Chunk Size</p>
                <p className="font-medium">{reviewData.processing.chunkSize} chars</p>
              </div>
              <div>
                <p className="text-muted-foreground">Overlap</p>
                <p className="font-medium">{reviewData.processing.chunkOverlap} chars</p>
              </div>
            </div>
            {reviewData.processing.preprocessing.length > 0 && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Preprocessing</p>
                <div className="flex gap-2">
                  {reviewData.processing.preprocessing.map(option => (
                    <Badge key={option} variant="outline" className="text-xs">
                      {option.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Embedding Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Embedding Model</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[2].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Model</p>
                <p className="font-medium">{reviewData.embedding.model}</p>
                <p className="text-xs text-muted-foreground">{reviewData.embedding.provider}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dimensions</p>
                <p className="font-medium">{reviewData.embedding.dimensions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vector Store Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Vector Store</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(steps[3].path)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Store</p>
                <p className="font-medium capitalize">{reviewData.vectorStore.type}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {reviewData.vectorStore.connectionType}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Collection</p>
                <p className="font-medium font-mono text-xs">{reviewData.vectorStore.collectionName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Estimates */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Processing Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <Hash className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Chunks</p>
                <p className="font-medium text-lg">~{reviewData.estimates.chunks.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium text-lg">~{reviewData.estimates.processingTime} min</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Cost</p>
                <p className="font-medium text-lg">${reviewData.estimates.cost.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <HardDrive className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Storage</p>
                <p className="font-medium text-lg">~{(reviewData.estimates.storage / 1024 / 1024).toFixed(1)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Warnings */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-600">Important Notes</p>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>• The ingestion process cannot be cancelled once started</li>
                    <li>• Processing time depends on document complexity and API availability</li>
                    <li>• You'll be charged for embedding API usage (if applicable)</li>
                    <li>• Documents will be permanently stored in the vector database</li>
                  </ul>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  I understand the processing will start immediately and incur the estimated costs shown above
                </span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isStarting}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleStartIngestion}
          disabled={!agreedToTerms || isStarting}
          size="lg"
          className="min-w-[200px]"
        >
          {isStarting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Starting Ingestion...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start Ingestion
            </>
          )}
        </Button>
      </div>
    </div>
  )
}