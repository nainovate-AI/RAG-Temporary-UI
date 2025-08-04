// src/app/config/embeddings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
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
  Cpu,
  HardDrive,
  MemoryStick,
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
// import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { dataService } from '@/services/data.service'
// import { setEmbeddings } from '@/store/slices/embeddings.slice'
import systemResourcesData from '@/data/system-resources.json'
import { SystemResources } from '@/components/config/system-resources'
import { useEmbeddingsStore, useEmbeddingsActions } from '@/stores';


export default function EmbeddingsConfigPage() {
  // const dispatch = useAppDispatch()
  // const { entities: embeddings, loading } = useAppSelector(state => state.embeddings)
  const { entities: embeddings, loading } = useEmbeddingsStore();
  const { loadEmbeddings } = useEmbeddingsActions();
  const embeddingsArray = Object.values(embeddings)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showActivationModal, setShowActivationModal] = useState(false)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [activatingModel, setActivatingModel] = useState<string | null>(null)
  const [activationProgress, setActivationProgress] = useState(0)
  const [expandedLocal, setExpandedLocal] = useState(true)
  const [expandedInactive, setExpandedInactive] = useState(false)
  const [expandedModels, setExpandedModels] = useState<string[]>([])
  const [systemResources, setSystemResources] = useState(systemResourcesData.systemResources)

  // Load embeddings data on mount
  useEffect(() => {
    loadEmbeddings()
  }, [])

  // const loadEmbeddings = async () => {
  //   try {
  //     const response = await dataService.getEmbeddings()
  //     if (response.data) {
  //       dispatch(setEmbeddings(response.data.embeddings))
  //     }
  //   } catch (error) {
  //     console.error('Failed to load embeddings:', error)
  //   }
  // }

  // Filter embeddings by type and status
  const localActiveModels = embeddingsArray.filter(m => m.type === 'local' && m.status === 'active')
  const localInactiveModels = embeddingsArray.filter(m => m.type === 'local' && m.status === 'inactive')
  const cloudModels = embeddingsArray.filter(m => m.type === 'cloud')

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
          // In real app, update model status via API
          loadEmbeddings()
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
    if (!model.requirements) return true
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
        <SystemResources systemResources={systemResources} />

        {/* Model Tabs */}
        <Tabs defaultValue="local" className="space-y-4">
          <TabsList>
            <TabsTrigger value="local" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Local Models
            </TabsTrigger>
            <TabsTrigger value="cloud" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Cloud Models
            </TabsTrigger>
          </TabsList>

          {/* Local Models Tab */}
          <TabsContent value="local" className="space-y-4">
            {/* Active Models */}
            <div className="space-y-3">
              <button
                onClick={() => setExpandedLocal(!expandedLocal)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {expandedLocal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="flex items-center gap-2">
                  Active Models ({localActiveModels.length})
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </span>
              </button>

              {expandedLocal && (
                <div className="space-y-3">
                  {localActiveModels.map((model) => (
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
                              {model.dimensions} dimensions • {model.maxInputTokens} max tokens • Using {formatBytes(model.resourceUsage?.gpu || 0)} GPU
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Collections: {model.collections?.length || 0}</span>
                              <span>•</span>
                              <span>Embeddings: {formatNumber(model.collections?.reduce((sum, c) => sum + c.embeddings, 0) || 0)}</span>
                              <span>•</span>
                              <span>Uptime: {model.performance?.uptime || 'N/A'}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleModelExpanded(model.id)}
                          >
                            {expandedModels.includes(model.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </div>

                        {/* Expanded Details */}
                        {expandedModels.includes(model.id) && model.performance && (
                          <div className="mt-4 pt-4 border-t space-y-4">
                            {/* Performance Metrics */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">Performance</h5>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Embeddings/sec</p>
                                  <p className="text-lg font-semibold">{formatNumber(model.performance.embeddingsPerSec)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                                  <p className="text-lg font-semibold">{model.performance.avgLatency}ms</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">CPU Usage</p>
                                  <p className="text-lg font-semibold">{model.resourceUsage?.cpuPercent || 0}%</p>
                                </div>
                              </div>
                            </div>

                            {/* Collections Using This Model */}
                            {model.collections && model.collections.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Collections</h5>
                                <div className="space-y-2">
                                  {model.collections.map((collection, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">{collection.name}</span>
                                      <span>{formatNumber(collection.embeddings)} embeddings</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Settings className="mr-1 h-3 w-3" />
                                Configure
                              </Button>
                              <Button variant="outline" size="sm">
                                <TestTube className="mr-1 h-3 w-3" />
                                Test
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Square className="mr-1 h-3 w-3" />
                                Stop
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
            <div className="space-y-3">
              <button
                onClick={() => setExpandedInactive(!expandedInactive)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {expandedInactive ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span>Available Models ({localInactiveModels.length})</span>
              </button>

              {expandedInactive && (
                <div className="space-y-3">
                  {localInactiveModels.map((model) => (
                    <div key={model.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{model.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{model.dimensions} dimensions</span>
                            <span>•</span>
                            <span>{model.maxInputTokens} max tokens</span>
                            <span>•</span>
                            <span>Size: {formatBytes(model.modelSize || 0)}</span>
                          </div>

                          {/* Resource Requirements */}
                          {model.requirements && (
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-xs">
                                <Cpu className="h-3 w-3" />
                                <span>{formatBytes(model.requirements.gpu)} GPU</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <MemoryStick className="h-3 w-3" />
                                <span>{formatBytes(model.requirements.ram)} RAM</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Activity className="h-3 w-3" />
                                <span>{model.requirements.cpu} CPU cores</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => handleActivateModel(model)}
                          disabled={!canActivateModel(model)}
                          size="sm"
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Activate
                        </Button>
                      </div>

                      {!canActivateModel(model) && (
                        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                          <p className="text-xs text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Insufficient resources to activate this model
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Cloud Models Tab */}
          <TabsContent value="cloud" className="space-y-4">
            {cloudModels.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {model.name}
                        {model.status === 'active' && (
                          <Badge className="bg-green-500/10 text-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Connected
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {model.provider} • {model.dimensions} dimensions • {model.maxInputTokens} max tokens
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="mr-1 h-3 w-3" />
                      Configure
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {model.usage && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Today's Usage</p>
                        <p className="text-lg font-semibold">{formatNumber(model.usage.embeddingsToday)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Today's Cost</p>
                        <p className="text-lg font-semibold">${model.usage.costToday.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cost per 1K</p>
                        <p className="text-lg font-semibold">${model.costPer1kTokens}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Collections</p>
                        <p className="text-lg font-semibold">{model.collections?.length || 0}</p>
                      </div>
                    </div>
                  )}

                  {model.collections && model.collections.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="text-sm font-medium mb-2">Active Collections</h5>
                      <div className="flex flex-wrap gap-2">
                        {model.collections.map((collection, idx) => (
                          <Badge key={idx} variant="secondary">
                            {collection.name} ({formatNumber(collection.embeddings)})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Activation Progress */}
        {activatingModel && (
          <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 w-80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Activating model...</span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <Progress value={activationProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {activationProgress}% complete
            </p>
          </div>
        )}

        {/* Activation Confirmation Modal */}
        <Dialog open={showActivationModal} onOpenChange={setShowActivationModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Model</DialogTitle>
              <DialogDescription>
                Are you sure you want to activate {selectedModel?.name}? This will allocate the following resources:
              </DialogDescription>
            </DialogHeader>
            {selectedModel?.requirements && (
              <div className="space-y-2 py-4">
                <div className="flex justify-between text-sm">
                  <span>GPU Memory:</span>
                  <span>{formatBytes(selectedModel.requirements.gpu)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>System RAM:</span>
                  <span>{formatBytes(selectedModel.requirements.ram)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>CPU Cores:</span>
                  <span>{selectedModel.requirements.cpu}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActivationModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmActivation}>
                Activate Model
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Model Modal (placeholder) */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Embedding Model</DialogTitle>
              <DialogDescription>
                Add a new embedding model to your configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Model configuration form would go here...
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button>Add Model</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContent>
    </MainLayout>
  )
}