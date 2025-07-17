// src/app/inferencer/new/memory/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Brain,
  MessageSquare,
  Database,
  Sparkles,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const memoryTypes = [
  {
    id: 'none',
    title: 'None (Stateless)',
    description: 'Each query is independent, no conversation history',
    icon: MessageSquare,
    config: null,
  },
  {
    id: 'buffer',
    title: 'Buffer Memory',
    description: 'Keep last N messages in conversation',
    icon: Clock,
    config: {
      windowSize: { label: 'Window Size', type: 'select', options: [5, 10, 20, 50], default: 10 },
      tokenLimit: { label: 'Token Limit', type: 'number', default: 2000 },
    },
  },
  {
    id: 'summary',
    title: 'Summary Memory',
    description: 'AI-generated summary of conversation history',
    icon: Brain,
    config: {
      summaryModel: { 
        label: 'Summary Model', 
        type: 'select', 
        options: ['gpt-3.5-turbo', 'gpt-4', 'claude-2'], 
        default: 'gpt-3.5-turbo' 
      },
      summaryLength: { label: 'Max Summary Length', type: 'number', default: 500 },
    },
  },
  {
    id: 'vector',
    title: 'Vector Memory',
    description: 'Semantic search over conversation history',
    icon: Database,
    config: {
      collectionName: { label: 'Collection Name', type: 'text', default: 'conversation-history' },
      topK: { label: 'Retrieved Messages', type: 'select', options: [3, 5, 10], default: 5 },
    },
  },
  {
    id: 'hybrid',
    title: 'Hybrid (Summary + Vector)',
    description: 'Combination of summary and semantic search',
    icon: Sparkles,
    config: {
      summaryModel: { 
        label: 'Summary Model', 
        type: 'select', 
        options: ['gpt-3.5-turbo', 'gpt-4'], 
        default: 'gpt-3.5-turbo' 
      },
      vectorTopK: { label: 'Retrieved Messages', type: 'select', options: [3, 5], default: 3 },
    },
  },
]

const storageBackends = [
  { id: 'memory', label: 'In-Memory (session only)' },
  { id: 'redis', label: 'Redis (persistent)' },
  { id: 'postgresql', label: 'PostgreSQL (long-term)' },
]

export default function MemoryConfigPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pipelineType = searchParams.get('type')
  
  const [selectedMemoryType, setSelectedMemoryType] = useState('buffer')
  const [storageBackend, setStorageBackend] = useState('memory')
  const [ttl, setTtl] = useState(24) // hours
  const [autoClean, setAutoClean] = useState(true)
  const [storePreferences, setStorePreferences] = useState(true)
  const [crossSession, setCrossSession] = useState(false)
  const [memoryConfig, setMemoryConfig] = useState<Record<string, any>>({})

  const selectedMemory = memoryTypes.find(m => m.id === selectedMemoryType)

  const handleNext = () => {
    router.push(`/inferencer/new/mcp?type=${pipelineType}`)
  }

  const handleBack = () => {
    const prevPath = pipelineType === 'rag' 
      ? '/inferencer/new/retrieval'
      : '/inferencer/new/basic'
    router.push(`${prevPath}?type=${pipelineType}`)
  }

  const updateMemoryConfig = (key: string, value: any) => {
    setMemoryConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Conversation Memory</p>
          <p className="text-muted-foreground">
            Configure how your pipeline maintains context across multiple interactions. 
            Memory allows for more natural, context-aware conversations.
          </p>
        </div>
      </div>

      {/* Memory Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Memory Type</CardTitle>
          <CardDescription>
            Choose how conversation history is stored and retrieved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedMemoryType}
            onValueChange={setSelectedMemoryType}
            className="space-y-4"
          >
            {memoryTypes.map((type) => {
              const Icon = type.icon
              const isSelected = selectedMemoryType === type.id
              
              return (
                <div key={type.id}>
                  <label
                    htmlFor={type.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{type.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </label>
                  
                  {/* Memory Type Specific Config */}
                  {isSelected && type.config && (
                    <div className="mt-4 ml-8 space-y-4 p-4 bg-muted/50 rounded-lg">
                      {Object.entries(type.config).map(([key, config]: [string, any]) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key}>{config.label}</Label>
                          {config.type === 'select' ? (
                            <Select
                              value={memoryConfig[key] || config.default}
                              onChange={e => updateMemoryConfig(key, e.target.value)}
                              options={config.options.map((option: string | number) => ({
                                value: String(option),
                                label: key === 'windowSize' ? `${option} messages` : String(option)
                              }))}
                              id={key}
                            />
                          ) : config.type === 'number' ? (
                            <Input
                              id={key}
                              type="number"
                              value={memoryConfig[key] || config.default}
                              onChange={(e) => updateMemoryConfig(key, parseInt(e.target.value))}
                            />
                          ) : (
                            <Input
                              id={key}
                              value={memoryConfig[key] || config.default}
                              onChange={(e) => updateMemoryConfig(key, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Storage Configuration */}
      {selectedMemoryType !== 'none' && (
        <Card>
          <CardHeader>
            <CardTitle>Storage Configuration</CardTitle>
            <CardDescription>
              Configure where and how memory is persisted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Storage Backend */}
            <div className="space-y-2">
              <Label>Storage Backend</Label>
              <RadioGroup value={storageBackend} onValueChange={setStorageBackend}>
                {storageBackends.map((backend) => (
                  <div key={backend.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={backend.id} id={backend.id} />
                    <Label htmlFor={backend.id} className="font-normal cursor-pointer">
                      {backend.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* TTL for persistent storage */}
            {storageBackend !== 'memory' && (
              <div className="space-y-2">
                <Label htmlFor="ttl">Time to Live (TTL)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="ttl"
                    type="number"
                    value={ttl}
                    onChange={(e) => setTtl(parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">hours</span>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-medium">Advanced Settings</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-clean" className="cursor-pointer">
                  Auto-clear after inactivity (30 min)
                </Label>
                <Switch
                  id="auto-clean"
                  checked={autoClean}
                  onCheckedChange={setAutoClean}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="store-prefs" className="cursor-pointer">
                  Store user preferences
                </Label>
                <Switch
                  id="store-prefs"
                  checked={storePreferences}
                  onCheckedChange={setStorePreferences}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="cross-session" className="cursor-pointer">
                  Enable cross-session memory
                </Label>
                <Switch
                  id="cross-session"
                  checked={crossSession}
                  onCheckedChange={setCrossSession}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Estimation */}
      {selectedMemoryType !== 'none' && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated Additional Latency:</span>
              <span>+5-15ms</span>
            </div>
            {storageBackend !== 'memory' && (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Storage Cost:</span>
                <span>~$0.50/month</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Next: MCP Tools
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}