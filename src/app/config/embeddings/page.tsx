// src/app/config/embeddings/page.tsx
'use client'

import { useState } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
// Remove Gpu from the imports and update the icon usage
import { 
  Brain,
  Plus,
  Settings,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Loader2,
  Key,
  Hash,
  Zap,
  X,
  Save,
  TestTube,
  Cpu,        // Use this for GPU as well
  HardDrive,
  MemoryStick,
  // Gpu,     // Remove this - doesn't exist
  Cloud,
  Server,
  Play,
  Square,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'
import { formatNumber, formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Mock data for system resources
const systemResources = {
  gpu: {
    total: 24 * 1024 * 1024 * 1024, // 24GB in bytes
    used: 16 * 1024 * 1024 * 1024,  // 16GB in bytes
    models: [
      { name: 'bge-large-en-v1.5', usage: 2.1 * 1024 * 1024 * 1024 },
      { name: 'sentence-transformers/all-mpnet-base-v2', usage: 1.8 * 1024 * 1024 * 1024 },
    ]
  },
  cpu: {
    usage: 45, // percentage
    cores: 16,
    usedCores: 7,
  },
  ram: {
    total: 64 * 1024 * 1024 * 1024, // 64GB in bytes
    used: 32 * 1024 * 1024 * 1024,  // 32GB in bytes
  },
  storage: {
    total: 2 * 1024 * 1024 * 1024 * 1024, // 2TB in bytes
    used: 800 * 1024 * 1024 * 1024,        // 800GB in bytes
  }
}

// Mock data for models
const mockModels = {
  local: {
    active: [
      {
        id: 'bge-large-en-v1.5',
        name: 'bge-large-en-v1.5',
        dimensions: 1024,
        maxTokens: 512,
        status: 'active',
        modelSize: 1.3 * 1024 * 1024 * 1024, // 1.3GB
        resourceUsage: {
          gpu: 2.1 * 1024 * 1024 * 1024,
          ram: 4.2 * 1024 * 1024 * 1024,
          cpu: 2, // cores
          cpuPercent: 12,
        },
        performance: {
          embeddingsPerSec: 450,
          avgLatency: 2.2,
          uptime: '3d 14h',
        },
        collections: [
          { name: 'Customer Support KB', embeddings: 500000 },
          { name: 'Technical Docs', embeddings: 400000 },
          { name: 'Legal Contracts', embeddings: 300000 },
        ],
      },
      {
        id: 'sentence-transformers/all-mpnet-base-v2',
        name: 'all-mpnet-base-v2',
        dimensions: 768,
        maxTokens: 384,
        status: 'active',
        modelSize: 420 * 1024 * 1024, // 420MB
        resourceUsage: {
          gpu: 1.8 * 1024 * 1024 * 1024,
          ram: 3.5 * 1024 * 1024 * 1024,
          cpu: 2,
          cpuPercent: 10,
        },
        performance: {
          embeddingsPerSec: 620,
          avgLatency: 1.6,
          uptime: '7d 2h',
        },
        collections: [
          { name: 'Product Reviews', embeddings: 750000 },
        ],
      },
    ],
    inactive: [
      {
        id: 'all-MiniLM-L6-v2',
        name: 'all-MiniLM-L6-v2',
        dimensions: 384,
        maxTokens: 256,
        status: 'inactive',
        modelSize: 90 * 1024 * 1024, // 90MB
        requirements: {
          gpu: 1.5 * 1024 * 1024 * 1024,
          ram: 4 * 1024 * 1024 * 1024,
          cpu: 2,
        },
      },
      {
        id: 'e5-large-v2',
        name: 'e5-large-v2',
        dimensions: 1024,
        maxTokens: 512,
        status: 'inactive',
        modelSize: 1.34 * 1024 * 1024 * 1024,
        requirements: {
          gpu: 3 * 1024 * 1024 * 1024,
          ram: 6 * 1024 * 1024 * 1024,
          cpu: 4,
        },
      },
      {
        id: 'multilingual-e5-base',
        name: 'multilingual-e5-base',
        dimensions: 768,
        maxTokens: 512,
        status: 'inactive',
        modelSize: 570 * 1024 * 1024,
        requirements: {
          gpu: 2 * 1024 * 1024 * 1024,
          ram: 4 * 1024 * 1024 * 1024,
          cpu: 2,
        },
      },
    ],
  },
  cloud: [
    {
      id: 'openai-text-embedding-ada-002',
      name: 'text-embedding-ada-002',
      provider: 'OpenAI',
      dimensions: 1536,
      maxTokens: 8192,
      status: 'active',
      costPer1M: 0.10,
      usage: {
        embeddingsToday: 1234567,
        costToday: 123.46,
      },
      collections: [
        { name: 'Customer Support KB', embeddings: 250000 },
        { name: 'Marketing Content', embeddings: 180000 },
      ],
    },
    {
      id: 'cohere-embed-english-v3',
      name: 'embed-english-v3.0',
      provider: 'Cohere',
      dimensions: 1024,
      maxTokens: 512,
      status: 'active',
      costPer1M: 0.10,
      usage: {
        embeddingsToday: 890123,
        costToday: 89.01,
      },
      collections: [
        { name: 'Technical Docs', embeddings: 340000 },
      ],
    },
  ],
}

export default function EmbeddingsConfigPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showActivationModal, setShowActivationModal] = useState(false)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [activatingModel, setActivatingModel] = useState<string | null>(null)
  const [activationProgress, setActivationProgress] = useState(0)
  const [expandedLocal, setExpandedLocal] = useState(true)
  const [expandedInactive, setExpandedInactive] = useState(false)
  const [expandedModels, setExpandedModels] = useState<string[]>([])

  // Calculate available resources
  const availableGPU = systemResources.gpu.total - systemResources.gpu.used
  const availableRAM = systemResources.ram.total - systemResources.ram.used
  const availableCPU = systemResources.cpu.cores - systemResources.cpu.usedCores

  const handleActivateModel = (model: any) => {
    setSelectedModel(model)
    setShowActivationModal(true)
  }

  const confirmActivation = async () => {
    if (!selectedModel) return
    
    setShowActivationModal(false)
    setActivatingModel(selectedModel.id)
    setActivationProgress(0)
    
    // Simulate activation process
    const interval = setInterval(() => {
      setActivationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setActivatingModel(null)
          // In real app, update model status
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const toggleModelExpanded = (modelId: string) => {
    setExpandedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const canActivateModel = (model: any) => {
    return (
      model.requirements.gpu <= availableGPU &&
      model.requirements.ram <= availableRAM &&
      model.requirements.cpu <= availableCPU
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title="Embedding Models"
        description="Manage embedding models for document processing"
      >
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Model
        </Button>
      </PageHeader>

      <PageContent>
        {/* System Resources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              {/* GPU Memory */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-4 w-4" />
                    GPU Memory
                  </span>
                  <span className="font-medium">
                    {formatBytes(systemResources.gpu.used)} / {formatBytes(systemResources.gpu.total)}
                  </span>
                </div>
                <Progress 
                  value={(systemResources.gpu.used / systemResources.gpu.total) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {formatBytes(availableGPU)} available
                </p>
              </div>

              {/* CPU Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    CPU Usage
                  </span>
                  <span className="font-medium">{systemResources.cpu.usage}%</span>
                </div>
                <Progress value={systemResources.cpu.usage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {systemResources.cpu.usedCores} / {systemResources.cpu.cores} cores
                </p>
              </div>

              {/* RAM */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <MemoryStick className="h-4 w-4" />
                    RAM
                  </span>
                  <span className="font-medium">
                    {formatBytes(systemResources.ram.used)} / {formatBytes(systemResources.ram.total)}
                  </span>
                </div>
                <Progress 
                  value={(systemResources.ram.used / systemResources.ram.total) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {formatBytes(availableRAM)} available
                </p>
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-4 w-4" />
                    Storage
                  </span>
                  <span className="font-medium">
                    {formatBytes(systemResources.storage.total - systemResources.storage.used)} free
                  </span>
                </div>
                <Progress 
                  value={(systemResources.storage.used / systemResources.storage.total) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {formatBytes(systemResources.storage.used)} / {formatBytes(systemResources.storage.total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Local Models */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Local Models
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Active Models */}
            <div>
              <button
                onClick={() => setExpandedLocal(!expandedLocal)}
                className="flex items-center gap-2 text-sm font-medium mb-3"
              >
                {expandedLocal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="flex items-center gap-2">
                  Active Models ({mockModels.local.active.length})
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </span>
              </button>
              
              {expandedLocal && (
                <div className="space-y-3">
                  {mockModels.local.active.map((model) => (
                    <div
                      key={model.id}
                      className={cn(
                        "border rounded-lg transition-all",
                        activatingModel === model.id && "opacity-50"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">{model.name}</h4>
                              <Badge className="bg-green-500/10 text-green-500">
                                <Activity className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {model.dimensions} dimensions • {model.maxTokens} max tokens • Using {formatBytes(model.resourceUsage.gpu)} GPU
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Collections: {model.collections.length}</span>
                              <span>•</span>
                              <span>Embeddings: {formatNumber(model.collections.reduce((sum, c) => sum + c.embeddings, 0))}</span>
                              <span>•</span>
                              <span>Uptime: {model.performance.uptime}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleModelExpanded(model.id)}
                          >
                            {expandedModels.includes(model.id) ? <ChevronDown className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {expandedModels.includes(model.id) && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div>
                                <h5 className="text-sm font-medium mb-2">Model Info</h5>
                                <div className="space-y-1 text-sm">
                                  <p>Dimensions: {model.dimensions}</p>
                                  <p>Max Tokens: {model.maxTokens}</p>
                                  <p>Model Size: {formatBytes(model.modelSize)}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-2">Resource Usage</h5>
                                <div className="space-y-1 text-sm">
                                  <p>GPU: {formatBytes(model.resourceUsage.gpu)} ({((model.resourceUsage.gpu / systemResources.gpu.total) * 100).toFixed(1)}%)</p>
                                  <p>RAM: {formatBytes(model.resourceUsage.ram)} ({((model.resourceUsage.ram / systemResources.ram.total) * 100).toFixed(1)}%)</p>
                                  <p>CPU: {model.resourceUsage.cpu} cores ({model.resourceUsage.cpuPercent}%)</p>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-2">Performance</h5>
                                <div className="space-y-1 text-sm">
                                  <p>Embeddings/sec: {model.performance.embeddingsPerSec}</p>
                                  <p>Avg Latency: {model.performance.avgLatency}ms</p>
                                  <p>Uptime: {model.performance.uptime}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium mb-2">Used by Collections</h5>
                              <div className="space-y-1">
                                {model.collections.map((collection, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <span>{collection.name}</span>
                                    <span className="text-muted-foreground">{formatNumber(collection.embeddings)} embeddings</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                View Logs
                              </Button>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Restart
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Square className="mr-2 h-4 w-4" />
                                Deactivate
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inactive Models */}
            <div className="pt-4">
              <button
                onClick={() => setExpandedInactive(!expandedInactive)}
                className="flex items-center gap-2 text-sm font-medium mb-3"
              >
                {expandedInactive ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="flex items-center gap-2">
                  Inactive Models ({mockModels.local.inactive.length})
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                </span>
              </button>
              
              {expandedInactive && (
                <div className="space-y-3">
                  {mockModels.local.inactive.map((model) => {
                    const canActivate = canActivateModel(model)
                    const isActivating = activatingModel === model.id
                    
                    return (
                      <div
                        key={model.id}
                        className={cn(
                          "border rounded-lg p-4",
                          isActivating && "bg-muted/50"
                        )}
                      >
                        {isActivating ? (
                          // Activation Loading State
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium">{model.name}</h4>
                                <Badge variant="secondary">
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  Activating...
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Progress value={activationProgress} className="h-2" />
                              <p className="text-sm text-muted-foreground">
                                {activationProgress < 30 && "Loading model weights..."}
                                {activationProgress >= 30 && activationProgress < 60 && "Initializing embeddings..."}
                                {activationProgress >= 60 && activationProgress < 90 && "Starting server..."}
                                {activationProgress >= 90 && "Finalizing..."}
                              </p>
                            </div>
                          </div>
                        ) : (
                          // Normal Inactive State
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium">{model.name}</h4>
                                <Badge variant="secondary">
                                  Inactive
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {model.dimensions} dimensions • Requires {formatBytes(model.requirements.gpu)} GPU
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleActivateModel(model)}
                              disabled={!canActivate}
                            >
                              {canActivate ? (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Insufficient Resources
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cloud Models */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Cloud Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockModels.cloud.map((model) => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{model.name}</h4>
                        <Badge variant="outline">{model.provider}</Badge>
                        <Badge className="bg-green-500/10 text-green-500">
                          <Activity className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {model.dimensions} dimensions • {model.maxTokens} max tokens • ${model.costPer1M}/1M tokens
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Today: {formatNumber(model.usage.embeddingsToday)} embeddings</span>
                        <span>•</span>
                        <span>Cost: ${model.usage.costToday.toFixed(2)}</span>
                        <span>•</span>
                        <span>Collections: {model.collections.length}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activation Modal */}
        <Dialog open={showActivationModal} onOpenChange={setShowActivationModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Model: {selectedModel?.name}</DialogTitle>
              <DialogDescription>
                Review resource requirements before activating this model
              </DialogDescription>
            </DialogHeader>
            
            {selectedModel && (
              <div className="space-y-4">
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-900 dark:text-yellow-100">Resource Requirements</p>
                      <div className="mt-2 space-y-1 text-yellow-800 dark:text-yellow-200">
                        <p>• GPU Memory: {formatBytes(selectedModel.requirements.gpu)}</p>
                        <p>• RAM: {formatBytes(selectedModel.requirements.ram)}</p>
                        <p>• CPU: {selectedModel.requirements.cpu} cores</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Current Availability:</p>
                  <div className="space-y-3">
                    {/* GPU Check */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>GPU Memory</span>
                        <span className={cn(
                          "flex items-center gap-1",
                          selectedModel.requirements.gpu <= availableGPU ? "text-green-600" : "text-red-600"
                        )}>
                          {selectedModel.requirements.gpu <= availableGPU ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          {formatBytes(availableGPU)} available
                        </span>
                      </div>
                      <Progress 
                        value={(systemResources.gpu.used / systemResources.gpu.total) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* RAM Check */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>RAM</span>
                        <span className={cn(
                          "flex items-center gap-1",
                          selectedModel.requirements.ram <= availableRAM ? "text-green-600" : "text-red-600"
                        )}>
                          {selectedModel.requirements.ram <= availableRAM ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          {formatBytes(availableRAM)} available
                        </span>
                      </div>
                      <Progress 
                        value={(systemResources.ram.used / systemResources.ram.total) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* CPU Check */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>CPU Cores</span>
                        <span className={cn(
                          "flex items-center gap-1",
                          selectedModel.requirements.cpu <= availableCPU ? "text-green-600" : "text-red-600"
                        )}>
                          {selectedModel.requirements.cpu <= availableCPU ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          {availableCPU} cores available
                        </span>
                      </div>
                      <Progress 
                        value={(systemResources.cpu.usedCores / systemResources.cpu.cores) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="font-medium mb-1">After activation:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• GPU: {formatBytes(availableGPU - selectedModel.requirements.gpu)} remaining</li>
                    <li>• RAM: {formatBytes(availableRAM - selectedModel.requirements.ram)} remaining</li>
                    <li>• This model will be available for all collections</li>
                  </ul>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActivationModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmActivation}
                disabled={selectedModel && !canActivateModel(selectedModel)}
              >
                Activate Model
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContent>
    </MainLayout>
  )
}