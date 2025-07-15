'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { 
  Brain,
  Sparkles,
  Zap,
  DollarSign,
  Info,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Settings,
  AlertCircle,
  Wand2,
  Copy,
  RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'

const llmProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    models: [
      {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        description: 'Most capable model, best for complex tasks',
        contextWindow: 128000,
        costPer1kTokens: { input: 0.01, output: 0.03 },
        recommended: true,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and cost-effective for simpler tasks',
        contextWindow: 16385,
        costPer1kTokens: { input: 0.0005, output: 0.0015 },
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🧠',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most powerful, excels at complex analysis',
        contextWindow: 200000,
        costPer1kTokens: { input: 0.015, output: 0.075 },
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance and cost',
        contextWindow: 200000,
        costPer1kTokens: { input: 0.003, output: 0.015 },
      },
    ],
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🎯',
    models: [
      {
        id: 'command-r-plus',
        name: 'Command R+',
        description: 'Optimized for RAG applications',
        contextWindow: 128000,
        costPer1kTokens: { input: 0.003, output: 0.015 },
      },
    ],
  },
]

const promptTemplates = [
  {
    id: 'default',
    name: 'Default Q&A',
    systemPrompt: `You are a helpful AI assistant. Use the following context to answer questions. If you don't know the answer based on the context, say so.

Context: {context}`,
    userPromptTemplate: 'Question: {query}',
  },
  {
    id: 'professional',
    name: 'Professional Support',
    systemPrompt: `You are a professional support agent. Use the provided documentation to give accurate, helpful responses. Always be polite and thorough.

Documentation: {context}`,
    userPromptTemplate: 'Customer Query: {query}',
  },
  {
    id: 'technical',
    name: 'Technical Assistant',
    systemPrompt: `You are a technical documentation assistant. Provide detailed, accurate answers based on the technical documentation provided. Include code examples when relevant.

Technical Context: {context}`,
    userPromptTemplate: 'Technical Question: {query}',
  },
]

export default function LLMConfigPage() {
  const router = useRouter()
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo-preview')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [systemPrompt, setSystemPrompt] = useState(promptTemplates[0].systemPrompt)
  const [userPromptTemplate, setUserPromptTemplate] = useState(promptTemplates[0].userPromptTemplate)
  const [streaming, setStreaming] = useState(true)

  const selectedProviderData = llmProviders.find(p => p.id === selectedProvider)
  const selectedModelData = selectedProviderData?.models.find(m => m.id === selectedModel)

  const handleTemplateSelect = (templateId: string) => {
    const template = promptTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setSystemPrompt(template.systemPrompt)
      setUserPromptTemplate(template.userPromptTemplate)
    }
  }

  const handleNext = () => {
    // Save configuration to session/context
    router.push('/inferencer/new/review')
  }

  const handleBack = () => {
    router.push('/inferencer/new/retrieval')
  }

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">LLM Configuration</p>
          <p className="text-muted-foreground">
            Choose the language model and configure how it responds to queries. 
            The model will use your document collections to provide accurate, contextual answers.
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Language Model</CardTitle>
          <CardDescription>
            Choose the AI model that will generate responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {llmProviders.map((provider) => (
            <div key={provider.id} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="text-lg">{provider.icon}</span>
                {provider.name}
              </div>
              
              <div className="grid gap-3 md:grid-cols-2">
                {provider.models.map((model) => {
                  const isSelected = selectedModel === model.id
                  
                  return (
                    <div
                      key={model.id}
                      className={cn(
                        "relative border rounded-lg p-4 cursor-pointer transition-all",
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      )}
                      onClick={() => {
                        setSelectedProvider(provider.id)
                        setSelectedModel(model.id)
                      }}
                    >
                      {model.recommended && (
                        <Badge className="absolute top-3 right-3" variant="secondary">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{model.name}</h4>
                          {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{model.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {(model.contextWindow / 1000).toFixed(0)}k context
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${model.costPer1kTokens.input}/${model.costPer1kTokens.output}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Model Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Model Parameters</CardTitle>
          <CardDescription>
            Fine-tune the model's behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>Temperature</Label>
                <span className="text-sm font-medium">{temperature}</span>
            </div>
            <Slider
                value={temperature}
                onChange={(value: number) => setTemperature(value)}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused</span>
                <span>Balanced</span>
                <span>Creative</span>
            </div>
           </div>

            {/* Max Tokens */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Max Response Tokens</Label>
                    <span className="text-sm font-medium">{maxTokens}</span>
                </div>
                <Slider
                    value={maxTokens}
                    onChange={(value: number) => setMaxTokens(value)}
                    min={100}
                    max={4000}
                    step={100}
                    className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                    Approximate cost per response: ${selectedModelData ? (maxTokens / 1000 * selectedModelData.costPer1kTokens.output).toFixed(4) : '0.00'}
                </p>
            </div>

          {/* Streaming */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Response Streaming</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Stream responses token by token for better UX
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={streaming}
                onChange={(e) => setStreaming(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Prompt Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Configuration</CardTitle>
          <CardDescription>
            Configure how the model interprets and responds to queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-3 gap-2">
              {promptTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>System Prompt</Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(systemPrompt)
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full min-h-[120px] px-3 py-2 text-sm border border-input bg-background text-foreground rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter system prompt..."
            />
            <p className="text-xs text-muted-foreground">
              Variables: {`{context}`} - Retrieved documents
            </p>
          </div>

          {/* User Prompt Template */}
          <div className="space-y-2">
            <Label>User Prompt Template</Label>
            <textarea
              value={userPromptTemplate}
              onChange={(e) => setUserPromptTemplate(e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background text-foreground rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter user prompt template..."
            />
            <p className="text-xs text-muted-foreground">
              Variables: {`{query}`} - User's question
            </p>
          </div>

          {/* Preview */}
          <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Prompt Preview
            </p>
            <div className="text-xs font-mono text-muted-foreground space-y-2">
              <div className="p-2 bg-background rounded">
                <span className="text-primary">System:</span> {systemPrompt.substring(0, 100)}...
              </div>
              <div className="p-2 bg-background rounded">
                <span className="text-primary">User:</span> {userPromptTemplate}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key Warning */}
      <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-orange-500">API Key Required</p>
          <p className="text-muted-foreground mt-1">
            Make sure you have configured your {selectedProviderData?.name} API key in Settings before deploying.
          </p>
        </div>
      </div>

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
          Next: Review & Deploy
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}