'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { 
  Brain,
  Zap,
  DollarSign,
  Info,
  CheckCircle,
  Eye,
  Code,
  MessageSquare,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const llmModels = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    costPer1kTokens: '$0.01',
    contextWindow: '128K',
    strength: 'High accuracy',
    recommended: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    costPer1kTokens: '$0.015',
    contextWindow: '200K',
    strength: 'Nuanced',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    costPer1kTokens: '$0.001',
    contextWindow: '16K',
    strength: 'Fast',
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta (via Ollama)',
    costPer1kTokens: 'Self-hosted',
    contextWindow: '8K',
    strength: 'Private',
  },
]

const promptVariables = [
  { name: '{context}', description: 'Retrieved document chunks' },
  { name: '{query}', description: 'User\'s question' },
  { name: '{chat_history}', description: 'Previous conversation (if enabled)' },
  { name: '{metadata}', description: 'Document metadata' },
]

export default function GenerationConfigurationPage() {
  const router = useRouter()
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
  const [systemPrompt, setSystemPrompt] = useState(`You are a helpful customer support assistant with access to a knowledge base. Use the provided context to answer questions accurately. If the answer is not in the context, say so politely.

Guidelines:
- Be concise but thorough
- Use a friendly, professional tone
- Reference specific information from the context when available
- Suggest related topics if appropriate`)
  
  const [userPromptTemplate, setUserPromptTemplate] = useState(`Context information:
{context}

Previous conversation:
{chat_history}

User question: {query}

Please provide a helpful and accurate response based on the context above.`)

  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [topP, setTopP] = useState(0.9)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0)
  const [enableStreaming, setEnableStreaming] = useState(true)
  const [includeCitations, setIncludeCitations] = useState(true)
  const [enableMemory, setEnableMemory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handlePrevious = () => {
    router.push('/pipelines/new/retrieval')
  }

  const handleCreatePipeline = () => {
    // In a real app, you'd collect all form data and submit it
    console.log('Creating pipeline...')
    router.push('/pipelines')
  }

  const renderPromptPreview = (template: string) => {
    return template.split(/(\{[^}]+\})/).map((part, index) => {
      if (part.match(/^\{[^}]+\}$/)) {
        return (
          <span key={index} className="text-purple-400 bg-purple-400/10 px-1 rounded">
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Generation Configuration Tips</p>
          <p className="text-muted-foreground">
            Choose based on your needs: GPT-4 for highest quality, GPT-3.5 for speed and cost efficiency, 
            Claude for nuanced responses, or open models for privacy.
          </p>
        </div>
      </div>

      {/* Language Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Language Model</CardTitle>
          <CardDescription>Select the LLM for generating responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {llmModels.map((model) => {
              const isSelected = selectedModel === model.id
              
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  {model.recommended && (
                    <Badge className="absolute top-3 right-3" variant="default">
                      RECOMMENDED
                    </Badge>
                  )}
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.provider}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>{model.costPer1kTokens}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span>{model.contextWindow} context</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-muted-foreground" />
                      <span>{model.strength}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="absolute bottom-3 right-3 h-5 w-5 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Prompt Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Configuration</CardTitle>
          <CardDescription>Design your system and user prompts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            label="System Prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={6}
            helperText="System prompt sets the behavior and personality of the assistant"
          />

          <div>
            <label className="text-sm font-medium mb-2 block">Available Variables</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {promptVariables.map((variable) => (
                <div key={variable.name} className="group relative">
                  <Badge variant="outline" className="font-mono cursor-help">
                    {variable.name}
                  </Badge>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {variable.description}
                  </div>
                </div>
              ))}
            </div>
            <Textarea
              label="User Prompt Template"
              value={userPromptTemplate}
              onChange={(e) => setUserPromptTemplate(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="mb-3"
            >
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
            
            {showPreview && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium mb-2">PROMPT PREVIEW</h4>
                <div className="text-sm whitespace-pre-wrap font-mono">
                  {renderPromptPreview(userPromptTemplate)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Response Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Response Settings</CardTitle>
          <CardDescription>Fine-tune generation parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <Slider
              label="Temperature"
              value={temperature}
              onChange={setTemperature}
              min={0}
              max={2}
              step={0.1}
              formatValue={(value) => value.toFixed(1)}
              helperText="Controls randomness (0 = focused, 2 = creative)"
            />

            <Slider
              label="Max Tokens"
              value={maxTokens}
              onChange={setMaxTokens}
              min={128}
              max={4096}
              step={128}
              helperText="Maximum response length"
            />

            <Slider
              label="Top P"
              value={topP}
              onChange={setTopP}
              min={0}
              max={1}
              step={0.1}
              formatValue={(value) => value.toFixed(1)}
              helperText="Nucleus sampling threshold"
            />

            <Slider
              label="Frequency Penalty"
              value={frequencyPenalty}
              onChange={setFrequencyPenalty}
              min={-2}
              max={2}
              step={0.1}
              formatValue={(value) => value.toFixed(1)}
              helperText="Reduce repetition (-2 to 2)"
            />
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableStreaming}
                onChange={(e) => setEnableStreaming(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">
                Enable streaming responses
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={includeCitations}
                onChange={(e) => setIncludeCitations(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">
                Include source citations in response
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enableMemory}
                onChange={(e) => setEnableMemory(e.target.checked)}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">
                Enable conversation memory (stateful chat)
              </span>
            </label>
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
          <Button onClick={handleCreatePipeline} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-2 h-4 w-4" />
            Create Pipeline
          </Button>
        </div>
      </div>
    </div>
  )
}
