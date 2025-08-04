'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/badge';
import { 
  Plus,
  Search,
  Zap,
  DollarSign,
  Brain,
  Play,
  Pause,
  Settings,
  FileText,
  MessageSquare,
  Filter,
  TrendingUp,
  Clock,
  AlertCircle,
  Loader2,
  Layers,
  Activity,
  BarChart3
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
// import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { setPipelines, updatePipelineStatus } from '@/store/slices/pipelines.slice';
import { 
  usePipelinesStore, 
  usePipelinesActions,
  // useActivePipelines,
  useCollectionsStore,
} from '@/stores';
import { dataService } from '@/services/data.service';
import { useModuleService } from '@/hooks/useModuleService';

export default function InferencerPage() {
  const router = useRouter();
  // const dispatch = useAppDispatch();
  const moduleService = useModuleService();
  const { entities: pipelines, loading, error } = usePipelinesStore();
const { entities: collectionsStore } = useCollectionsStore();
const { loadPipelines, stopPipeline } = usePipelinesActions();
  
  // Get pipelines from Redux store
  // const { entities: pipelines, loading, error } = useAppSelector(state => state.pipelines);
  const pipelinesArray = Object.values(pipelines);
  // Get collections from Redux store
  // const { entities: collectionsStore } = useAppSelector(state => state.collections);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  // const [isLoading, setIsLoading] = useState(false);
  
  // Get status configurations from module service
  const statusConfigs = moduleService.getModuleStatuses('pipeline');
  
  // Load pipelines on mount
  useEffect(() => {
    loadPipelines();
  }, []);
  
  // const loadPipelines = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await dataService.getPipelines();
  //     if (response.data) {
  //       dispatch(setPipelines(response.data.pipelines));
  //     }
  //   } catch (error) {
  //     console.error('Failed to load pipelines:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  // Filter pipelines based on search and filters
  const filteredPipelines = pipelinesArray.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pipeline.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || pipeline.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || pipeline.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Update this function to use the correct API method
  const handleStatusToggle = async (e: React.MouseEvent, pipelineId: string, currentStatus: string) => {
    e.stopPropagation();
    try {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        const newState = currentStatus === 'active' ? 'paused' : 'running';
        
        // Use updatePipeline instead
        const response = await dataService.updatePipeline(pipelineId, {
            status: newStatus,
            state: newState,
            stateDetails: {
                message: moduleService.getStateDescription('pipeline', newState) || '',
                lastStateChange: new Date().toISOString()
            }
        });
        
        if (response.data) {
            stopPipeline({
                id: pipelineId,
                status: newStatus,
                state: newState,
                message: moduleService.getStateDescription('pipeline', newState) || ''
            });
        }
        } catch (error) {
            console.error('Failed to update pipeline status:', error);
        }
    };

  // Helper function to get collection stats for RAG pipelines
  const getRAGStats = (pipeline: any) => {
    const collectionIds = pipeline.config?.collections || [];
    const collections = collectionIds.map((id: string) => collectionsStore[id]).filter(Boolean);
    return {
      collectionsCount: collections.length,
      documentsCount: collections.reduce((acc: number, c: any) => acc + (c?.documentCount || 0), 0)
    };
  };
  
  // Calculate stats
  const stats = {
    total: pipelinesArray.length,
    active: pipelinesArray.filter(p => p.status === 'active').length,
    rag: pipelinesArray.filter(p => p.type === 'rag').length,
    llm: pipelinesArray.filter(p => p.type === 'llm').length,
    totalQueries: pipelinesArray.reduce((acc, p) => acc + (p.metrics?.totalQueries || 0), 0),
  };
  
  const handleCreatePipeline = () => {
    router.push('/inferencer/new');
  };
  
  const handlePipelineClick = (pipelineId: string) => {
    router.push(`/inferencer/pipelines/${pipelineId}`);
  };
  
  const getStatusConfig = (status: string) => {
    return statusConfigs[status] || {
      label: status,
      color: 'gray',
      icon: 'help-circle',
      description: ''
    };
  };
  
  const getTypeIcon = (type: string) => {
    return type === 'rag' ? FileText : MessageSquare;
  };

  if (loading && pipelinesArray.length === 0) {
    return (
      <MainLayout>
        <PageHeader
          title="AI Pipelines"
          description="Manage your AI pipelines for content generation and retrieval"
        />
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </PageContent>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
        <PageHeader
        title="AI Pipelines"
        description="Manage your AI pipelines for content generation and retrieval"
        >
        <Button onClick={handleCreatePipeline} className="gap-2">
            <Plus className="h-4 w-4" />
            New Pipeline
        </Button>
        </PageHeader>
        
        <PageContent>
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pipelines</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All pipeline types</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">RAG Pipelines</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.rag}</div>
                <p className="text-xs text-muted-foreground">Retrieval-augmented</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LLM Pipelines</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.llm}</div>
                <p className="text-xs text-muted-foreground">Language model only</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.totalQueries.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time queries</p>
                </CardContent>
            </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pipelines..."
                className="pl-10"
                />
            </div>
            <div className="flex gap-2">
                <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                <option value="all">All Types</option>
                <option value="rag">RAG Pipelines</option>
                <option value="llm">LLM Pipelines</option>
                </select>
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                <option value="all">All Status</option>
                {Object.entries(statusConfigs).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                ))}
                </select>
            </div>
            </div>

            {/* Pipelines Grid */}
            {filteredPipelines.length === 0 ? (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                    {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'No pipelines found matching your filters.'
                    : 'No pipelines created yet.'}
                </p>
                <Button onClick={handleCreatePipeline}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Pipeline
                </Button>
                </CardContent>
            </Card>
            ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPipelines.map((pipeline) => {
                const TypeIcon = getTypeIcon(pipeline.type);
                const statusConfig = getStatusConfig(pipeline.status);
                const ragStats = pipeline.type === 'rag' ? getRAGStats(pipeline) : null;
                const modelInfo = pipeline.config?.llm;
                
                return (
                    <Card
                    key={pipeline.id}
                    className="group cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => handlePipelineClick(pipeline.id)}
                    >
                    <CardContent className="p-5">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                        {pipeline.name}
                        </h3>

                        {/* Pipeline Type & Status Row */}
                        <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">
                            {pipeline.type.toUpperCase()} Pipeline
                            </span>
                        </div>
                        <StatusBadge
                            status={pipeline.status}
                            {...statusConfig}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => handleStatusToggle(e, pipeline.id, pipeline.status)}
                        />
                        </div>

                        {/* Description if exists */}
                        {pipeline.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {pipeline.description}
                        </p>
                        )}

                        {/* Model Info Row */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                            {modelInfo?.model || 'No model'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium">
                            {modelInfo?.provider || 'unknown'}
                            </p>
                        </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Collections/Documents for RAG */}
                        {pipeline.type === 'rag' && ragStats ? (
                            <>
                            <div>
                                <p className="text-sm text-muted-foreground">Collections</p>
                                <p className="text-xl font-semibold">{ragStats.collectionsCount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Documents</p>
                                <p className="text-xl font-semibold">{ragStats.documentsCount.toLocaleString()}</p>
                            </div>
                            </>
                        ) : (
                            <div className="col-span-2">
                            <Badge variant="outline" className="w-full justify-center">
                                <Zap className="h-3 w-3 mr-1" />
                                Direct LLM - No retrieval
                            </Badge>
                            </div>
                        )}
                        
                        <div>
                            <p className="text-sm text-muted-foreground">Queries/day</p>
                            <p className="text-xl font-semibold">{(pipeline.metrics?.totalQueries || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Latency</p>
                            <p className="text-xl font-semibold">{pipeline.metrics?.avgLatency || 0}ms</p>
                        </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-muted-foreground">
                            Last used {formatDate(pipeline.updatedAt)}
                        </span>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/playground?pipeline=${pipeline.id}`);
                            }}
                            title="Open in Playground"
                            >
                            <Play className="h-4 w-4" />
                            </Button>
                            <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/inferencer/pipelines/${pipeline.id}/settings`);
                            }}
                            title="Pipeline Settings"
                            >
                            <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                );
                })}
            </div>
            )}
        </div>
        </PageContent>
    </MainLayout>
    );
}