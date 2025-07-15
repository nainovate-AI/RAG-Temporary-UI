'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Brain,
  Zap,
  DollarSign,
  Info,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Globe,
  Lock,
  Cpu
} from 'lucide-react'
import { cn } from '@/lib/utils'

const embeddingModels = [
  {
    id: 'text-embedding-ada-002',
    name: 'text-embedding-ada-002',
    provider: 'OpenAI',
    providerIcon: '🤖',
    dimensions: 1536,
    maxTokens: 8192,
    costPer1M: 0.10,
    speed: 'fast',
    quality: 'high',
    recommended: true,
    description: 'OpenAI\'s most popular embedding model. Great balance of quality and cost.',
    pros: ['High quality', 'Fast', 'Well-documented', 'Widely supported'],
    cons: ['Requires API key', 'Costs money'],
  },
  {
    id: 'text-embedding-3-small',
    name: 'text-embedding-3-small',
    provider: 'OpenAI',
    providerIcon: '🤖',
    dimensions: 1536,
    maxTokens: 8192,
    costPer1M: 0.02,
    speed: 'very fast',
    quality: 'good',
    description: 'Newer, more efficient model from OpenAI. Lower cost with good performance.',
    pros: ['Very cost-effective', 'Fast', 'Good quality'],
    cons: ['Newer model', 'Less tested'],
  },
  {
    id: 'bge-large-en-v1.5',
    name: 'bge-large-en-v1.5',
    provider: 'BAAI',
    providerIcon: '🌟',
    dimensions: 1024,
    maxTokens: 512,
    costPer1M: 0,
    speed: 'medium',
    quality: 'high',
    description: 'Open-source model with excellent performance. Can run locally.',
    pros: ['Free', 'Open source', 'High quality', 'Privacy-friendly'],
    cons: ['Requires more resources', 'Slower than API models'],
  },
  {
    id: 'e5-large-v2',
    name: 'e5-large-v2',
    provider: 'Microsoft',
    providerIcon: '🪟',
    dimensions: 1024,
    maxTokens: 512,
    costPer1M: 0,
    speed: 'medium',
    quality: 'high',
    description: 'Microsoft\'s open-source embedding model. Great for local deployment.',
    pros: ['Free', 'Open source', 'Good multilingual support'],
    cons: ['Requires local compute', 'Slower processing'],
  },
  {
    id: 'voyage-2',
    name: 'voyage-2',
    provider: 'Voyage AI',
    providerIcon: '🚀',
    dimensions: 1024,
    maxTokens: 4096,
    costPer1M: 0.10,
    speed: 'fast',
    quality: 'very high',
    description: 'Premium embedding model optimized for retrieval tasks.',
    pros: ['Excellent quality', 'Optimized for RAG', 'Good support'],
    cons: ['Higher cost', 'Less popular'],
  },
  {
    id: 'cohere-embed-v3',
    name: 'embed-english-v3.0',
    provider: 'Cohere',
    providerIcon: '🎯',
    dimensions: 1024,
    maxTokens: 512,
    costPer1M: 0.10,
    speed: 'fast',
    quality: 'high',
    description: 'Cohere\'s latest embedding model with strong performance.',
    pros: ['High quality', 'Good API', 'Multilingual options'],
    cons: ['Requires API key', 'Less ecosystem support'],
  },
]

export default function EmbeddingConfigPage() {
  const router = useRouter()
  const [selectedModel, setSelectedModel] = useState('text-embedding-ada-002')
  const [batchSize, setBatchSize] = useState(100)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const selectedModelData = embeddingModels.find(m => m.id === selectedModel)

  const handleNext = () => {
    // Save configuration to session/context
    router.push('/contexter/ingest/new/vector-store')
  }

  const handleBack = () => {
    router.push('/contexter/ingest/new/processing')
  }

  // Estimate processing metrics
  const estimatedChunks = 1000 // From previous step
  const estimatedCost = selectedModelData ? (estimatedChunks / 1000000) * selectedModelData.costPer1M : 0
  const estimatedTime = selectedModelData ? 
    (selectedModelData.speed === 'very fast' ? 2 : 
     selectedModelData.speed === 'fast' ? 5 : 10) : 5

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Embedding Model Selection</p>
          <p className="text-muted-foreground">
            The embedding model converts your text chunks into numerical vectors for semantic search. 
            Choose based on your quality, speed, and cost requirements.
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Embedding Model</CardTitle>
          <CardDescription>
            Select the model that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {embeddingModels.map((model) => {
              const isSelected = selectedModel === model.id
              const isFree = model.costPer1M === 0

              return (
                <div
                  key={model.id}
                  className={cn(
                    "relative border rounded-lg p-4 cursor-pointer transition-all",
                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedModel(model.id)}
                >
                  {model.recommended && (
                    <Badge className="absolute top-3 right-3" variant="secondary">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  )}

                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{model.providerIcon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{model.name}</h3>
                          {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{model.provider}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground">
                      {model.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3 w-3 text-muted-foreground" />
                        <span>{model.dimensions} dims</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-muted-foreground" />
                        <span>{model.speed}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span>{model.quality} quality</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isFree ? (
                          <>
                            <Lock className="h-3 w-3 text-green-500" />
                            <span className="text-green-600 font-medium">Free</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span>${model.costPer1M}/1M</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Pros and Cons (shown when selected) */}
                    {isSelected && (
                      <div className="pt-3 border-t space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="font-medium text-green-600 mb-1">Pros:</p>
                            <ul className="space-y-0.5">
                              {model.pros.map((pro, i) => (
                                <li key={i} className="text-muted-foreground">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-orange-600 mb-1">Cons:</p>
                            <ul className="space-y-0.5">
                              {model.cons.map((con, i) => (
                                <li key={i} className="text-muted-foreground">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Processing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Configuration</CardTitle>
          <CardDescription>
            Configure how embeddings are generated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Batch Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Batch Size</Label>
              <span className="text-sm font-medium">{batchSize}</span>
            </div>
            <input
              type="range"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              min={10}
              max={500}
              step={10}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Number of chunks to process in parallel. Higher values are faster but use more memory.
            </p>
          </div>

          {/* Cost Estimation */}
          <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
            <p className="text-sm font-medium">Processing Estimates</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Chunks</p>
                <p className="font-medium">~{estimatedChunks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Cost</p>
                <p className="font-medium">
                  {selectedModelData?.costPer1M === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${estimatedCost.toFixed(4)}`
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Time</p>
                <p className="font-medium">~{estimatedTime} min</p>
              </div>
            </div>
          </div>

          {/* Warning for paid models */}
          {selectedModelData && selectedModelData.costPer1M > 0 && (
            <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-500">API Key Required</p>
                <p className="text-muted-foreground mt-1">
                  This model requires an API key from {selectedModelData.provider}. 
                  Make sure you have configured it in Settings.
                </p>
              </div>
            </div>
          )}

          {/* Info for local models */}
          {selectedModelData && selectedModelData.costPer1M === 0 && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-600">Local Model</p>
                <p className="text-muted-foreground mt-1">
                  This model runs locally on your infrastructure. No API costs, but requires compute resources.
                </p>
              </div>
            </div>
          )}
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
        >
          Next: Vector Store
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}