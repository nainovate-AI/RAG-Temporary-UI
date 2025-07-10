'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

import { 
  FileText, 
  Scissors, 
  Layers,
  Info,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Hash,
  Type, // Changed from LetterText
  Braces,
  FileCode,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const chunkingStrategies = [
  {
    id: 'recursive',
    name: 'Recursive Text Splitter',
    description: 'Intelligently splits text preserving paragraph and sentence boundaries',
    icon: FileText,
    recommended: true,
    pros: ['Maintains context', 'Respects document structure', 'Best for most use cases'],
    cons: ['May create uneven chunk sizes'],
    bestFor: 'General documents, articles, documentation',
  },
  {
    id: 'fixed',
    name: 'Fixed Size',
    description: 'Splits text into chunks of exact character count',
    icon: Scissors,
    pros: ['Predictable chunk sizes', 'Fast processing', 'Memory efficient'],
    cons: ['May break sentences', 'Loss of context at boundaries'],
    bestFor: 'Large datasets, logs, structured data',
  },
  {
    id: 'semantic',
    name: 'Semantic Chunking',
    description: 'Uses AI to identify meaningful semantic boundaries',
    icon: Layers,
    pros: ['Best context preservation', 'Topic-aware splitting', 'High quality'],
    cons: ['Slower processing', 'Higher cost', 'Requires AI model'],
    bestFor: 'Complex documents, research papers, legal texts',
  },
]

const textPreprocessingOptions = [
  { id: 'lowercase', label: 'Convert to lowercase', icon: Type, enabled: false }, // Changed icon
  { id: 'remove_html', label: 'Remove HTML tags', icon: Braces, enabled: true },
  { id: 'remove_urls', label: 'Remove URLs', icon: Hash, enabled: false },
  { id: 'extract_metadata', label: 'Extract metadata', icon: FileCode, enabled: true },
]

export default function ProcessingConfigPage() {
  const router = useRouter()
  const [selectedStrategy, setSelectedStrategy] = useState('recursive')
  const [chunkSize, setChunkSize] = useState(512)
  const [chunkOverlap, setChunkOverlap] = useState(64)
  const [preprocessingOptions, setPreprocessingOptions] = useState(textPreprocessingOptions)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const selectedStrategyData = chunkingStrategies.find(s => s.id === selectedStrategy)

  const handleNext = () => {
    // Save configuration to session/context
    router.push('/documents/ingest/new/embedding')
  }

  const handleBack = () => {
    router.push('/documents/ingest/new')
  }

  const togglePreprocessing = (optionId: string) => {
    setPreprocessingOptions(prev =>
      prev.map(opt =>
        opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
      )
    )
  }

  // Calculate estimated chunks based on average document size
  const estimatedChunksPerDoc = Math.ceil(10000 / (chunkSize - chunkOverlap))
  const estimatedTotalChunks = estimatedChunksPerDoc * 10 // Assuming 10 docs for demo

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Processing Configuration</p>
          <p className="text-muted-foreground">
            These settings determine how your documents are split into searchable chunks. 
            The right configuration depends on your document types and use case.
          </p>
        </div>
      </div>

      {/* Chunking Strategy Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chunking Strategy</CardTitle>
          <CardDescription>
            Choose how documents should be split into chunks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {chunkingStrategies.map((strategy) => {
            const Icon = strategy.icon
            const isSelected = selectedStrategy === strategy.id

            return (
              <div
                key={strategy.id}
                className={cn(
                  "relative border rounded-lg p-4 cursor-pointer transition-all",
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                {strategy.recommended && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
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
                      <h3 className="font-medium">{strategy.name}</h3>
                      {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {strategy.description}
                    </p>
                    
                    {isSelected && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-4 text-xs">
                          <div>
                            <p className="font-medium text-green-600 mb-1">Pros:</p>
                            <ul className="space-y-0.5">
                              {strategy.pros.map((pro, i) => (
                                <li key={i} className="text-muted-foreground">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium text-orange-600 mb-1">Cons:</p>
                            <ul className="space-y-0.5">
                              {strategy.cons.map((con, i) => (
                                <li key={i} className="text-muted-foreground">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="text-xs">
                          <span className="font-medium">Best for:</span>{' '}
                          <span className="text-muted-foreground">{strategy.bestFor}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Chunk Size Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Chunk Parameters</CardTitle>
          <CardDescription>
            Fine-tune the chunking behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chunk Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>Chunk Size (characters)</Label>
                <span className="text-sm font-medium">{chunkSize.toString()}</span>
            </div>
            <Slider
                value={chunkSize}
                onChange={(value: number) => setChunkSize(value)}
                min={128}
                max={2048}
                step={128}
                className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>128 (small)</span>
                <span>1024 (medium)</span>
                <span>2048 (large)</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                Smaller chunks provide more precise results but may lose context. 
                Larger chunks maintain context but may be less precise.
            </p>
          </div>

          {/* Chunk Overlap */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>Chunk Overlap (characters)</Label>
                <span className="text-sm font-medium">{chunkOverlap.toString()}</span>
            </div>
            <Slider
                value={chunkOverlap}
                onChange={(value: number) => setChunkOverlap(value)}
                min={0}
                max={Math.min(256, Math.floor(chunkSize * 0.5))}
                step={16}
                className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
                Overlap helps maintain context between chunks. Typically 10-20% of chunk size.
            </p>
          </div>

          {/* Estimation */}
          <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
            <p className="text-sm font-medium">Estimated Output</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Chunks per document</p>
                <p className="font-medium">~{estimatedChunksPerDoc}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total chunks</p>
                <p className="font-medium">~{estimatedTotalChunks}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Preprocessing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Text Preprocessing</CardTitle>
              <CardDescription>
                Optional text transformations before chunking
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-3">
            {preprocessingOptions.map((option) => {
              const Icon = option.icon
              return (
                <label
                  key={option.id}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={option.enabled}
                    onChange={() => togglePreprocessing(option.id)}
                    className="h-4 w-4"
                  />
                </label>
              )
            })}

            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-500">Preprocessing Note</p>
                  <p className="text-muted-foreground mt-1">
                    Some preprocessing options may affect search accuracy. Test with your specific use case.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
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
          Next: Embedding
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}