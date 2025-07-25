// src/components/config/system-resources.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Cpu,
  Activity,
  MemoryStick,
  HardDrive,
  Server
} from 'lucide-react'
import { formatBytes } from '@/lib/utils'

interface SystemResourcesProps {
  systemResources: any;
  showBreakdown?: boolean;
  gpuModels?: Array<{
    name: string;
    usage: number;
    type: 'embedding' | 'llm';
  }>;
}

export function SystemResources({ systemResources, showBreakdown = false, gpuModels }: SystemResourcesProps) {
  const totalGPUUsed = gpuModels 
    ? gpuModels.reduce((sum, model) => sum + model.usage, 0)
    : systemResources.gpu.used;
  
  const availableGPU = systemResources.gpu.total - totalGPUUsed;
  const availableRAM = systemResources.ram.total - systemResources.ram.used;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Resources
        </CardTitle>
        {/* {showBreakdown && (
          <CardDescription>
            Shared resources between embedding models and LLMs
          </CardDescription>
        )} */}
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-6 overflow-x-auto">
            {/* GPU Memory */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <Cpu className="h-3 w-3" />
                    GPU Memory
                </span>
                <span className="text-xs whitespace-nowrap">
                    {formatBytes(totalGPUUsed)} / {formatBytes(systemResources.gpu.total)}
                </span>
                </div>
                <Progress 
                value={(totalGPUUsed / systemResources.gpu.total) * 100} 
                className="h-2" 
                />
                <div className="text-xs text-muted-foreground">
                {formatBytes(availableGPU)} available
                </div>
            </div>

            {/* CPU Usage */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <Activity className="h-3 w-3" />
                    CPU Usage
                </span>
                <span className="text-xs">
                    {systemResources.cpu.usage}%
                </span>
                </div>
                <Progress value={systemResources.cpu.usage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                {systemResources.cpu.usedCores} / {systemResources.cpu.cores} cores
                </div>
            </div>

            {/* RAM */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <MemoryStick className="h-3 w-3" />
                    System RAM
                </span>
                <span className="text-xs whitespace-nowrap">
                    {formatBytes(systemResources.ram.used)} / {formatBytes(systemResources.ram.total)}
                </span>
                </div>
                <Progress 
                value={(systemResources.ram.used / systemResources.ram.total) * 100} 
                className="h-2" 
                />
                <div className="text-xs text-muted-foreground">
                {formatBytes(availableRAM)} available
                </div>
            </div>

            {/* Storage */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 whitespace-nowrap">
                    <HardDrive className="h-3 w-3" />
                    Storage
                </span>
                <span className="text-xs whitespace-nowrap">
                    {formatBytes(systemResources.storage.used)} / {formatBytes(systemResources.storage.total)}
                </span>
                </div>
                <Progress 
                value={(systemResources.storage.used / systemResources.storage.total) * 100} 
                className="h-2" 
                />
                <div className="text-xs text-muted-foreground">
                {formatBytes(systemResources.storage.total - systemResources.storage.used)} available
                </div>
            </div>
            </div>

        {/* GPU Memory breakdown - only show if requested and available */}
        {showBreakdown && gpuModels && gpuModels.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm font-medium mb-3">GPU Memory Usage by Model:</p>
            <div className="space-y-2">
              {gpuModels.map((model, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {model.type === 'embedding' ? 'EMB' : 'LLM'}
                    </Badge>
                    <span>{model.name}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{formatBytes(model.usage)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}