'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Clock,
  FileText,
  Hash,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Database,
  Cpu,
  HardDrive,
  Zap,
  ChevronRight,
  RefreshCw,
  Terminal,
  BarChart3,
  Settings,
  Play,
  Circle,
  FlaskConical,
  Gauge,
  ScrollText
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { dataService } from '@/services/data.service';
import { useModuleService } from '@/hooks/useModuleService';

// Compact chart component
const MiniChart = ({ data, label, color }: { data: number[], label: string, color: string }) => {
  const max = Math.max(...data, 1);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (value / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium">{data[data.length - 1]}%</span>
      </div>
      <div className="h-8 relative">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            className="opacity-70"
          />
          <polyline
            points={`${points} 100,100 0,100`}
            fill={color}
            className="opacity-10"
          />
        </svg>
      </div>
    </div>
  );
};

export default function JobMonitoringPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const moduleService = useModuleService();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<'resources' | 'logs'>('resources');
  // Mock data
  const [cpuHistory] = useState([45, 52, 48, 65, 58, 72, 68, 75, 70, 78]);
  const [memoryHistory] = useState([30, 35, 32, 40, 38, 45, 42, 48, 46, 50]);
  const [logs] = useState([
    { time: '10:23:45', message: 'Starting document processing...', type: 'info' },
    { time: '10:23:46', message: 'Loaded 15 documents from storage', type: 'success' },
    { time: '10:23:48', message: 'Beginning text extraction...', type: 'info' },
    { time: '10:23:52', message: 'Warning: Large document detected (>10MB)', type: 'warning' },
  ]);
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Get module configurations
  const statusConfigs = moduleService.getModuleStatuses('ingest');
  const moduleStates = moduleService.getModuleStates('ingest');
  
  // Helper function to map state to icon
  const getIconForState = (state: string): any => {
    const iconMap: Record<string, any> = {
      'uploading': FileText,
      'validating': AlertCircle,
      'chunking': Hash,
      'embedding': Cpu,
      'indexing': Database,
      'verifying': CheckCircle,
      'cleaning': RefreshCw
    };
    return iconMap[state] || Activity;
  };
  
  // Transform module states into stage info
  const stages = Object.entries(moduleStates)
    .filter(([key]) => key !== 'completed' && key !== 'cleaning')
    .map(([key, description]) => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: getIconForState(key),
      description
    }))
    .concat([{
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      description: 'Ingestion complete'
    }]);
  
  useEffect(() => {
    loadJob();
  }, [jobId]);
  
  useEffect(() => {
    if (!job || !autoRefresh) return;
    if (job.status === 'completed' || job.status === 'failed') {
      setAutoRefresh(false);
      return;
    }
    
    const interval = setInterval(loadJob, 3000);
    return () => clearInterval(interval);
  }, [job, autoRefresh]);
  
  const loadJob = async () => {
    try {
      const response = await dataService.getJob(jobId);
      if (response.data) {
        setJob(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('Failed to load job');
    } finally {
      setLoading(false);
    }
  };
  
  const getCurrentStageIndex = () => {
    if (!job) return -1;
    return stages.findIndex(s => s.id === job.state);
  };
  
  const getProgress = () => {
    if (!job || !job.stateDetails?.progress) return 0;
    const { current, total } = job.stateDetails.progress;
    return total > 0 ? (current / total) * 100 : 0;
  };
  
  const getDuration = () => {
    if (!job || !job.stateDetails?.startedAt) return '-';
    const start = new Date(job.stateDetails.startedAt);
    const end = job.stateDetails.completedAt ? new Date(job.stateDetails.completedAt) : new Date();
    const duration = end.getTime() - start.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };
  
  const handleSimulateCompletion = async () => {
    try {
            console.log('Simulating completion...');
            
            // Update job to completed status
            const jobUpdateResponse = await dataService.updateJobStatus(jobId, 'completed', 'completed');
            console.log('Job update response:', jobUpdateResponse);
            
            // Update collection to ready status
            if (job?.targetId) {
            const collectionUpdateResponse = await dataService.updateCollection(job.targetId, {
                status: 'ready',
                totalChunks: 1234,
                progress: {
                current: 100,
                total: 100,
                stage: 'completed'
                }
            });
            console.log('Collection update response:', collectionUpdateResponse);
            }
            
            // Reload the job to see the changes
            loadJob();
            
            // Auto-refresh will stop automatically since job.status will be 'completed'
        } catch (error) {
            console.error('Error simulating completion:', error);
        }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </PageContent>
      </MainLayout>
    );
  }
  
  if (error || !job) {
    return (
      <MainLayout>
        <PageContent>
          <Card className="max-w-md mx-auto mt-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <XCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold">Job not found</h3>
                <p className="text-muted-foreground mt-2">{error || 'The requested job could not be found.'}</p>
                <Button onClick={() => router.push('/contexter')} className="mt-4">
                  Back to Collections
                </Button>
              </div>
            </CardContent>
          </Card>
        </PageContent>
      </MainLayout>
    );
  }
  
  const currentStageIndex = getCurrentStageIndex();
  const progress = getProgress();
  
  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <PageHeader
            title={
                <div className="flex items-center gap-3">
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/contexter')}
                    className="h-8 w-8 -ml-2"
                    >
                    <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                    <h1 className="text-2xl font-semibold">Job {job.id}</h1>
                    <p className="text-sm text-muted-foreground">
                        Started {formatDate(job.stateDetails?.startedAt || job.createdAt)}
                    </p>
                    </div>
                </div>
            }
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-muted/30">
                    <span className="text-sm text-muted-foreground">Auto-refresh</span>
                    <Switch
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    disabled={job.status === 'completed' || job.status === 'failed'}
                    className="data-[state=checked]:bg-primary"
                    />
                </div>
                
                {isDevelopment && job.status === 'processing' && (
                    <Button
                    onClick={handleSimulateCompletion}
                    variant="outline"
                    className="gap-2"
                    >
                    <FlaskConical className="h-4 w-4" />
                    Test Complete
                    </Button>
                )}
            </div>
        </PageHeader>
        
        <PageContent className="p-4">
            <div className="space-y-4 max-w-7xl mx-auto">
            {/* Status and metrics bar */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-6">
                <StatusBadge status={job.status} />
                <div className="flex items-center gap-6 text-sm">
                    <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2 font-medium">{getDuration()}</span>
                    </div>
                    <div>
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="ml-2 font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div>
                    <span className="text-muted-foreground">Documents:</span>
                    <span className="ml-2 font-medium">{job.stateDetails?.progress?.total || 0}</span>
                    </div>
                    <div>
                    <span className="text-muted-foreground">Stage:</span>
                    <span className="ml-2 font-medium">{stages[currentStageIndex]?.label || 'Unknown'}</span>
                    </div>
                </div>
                </div>
                <Progress value={progress} className="w-32 h-2" />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Left Column - Compact Pipeline */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Processing Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {stages.map((stage, index) => {
                      const isCompleted = index < currentStageIndex;
                      const isCurrent = index === currentStageIndex;
                      const isPending = index > currentStageIndex;
                      const Icon = stage.icon;
                      
                      return (
                        <div
                          key={stage.id}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-md transition-colors",
                            isCompleted && "bg-green-50 dark:bg-green-950/20",
                            isCurrent && "bg-blue-50 dark:bg-blue-950/20",
                            isPending && "opacity-50"
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full",
                            isCompleted && "bg-green-500 text-white",
                            isCurrent && "bg-blue-500 text-white",
                            isPending && "bg-muted text-muted-foreground"
                          )}>
                            {isCompleted ? (
                              <CheckCircle className="h-3.5 w-3.5" />
                            ) : (
                              <Icon className={cn("h-3.5 w-3.5", isCurrent && "animate-pulse")} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={cn(
                                "text-sm font-medium",
                                isPending && "text-muted-foreground"
                              )}>
                                {stage.label}
                              </p>
                              {isCurrent && job.stateDetails?.progress && (
                                <span className="text-xs text-muted-foreground">
                                  {job.stateDetails.progress.current}/{job.stateDetails.progress.total}
                                </span>
                              )}
                            </div>
                            {isCurrent && (
                              <Progress value={progress} className="mt-1 h-1" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Everything else */}
              <div className="lg:col-span-3 space-y-4">
                {/* Configuration & Statistics Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Configuration */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <Settings className="h-3.5 w-3.5" />
                        Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Processing</h4>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Strategy:</span>
                            <span>{job.config?.processing?.strategy || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Chunk:</span>
                            <span>{job.config?.processing?.chunkSize || 0}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Embedding</h4>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Model:</span>
                            <span className="truncate max-w-[120px]">{job.config?.embedding?.model || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Provider:</span>
                            <span>{job.config?.embedding?.provider || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Statistics */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5" />
                        Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-lg font-bold">{job.stateDetails?.progress?.total || 0}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center p-2 bg-muted/30 rounded">
                          <p className="text-lg font-bold">{job.stateDetails?.progress?.current || 0}</p>
                          <p className="text-xs text-muted-foreground">Done</p>
                        </div>
                      </div>
                      
                      {job.results && (
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Chunks:</span>
                            <span>{job.results.chunksCreated || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Embeddings:</span>
                            <span>{job.results.embeddingsGenerated || 0}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Monitoring */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Monitoring</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="resources" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-9 p-1 bg-muted/50">
                            <TabsTrigger 
                            value="resources" 
                            className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                            >
                            Resources
                            </TabsTrigger>
                            <TabsTrigger 
                            value="logs" 
                            className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                            >
                            Logs
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="resources" className="mt-3">
                            <div className="grid grid-cols-2 gap-3">
                            <MiniChart data={cpuHistory} label="CPU" color="#3b82f6" />
                            <MiniChart data={memoryHistory} label="Memory" color="#10b981" />
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="logs" className="mt-3">
                            <div className="space-y-1 font-mono text-xs max-h-32 overflow-y-auto">
                            {logs.map((log, index) => (
                                <div key={index} className="flex gap-2">
                                <span className="text-muted-foreground">{log.time}</span>
                                <span className={cn(
                                    log.type === 'error' && "text-red-600",
                                    log.type === 'warning' && "text-yellow-600",
                                    log.type === 'success' && "text-green-600",
                                    log.type === 'info' && "text-blue-600"
                                )}>
                                    {log.message}
                                </span>
                                </div>
                            ))}
                            </div>
                        </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Completion State */}
            {job.status === 'completed' && (
              <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Job Completed Successfully</p>
                        <p className="text-xs text-muted-foreground">All documents processed and indexed</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/contexter/collections/${job.targetId}`)}
                      className="gap-1.5"
                    >
                      View Collection
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </PageContent>
      </div>
    </MainLayout>
  );
}