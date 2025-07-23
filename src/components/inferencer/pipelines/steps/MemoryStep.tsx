'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';  // Added this line
import { WizardStepProps } from '@/types/wizard.types';
import { Info, Brain, Database, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import pipelineConfig from '@/config/pipeline-config.json';

interface MemoryData {
  enabled: boolean;
  type: 'none' | 'buffer' | 'summary' | 'kg';
  windowSize?: number;
  storageBackend?: string;
  ttl?: number;
  summaryModel?: string;
  _isValid?: boolean;
}

const storageBackends = [
  { id: 'memory', label: 'In-Memory', description: 'Fast but temporary storage' },
  { id: 'redis', label: 'Redis', description: 'Persistent and scalable' },
  { id: 'postgresql', label: 'PostgreSQL', description: 'Relational database storage' },
];

const summaryModels = [
  { id: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'openai' },
  { id: 'claude-instant', label: 'Claude Instant', provider: 'anthropic' },
  { id: 'llama2-7b', label: 'Llama 2 7B', provider: 'local' },
];

export function MemoryStep({ data, onChange }: WizardStepProps) {
  const [localData, setLocalData] = useState<MemoryData>(() => {
    const initialData = data as MemoryData;
    return {
      enabled: initialData?.enabled ?? false,
      type: initialData?.type || 'none',
      windowSize: initialData?.windowSize || 10,
      storageBackend: initialData?.storageBackend || 'memory',
      ttl: initialData?.ttl || 3600,
      summaryModel: initialData?.summaryModel || 'gpt-3.5-turbo',
    };
  });

  useEffect(() => {
    onChange({ ...localData, _isValid: true }); // Always valid
  }, [localData, onChange]);

  const updateField = (field: keyof MemoryData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemoryToggle = (enabled: boolean) => {
    setLocalData(prev => ({
      ...prev,
      enabled,
      type: enabled ? 'buffer' : 'none',
    }));
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Conversation Memory</p>
          <p className="text-muted-foreground">
            Enable memory to maintain context across conversations. This allows your pipeline to remember previous interactions.
          </p>
        </div>
      </div>

      {/* Enable Memory */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Memory Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="memory-enabled"
              checked={localData.enabled}
              onCheckedChange={handleMemoryToggle}
            />
            <Label htmlFor="memory-enabled" className="flex-1">
              <div>
                <p className="font-medium">Enable conversation memory</p>
                <p className="text-sm text-muted-foreground">
                  Store and recall information from previous messages
                </p>
              </div>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Memory Type Selection */}
      {localData.enabled && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Memory Type</CardTitle>
              <CardDescription>
                Choose how conversation history is stored and accessed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={localData.type}
                onValueChange={(value) => updateField('type', value as any)}
              >
                {pipelineConfig.memoryTypes
                  .filter(type => type.id !== 'none')
                  .map((type) => (
                    <div key={type.id} className="flex items-start space-x-3 mb-4">
                      <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                      <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">{type.label}</p>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Memory Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Memory Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Buffer Size (for buffer memory) */}
              {localData.type === 'buffer' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Buffer Size</Label>
                    <span className="text-sm font-medium">{localData.windowSize} messages</span>
                  </div>
                  <Slider
                    value={[localData.windowSize || 10]}
                    onValueChange={([value]) => updateField('windowSize', value)}
                    min={2}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of previous messages to remember
                  </p>
                </div>
              )}

              {/* Summary Model (for summary memory) */}
              {localData.type === 'summary' && (
                <div className="space-y-2">
                  <Label>Summarization Model</Label>
                  <RadioGroup
                    value={localData.summaryModel}
                    onValueChange={(value) => updateField('summaryModel', value)}
                  >
                    {summaryModels.map((model) => (
                      <div key={model.id} className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value={model.id} id={model.id} />
                        <Label htmlFor={model.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>{model.label}</span>
                            <Badge variant="outline" className="text-xs">
                              {model.provider}
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Storage Backend */}
              <div className="space-y-2">
                <Label>Storage Backend</Label>
                <RadioGroup
                  value={localData.storageBackend}
                  onValueChange={(value) => updateField('storageBackend', value)}
                >
                  {storageBackends.map((backend) => (
                    <div key={backend.id} className="flex items-start space-x-3 mb-3">
                      <RadioGroupItem value={backend.id} id={`backend-${backend.id}`} className="mt-1" />
                      <Label htmlFor={`backend-${backend.id}`} className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">{backend.label}</p>
                          <p className="text-sm text-muted-foreground">{backend.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* TTL (Time to Live) */}
              {localData.storageBackend !== 'memory' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Memory Retention (TTL)
                    </Label>
                    <span className="text-sm font-medium">
                      {localData.ttl && localData.ttl >= 86400 
                        ? `${Math.floor(localData.ttl / 86400)} days`
                        : localData.ttl && localData.ttl >= 3600 
                        ? `${Math.floor(localData.ttl / 3600)} hours`
                        : `${localData.ttl} seconds`
                      }
                    </span>
                  </div>
                  <Slider
                    value={[localData.ttl || 3600]}
                    onValueChange={([value]) => updateField('ttl', value)}
                    min={300} // 5 minutes
                    max={604800} // 7 days
                    step={300}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to keep conversation history
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Advanced Features
                <Badge variant="secondary" className="ml-2">Beta</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch id="cross-session" />
                  <Label htmlFor="cross-session">
                    <div>
                      <p className="font-medium">Cross-session memory</p>
                      <p className="text-sm text-muted-foreground">
                        Maintain memory across different user sessions
                      </p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="auto-clean" />
                  <Label htmlFor="auto-clean">
                    <div>
                      <p className="font-medium">Auto-cleanup</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically remove old or irrelevant memories
                      </p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="user-prefs" />
                  <Label htmlFor="user-prefs">
                    <div>
                      <p className="font-medium">Store user preferences</p>
                      <p className="text-sm text-muted-foreground">
                        Remember user-specific settings and preferences
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Warning */}
          {localData.type === 'kg' && (
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-600">Advanced Configuration</p>
                <p className="text-muted-foreground">
                  Knowledge Graph memory requires additional setup and may increase latency.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}