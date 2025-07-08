'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select } from '@/components/ui/select'
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
  DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

const searchMethods = [
  {
    id: 'vector',
    name: 'Vector Search',
    description: 'Semantic similarity only',
    icon: Search,
  },
  {
    id: 'hybrid',
    name: 'Hybrid Search',
    description: 'Vector + keyword matching',
    icon: Shuffle,
    recommended: true,
  },
  {
    id: 'keyword',
    name: 'Keyword Search',
    description: 'Traditional text matching',
    icon: FileText,
  },
]

const rerankerModels = [
  {
    id: 'rerank-english-v2.0',
    name: 'rerank-english-v2.0',
    provider: 'Cohere',
    description: 'Fast & accurate',
    recommended: true,
  },
  {
    id: 'bge-reranker-large',
    name: 'bge-reranker-large',
    provider: 'BAAI',
    description: 'Open source',
  },
  {
    id: 'ms-marco-MiniLM',
    name: 'ms-marco-MiniLM',
    provider: 'Microsoft',
    description: 'Lightweight',
  },
  {
    id: 'custom-reranker',
    name: 'custom-reranker',
    provider: 'Your model',
    description: 'Fine-tuned',
  },
]

const filterFields = [
  { value: 'document_type', label: 'Document Type' },
  { value: 'created_date', label: 'Created Date' },
  { value: 'department', label: 'Department' },
  { value: 'language', label: 'Language' },
  { value: 'author', label: 'Author' },
  { value: 'category', label: 'Category' },
]

const filterOperators = [
  { value: 'equals', label: 'equals' },
  { value: 'contains', label: 'contains' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
  { value: 'in', label: 'in' },
  { value: 'not_equals', label: 'not equals' },
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
  const [topK, setTopK] = useState(10)
  const [similarityThreshold, setSimilarityThreshold] = useState(0.75)
  const [enableMMR, setEnableMMR] = useState(true)
  const [enableReranking, setEnableReranking] = useState(true)
  const [selectedReranker, setSelectedReranker] = useState('rerank-english-v2.0')
  const [rerankTopN, setRerankTopN] = useState(5)
  const [preFiltering, setPreFiltering] = useState(false)
  const [filters, setFilters] = useState<MetadataFilter[]>([])

  const handleNext = () => {
    router.push('/pipelines/new/generation')
  }

  const handlePrevious = () => {
    router.push('/pipelines/new/processing')
  }

  const addFilter = () => {
    const newFilter: MetadataFilter = {
      id: Date.now().toString(),
      field: filterFields[0].value,
      operator: filterOperators[0].value,
      value: '',
    }
    setFilters([...filters, newFilter])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id))
  }

  const updateFilter = (id: string, updates: Partial<MetadataFilter>) => {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Retrieval Configuration Tips</p>
          <p className="text-muted-foreground">
            Hybrid search combines vector similarity with keyword matching for better results. 
            Start with 5-10 results and adjust based on your needs.
          </p>
        </div>
      </div>

      {/* Search Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Search Configuration</CardTitle>
          <CardDescription>Configure how documents are retrieved for queries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {searchMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedMethod === method.id
              
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "relative p-6 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  {method.recommended && (
                    <Badge className="absolute top-3 right-3" variant="default">
                      Recommended
                    </Badge>
                  )}
                  <Icon className={cn(
                    "h-10 w-10 mb-3",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )} />
                  <h3 className="font-semibold mb-1">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  {isSelected && (
                    <CheckCircle className="absolute bottom-3 right-3 h-5 w-5 text-primary" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="space-y-6">
            <Slider
              label="Number of Results (top-k)"
              value={topK}
              onChange={setTopK}
              min={1}
              max={50}
              step={1}
              helperText="Number of documents to retrieve before reranking"
            />

            <Slider
              label="Similarity Threshold"
              value={similarityThreshold}
              onChange={setSimilarityThreshold}
              min={0}
              max={1}
              step={0.05}
              formatValue={(value) => value.toFixed(2)}
              helperText="Minimum similarity score (0.0 - 1.0) to include results"
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableMMR}
                onChange={(e) => setEnableMMR(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">
                Enable MMR (Maximum Marginal Relevance) for diverse results
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Metadata Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata Filters</CardTitle>
          <CardDescription>Filter results based on document metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.id} className="flex gap-3 items-end">
                <Select
                  label={filters.indexOf(filter) === 0 ? "Field" : undefined}
                  value={filter.field}
                  onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                  options={filterFields}
                  className="flex-1"
                />
                <Select
                  label={filters.indexOf(filter) === 0 ? "Operator" : undefined}
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                  options={filterOperators}
                  className="flex-1"
                />
                <Input
                  label={filters.indexOf(filter) === 0 ? "Value" : undefined}
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  placeholder="Enter value"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFilter(filter.id)}
                  className="mb-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addFilter}
              className="w-full border-dashed"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Filter
            </Button>
          </div>

          <label className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              checked={preFiltering}
              onChange={(e) => setPreFiltering(e.target.checked)}
              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">
              Apply filters before vector search (pre-filtering)
            </span>
          </label>
        </CardContent>
      </Card>

      {/* Reranking */}
      <Card>
        <CardHeader>
          <CardTitle>Reranking</CardTitle>
          <CardDescription>Improve result relevance with AI-powered reranking</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={enableReranking}
              onChange={(e) => setEnableReranking(e.target.checked)}
              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">
              Enable reranking for better precision
            </span>
          </label>

          {enableReranking && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {rerankerModels.map((model) => {
                  const isSelected = selectedReranker === model.id
                  
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedReranker(model.id)}
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
                        {model.provider} • {model.description}
                      </p>
                      {isSelected && (
                        <CheckCircle className="absolute bottom-3 right-3 h-5 w-5 text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>

              <Slider
                label="Rerank Top N"
                value={rerankTopN}
                onChange={setRerankTopN}
                min={1}
                max={20}
                step={1}
                helperText="Number of documents to keep after reranking"
              />

              {/* Performance Metrics Preview */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium mb-3">Performance Estimates</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-primary mb-1">
                      <Zap className="h-4 w-4" />
                      <span className="text-xl font-semibold">~85ms</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Est. Latency</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                      <Target className="h-4 w-4" />
                      <span className="text-xl font-semibold">94%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Precision@5</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xl font-semibold">$0.001</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Cost per query</p>
                  </div>
                </div>
              </div>
            </>
          )}
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
            Next: Generation →
          </Button>
        </div>
      </div>
    </div>
  )
}
