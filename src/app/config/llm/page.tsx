// src/app/config/llm/page.tsx
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
  AlertTriangle,
  MessageSquare,
  Eye,
  Code,
  Globe,
  TrendingUp
} from 'lucide-react'
import { formatNumber, formatBytes } from '@/lib/utils'
import { cn } from '@/lib/utils'
// ❌ Remove Redux imports:
// import { useAppSelector, useAppDispatch } from '@/store/hooks'
// import { setModels } from '@/store/slices/models.slice'

// ✅ Add Zustand imports:
import { useModelsStore } from '@/stores'
import { dataService } from '@/services/data.service'
import systemResourcesData from '@/data/system-resources.json'
import { SystemResources } from '@/components/config/system-resources'

export default function LLMProvidersPage() {
  // ✅ Replace Redux with Zustand
  const { getModelsArray, loading, setModels } = useModelsStore();
  const models = getModelsArray()
  const modelsArray = Object.values(models)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [showActivationModal, setShowActivationModal] = useState(false)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [activatingModel, setActivatingModel] = useState<string | null>(null)
  const [activationProgress, setActivationProgress] = useState(0)
  const [expandedLocal, setExpandedLocal] = useState(true)
  const [expandedInactive, setExpandedInactive] = useState(false)
  const [expandedModels, setExpandedModels] = useState<string[]>([])
  const [systemResources, setSystemResources] = useState(systemResourcesData.systemResources)

  // Load models data on mount
  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    try {
      const response = await dataService.getModels()
      if (response.data) {
        // ✅ Use Zustand setter instead of Redux dispatch
        setModels(response.data.models)
      }
    } catch (error) {
      console.error('Failed to load models:', error)
    }
  }

  // Filter models by type and status
  const localActiveModels = modelsArray.filter(m => m.type === 'local' && m.status === 'active')
  const localInactiveModels = modelsArray.filter(m => m.type === 'local' && m.status === 'inactive')
  const cloudModels = modelsArray.filter(m => m.type === 'cloud')

  // Calculate available resources (considering both embeddings and LLMs)
  const totalGPUUsed = systemResources.gpu.models.reduce((sum, model) => sum + model.usage, 0)
  const availableGPU = systemResources.gpu.total - totalGPUUsed
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
          loadModels()
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

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'function-calling': return <Code className="h-3 w-3" />
      case 'vision': return <Eye className="h-3 w-3" />
      case 'json-mode': return <FileText className="h-3 w-3" />
      case 'multilingual': return <Globe className="h-3 w-3" />
      case 'code-specialized': return <Code className="h-3 w-3" />
      case 'rag-mode': return <MessageSquare className="h-3 w-3" />
      default: return <Zap className="h-3 w-3" />
    }
  }

  // Calculate total costs for cloud models
  const totalCostToday = cloudModels
    .filter(m => m.status === 'active' && m.usage)
    .reduce((sum, m) => sum + (m.usage?.costToday || 0), 0)

  return (
    <MainLayout>
      <PageHeader
        title="LLM Providers"
        description="Manage language models for text generation"
      >
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </PageHeader>

      <PageContent>
        <SystemResources 
          systemResources={systemResources}
          showBreakdown={true}
          // gpuModels={systemResources.gpu.models}
        />

        {/* Cost Overview for Cloud Models
        {totalCostToday > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Today's Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold">${totalCostToday.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(cloudModels.reduce((sum, m) => sum + (m.usage?.requestsToday || 0), 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tokens</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(cloudModels.reduce((sum, m) => 
                      sum + (m.usage?.tokensToday?.input || 0) + (m.usage?.tokensToday?.output || 0), 0
                    ))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}

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
                              {model.quantization && (
                                <Badge variant="outline" className="text-xs">
                                  {model.quantization}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {model.contextWindow.toLocaleString()} context • Using {formatBytes(model.resourceUsage?.gpu || 0)} GPU
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {model.performance?.tokensPerSec || 0} tok/s
                              </span>
                              <span>•</span>
                              <span>Latency: {model.performance?.avgLatency || 0}ms</span>
                              <span>•</span>
                              <span>Requests: {formatNumber(model.performance?.requestsProcessed || 0)}</span>
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
                              <div className="grid grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Tokens/sec</p>
                                  <p className="text-lg font-semibold">{model.performance.tokensPerSec}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                                  <p className="text-lg font-semibold">{model.performance.avgLatency}ms</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">CPU Usage</p>
                                  <p className="text-lg font-semibold">{model.resourceUsage?.cpuPercent || 0}%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Requests</p>
                                  <p className="text-lg font-semibold">{formatNumber(model.performance.requestsProcessed)}</p>
                                </div>
                              </div>
                            </div>

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
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{model.name}</h4>
                            {model.quantization && (
                              <Badge variant="outline" className="text-xs">
                                {model.quantization}
                              </Badge>
                            )}
                            {model.features && model.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {getFeatureIcon(feature)}
                                <span className="ml-1">{feature}</span>
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{model.contextWindow.toLocaleString()} context</span>
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
                        {model.features && model.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {getFeatureIcon(feature)}
                            <span className="ml-1">{feature}</span>
                          </Badge>
                        ))}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {model.provider} • {model.contextWindow.toLocaleString()} context • {model.maxOutputTokens} max output
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="mr-1 h-3 w-3" />
                      Configure
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{model.description}</p>
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${model.costPer1kTokens.input}/1k input
                      </span>
                      <span>•</span>
                      <span>${model.costPer1kTokens.output}/1k output</span>
                    </div>

                    {/* Usage Stats */}
                    {model.usage && model.status === 'active' && (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Requests Today</p>
                          <p className="text-lg font-semibold">{formatNumber(model.usage.requestsToday)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Input Tokens</p>
                          <p className="text-lg font-semibold">{formatNumber(model.usage.tokensToday.input)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Output Tokens</p>
                          <p className="text-lg font-semibold">{formatNumber(model.usage.tokensToday.output)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Response</p>
                          <p className="text-lg font-semibold">
                            {Math.round(model.usage.tokensToday.output / model.usage.requestsToday)} tok
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Today's Cost</p>
                          <p className="text-lg font-semibold">${model.usage.costToday.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                  </div>
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
                <div className="flex justify-between text-sm">
                  <span>Model Size:</span>
                  <span>{formatBytes(selectedModel.modelSize)}</span>
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

        {/* Add Provider Modal (placeholder) */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add LLM Provider</DialogTitle>
              <DialogDescription>
                Configure a new LLM provider or model.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Provider configuration form would go here...
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button>Add Provider</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContent>
    </MainLayout>
  )
}