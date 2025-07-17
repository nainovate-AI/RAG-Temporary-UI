'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Shuffle,
  FileText,
  Info,
  CheckCircle,
  Plus,
  X,
  Zap,
  Target,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Filter,
  Hash
} from 'lucide-react'
import { cn } from '@/lib/utils'

const searchMethods = [
  {
    id: 'vector',
    name: 'Vector Search',
    description: 'Pure semantic similarity search using embeddings',
    icon: Search,
    pros: ['Fast', 'Good for semantic queries', 'Language agnostic'],
    cons: ['May miss exact matches', 'Requires good embeddings'],
    bestFor: 'Conceptual questions, similar meaning searches',
  },
  {
    id: 'hybrid',
    name: 'Hybrid Search',
    description: 'Combines vector search with keyword matching',
    icon: Shuffle,
    recommended: true,
    pros: ['Best of both worlds', 'Catches exact matches', 'Most versatile'],
    cons: ['Slightly slower', 'More complex to tune'],
    bestFor: 'Most use cases, especially mixed query types',
  },
  {
    id: 'keyword',
    name: 'Keyword Search',
    description: 'Traditional BM25 keyword matching',
    icon: FileText,
    pros: ['Fast', 'Great for exact matches', 'No embeddings needed'],
    cons: ['No semantic understanding', 'Language dependent'],
    bestFor: 'Exact term matching, technical queries',
  },
]

const rerankerModels = [
  {
    id: 'none',
    name: 'No Reranking',
    provider: 'None',
    description: 'Use initial search results as-is',
    cost: 0,
  },
  {
    id: 'cohere-rerank-english-v2',
    name: 'Cohere Rerank v2',
    provider: 'Cohere',
    description: 'Fast and accurate English reranking',
    recommended: true,
    cost: 0.015, // per 1k docs
  },
  {
    id: 'bge-reranker-large',
    name: 'BGE Reranker Large',
    provider: 'BAAI',
    description: 'Open-source reranking model',
    cost: 0, // self-hosted
  },
  {
    id: 'cross-encoder-ms-marco',
    name: 'MS MARCO Cross-Encoder',
    provider: 'Microsoft',
    description: 'High-quality cross-encoder reranking',
    cost: 0, // self-hosted
  },
]

const commonFilters = [
  { field: 'document_type', label: 'Document Type', type: 'select' },
  { field: 'created_date', label: 'Created Date', type: 'date' },
  { field: 'category', label: 'Category', type: 'select' },
  { field: 'language', label: 'Language', type: 'select' },
  { field: 'department', label: 'Department', type: 'select' },
]

interface MetadataFilter {
  id: string
  field: string
  operator: string
  value: string
}

export default function RetrievalConfigurationPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState('hybrid')
  const [topK, setTopK] = useState(5)
  const [scoreThreshold, setScoreThreshold] = useState(0.7)
  const [useReranker, setUseReranker] = useState(true)
  const [selectedReranker, setSelectedReranker] = useState('cohere-rerank-english-v2')
  const [rerankerTopN, setRerankerTopN] = useState(3)
  const [metadataFilters, setMetadataFilters] = useState<MetadataFilter[]>([])
  const [hybridAlpha, setHybridAlpha] = useState(0.5) // For hybrid search

  const handleNext = () => {
    // Save configuration to session/context
    router.push('/inferencer/new/memory?type=rag')
  }

  const handleBack = () => {
    router.push('/inferencer/new')
  }

  const addMetadataFilter = () => {
    const newFilter: MetadataFilter = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
    }
    setMetadataFilters([...metadataFilters, newFilter])
  }

  const removeMetadataFilter = (id: string) => {
    setMetadataFilters(metadataFilters.filter(f => f.id !== id))
  }

  const updateMetadataFilter = (id: string, updates: Partial<MetadataFilter>) => {
    setMetadataFilters(metadataFilters.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ))
  }

  // Calculate estimated costs
  const estimatedRerankerCost = useReranker && selectedReranker !== 'none' ? 
    (rerankerModels.find(r => r.id === selectedReranker)?.cost || 0) * 10 : 0 // Assuming 10k queries/day

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Retrieval Configuration</p>
          <p className="text-muted-foreground">
            Configure how your pipeline searches and ranks documents. The right settings 
            depend on your use case and query patterns.
          </p>
        </div>
      </div>

      {/* Search Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Search Method</CardTitle>
          <CardDescription>
            Choose how to search through your document collections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {searchMethods.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id

            return (
              <div
                key={method.id}
                className={cn(
                  "relative border rounded-lg p-4 cursor-pointer transition-all",
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedMethod(method.id)}
              >
                {method.recommended && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}

                <div className="flex gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{method.name}</h3>
                      {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    
                    {isSelected && (
                      <div className="mt-3 space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-medium text-green-600 mb-1">Pros:</p>
                            <ul className="space-y-0.5">
                              {method.pros.map((pro, i) => (
                                <li key={i} className="text-muted-foreground">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-orange-600 mb-1">Cons:</p>
                            <ul className="space-y-0.5">
                              {method.cons.map((con, i) => (
                                <li key={i} className="text-muted-foreground">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="text-xs">
                          <span className="font-medium">Best for:</span>{' '}
                          <span className="text-muted-foreground">{method.bestFor}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Hybrid Search Alpha (if hybrid selected) */}
          {selectedMethod === 'hybrid' && (
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg space-y-3">
              <Label>Vector vs Keyword Weight</Label>
              <div className="space-y-2">
                <Slider
                  value={hybridAlpha}
                  onChange={(value: number) => setHybridAlpha(value)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>More Keyword</span>
                  <span className="font-medium">{hybridAlpha.toFixed(1)}</span>
                  <span>More Vector</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retrieval Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Retrieval Parameters</CardTitle>
          <CardDescription>
            Fine-tune how many results to retrieve and filter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top K */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Number of Results (Top-K)</Label>
              <span className="text-sm font-medium">{topK}</span>
            </div>
            <Slider
              value={topK}
              onChange={(value: number) => setTopK(value)}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Number of documents to retrieve before reranking
            </p>
          </div>

          {/* Score Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Minimum Score Threshold</Label>
              <span className="text-sm font-medium">{scoreThreshold.toFixed(2)}</span>
            </div>
            <Slider
              value={scoreThreshold}
              onChange={(value: number) => setScoreThreshold(value)}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Only return results above this similarity score
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reranking Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reranking</CardTitle>
              <CardDescription>
                Improve result quality with a second-stage ranking model
              </CardDescription>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useReranker}
                onChange={(e) => setUseReranker(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </CardHeader>
        {useReranker && (
          <CardContent className="space-y-4">
            {/* Reranker Model Selection */}
            <div className="grid gap-3">
              {rerankerModels.map((model) => {
                const isSelected = selectedReranker === model.id
                
                return (
                  <div
                    key={model.id}
                    className={cn(
                      "relative border rounded-lg p-3 cursor-pointer transition-all",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setSelectedReranker(model.id)}
                  >
                    {model.recommended && (
                      <Badge className="absolute top-3 right-3" variant="secondary">
                        Recommended
                      </Badge>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{model.name}</h4>
                          {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="text-muted-foreground">Provider: {model.provider}</span>
                          {model.cost > 0 ? (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ${model.cost}/1k docs
                            </span>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Free</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Reranker Top N */}
            {selectedReranker !== 'none' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Final Results (Top-N)</Label>
                  <span className="text-sm font-medium">{rerankerTopN}</span>
                </div>
                <Slider
                  value={rerankerTopN}
                  onChange={(value: number) => setRerankerTopN(value)}
                  min={1}
                  max={Math.min(topK, 10)}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Number of results to return after reranking
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Metadata Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Metadata Filters</CardTitle>
              <CardDescription>
                Add filters to narrow down search results
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addMetadataFilter}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Filter
            </Button>
          </div>
        </CardHeader>
        {metadataFilters.length > 0 && (
          <CardContent className="space-y-3">
            {metadataFilters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-2">
                <select
                  value={filter.field}
                  onChange={(e) => updateMetadataFilter(filter.id, { field: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                >
                  <option value="">Select field...</option>
                  {commonFilters.map(f => (
                    <option key={f.field} value={f.field}>{f.label}</option>
                  ))}
                </select>
                
                <select
                  value={filter.operator}
                  onChange={(e) => updateMetadataFilter(filter.id, { operator: e.target.value })}
                  className="px-3 py-2 text-sm border rounded-md bg-background"
                >
                  <option value="equals">equals</option>
                  <option value="contains">contains</option>
                  <option value="greater_than">greater than</option>
                  <option value="less_than">less than</option>
                  <option value="in">in</option>
                </select>
                
                <Input
                  value={filter.value}
                  onChange={(e) => updateMetadataFilter(filter.id, { value: e.target.value })}
                  placeholder="Value..."
                  className="flex-1"
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMetadataFilter(filter.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Cost Estimation */}
      {estimatedRerankerCost > 0 && (
        <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-orange-600">Estimated Reranking Cost</p>
            <p className="text-muted-foreground mt-1">
              ~${estimatedRerankerCost.toFixed(2)}/day based on current query volume
            </p>
          </div>
        </div>
      )}

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
          Next: Memory Configuration
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}