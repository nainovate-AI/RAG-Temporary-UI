'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WizardStepProps } from '@/types/wizard.types';
import { useAppSelector } from '@/store/hooks';
import { usePipelineState } from '@/components/inferencer/pipelines/providers/pipeline-state-provider';
import { 
  Info, 
  MessageSquare, 
  Zap, 
  DollarSign, 
  Brain,
  Sparkles,
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import pipelineConfigData from '@/config/pipeline-config.json';
import { 
  PipelineConfig, 
  PipelineType, 
  RAGUseCase, 
  LLMUseCase 
} from '@/types/pipeline-config.types';

const pipelineConfig = pipelineConfigData as PipelineConfig;

interface LLMData {
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  userPromptTemplate: string;
  streaming: boolean;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  _isValid?: boolean;
}

export function LLMConfigStep({ data, onChange }: WizardStepProps) {
  const { entities: availableModels } = useAppSelector(state => state.models);
  const modelsArray = Object.values(availableModels);
  
  // Get pipeline type and use case from context
  const { state: pipelineState } = usePipelineState();
  const pipelineType = pipelineState.pipelineType;
  const useCase = pipelineState.formData.basicInfo?.useCase || 'custom';

  // Helper function to get default system prompt
  const getDefaultSystemPrompt = (type: PipelineType, useCase: string): string => {
    if (type === 'rag') {
      const prompts = pipelineConfig.defaultSystemPrompts.rag;
      return prompts[useCase as RAGUseCase] || prompts.custom;
    } else {
      const prompts = pipelineConfig.defaultSystemPrompts.llm;
      return prompts[useCase as LLMUseCase] || prompts.custom;
    }
  };

  const [localData, setLocalData] = useState<LLMData>(() => {
    const initialData = data as LLMData;
    
    // Get default prompts based on pipeline type and use case
    const defaultSystemPrompt = getDefaultSystemPrompt(pipelineType, useCase);
    const defaultUserTemplate = pipelineConfig.defaultUserPromptTemplates[pipelineType];
    
    return {
      provider: initialData?.provider || 'openai',
      model: initialData?.model || 'gpt-3.5-turbo',
      temperature: initialData?.temperature ?? 0.7,
      maxTokens: initialData?.maxTokens || 1000,
      systemPrompt: initialData?.systemPrompt || defaultSystemPrompt,
      userPromptTemplate: initialData?.userPromptTemplate || defaultUserTemplate,
      streaming: initialData?.streaming ?? true,
      topP: initialData?.topP ?? 1,
      frequencyPenalty: initialData?.frequencyPenalty ?? 0,
      presencePenalty: initialData?.presencePenalty ?? 0,
    };
  });

  const [selectedProvider, setSelectedProvider] = useState(localData.provider);

  // Filter models by provider
  const providerModels = modelsArray.filter(m => m.provider === selectedProvider);
  
  // Get current model details
  const currentModel = modelsArray.find(m => m.id === localData.model);

  useEffect(() => {
    const isValid = !!localData.provider && !!localData.model && !!localData.systemPrompt;
    onChange({ ...localData, _isValid: isValid });
  }, [localData, onChange]);

  const updateField = (field: keyof LLMData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    updateField('provider', provider);
    
    // Reset model selection when provider changes
    const firstModel = modelsArray.find(m => m.provider === provider);
    if (firstModel) {
      updateField('model', firstModel.id);
    }
  };

  const resetToDefault = (field: 'systemPrompt' | 'userPromptTemplate') => {
    if (field === 'systemPrompt') {
      const defaultPrompt = getDefaultSystemPrompt(pipelineType, useCase);
      updateField('systemPrompt', defaultPrompt);
    } else {
      const defaultTemplate = pipelineConfig.defaultUserPromptTemplates[pipelineType];
      updateField('userPromptTemplate', defaultTemplate);
    }
  };

  // Group providers
  const providers = Array.from(new Set(modelsArray.map(m => m.provider)));
  
  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">LLM Configuration</p>
          <p className="text-muted-foreground">
            {pipelineType === 'rag' 
              ? 'Configure the language model that will generate responses based on retrieved context.'
              : 'Configure the language model for content generation and transformation.'}
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Model Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label>Provider</Label>
            <RadioGroup
              value={selectedProvider}
              onValueChange={handleProviderChange}
            >
              {providers.map((provider) => (
                <div key={provider} className="flex items-center space-x-2">
                  <RadioGroupItem value={provider} id={provider} />
                  <Label htmlFor={provider} className="font-normal capitalize">
                    {provider}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label>Model</Label>
            <RadioGroup
              value={localData.model}
              onValueChange={(value) => updateField('model', value)}
            >
              {providerModels.map((model) => (
                <div key={model.id} className="flex items-start space-x-3 mb-3">
                  <RadioGroupItem value={model.id} id={model.id} className="mt-1" />
                  <Label htmlFor={model.id} className="flex-1 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{model.name}</p>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {model.contextWindow.toLocaleString()} tokens
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${model.costPer1kTokens.input}/1k in, ${model.costPer1kTokens.output}/1k out
                          </span>
                        </div>
                      </div>
                      {model.features && model.features.length > 0 && (
                        <div className="flex gap-1 ml-2">
                          {model.features.includes('function-calling') && (
                            <Badge variant="outline" className="text-xs">Functions</Badge>
                          )}
                          {model.features.includes('vision') && (
                            <Badge variant="outline" className="text-xs">Vision</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Prompts Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prompts</CardTitle>
          <CardDescription>
            Configure system and user prompts for your pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="system" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="system">System Prompt</TabsTrigger>
              <TabsTrigger value="user">User Template</TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>System Prompt</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetToDefault('systemPrompt')}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset to default
                </Button>
              </div>
              <Textarea
                value={localData.systemPrompt}
                onChange={(e) => updateField('systemPrompt', e.target.value)}
                placeholder="Enter system prompt..."
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This prompt defines the AI's behavior and personality
              </p>
            </TabsContent>
            
            <TabsContent value="user" className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>User Prompt Template</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetToDefault('userPromptTemplate')}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reset to default
                </Button>
              </div>
              <Textarea
                value={localData.userPromptTemplate}
                onChange={(e) => updateField('userPromptTemplate', e.target.value)}
                placeholder={pipelineType === 'rag' ? 'Context: {context}\n\nQuery: {query}' : '{input}'}
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {pipelineType === 'rag' 
                  ? 'Available variables: {context}, {query}, {history}'
                  : 'Available variables: {input}, {history}'}
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Model Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Model Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Temperature</Label>
              <span className="text-sm font-medium">{localData.temperature}</span>
            </div>
            <Slider
              value={[localData.temperature]}
              onValueChange={([value]) => updateField('temperature', value)}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Controls randomness: 0 = focused, 2 = creative
            </p>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Max Tokens</Label>
              <span className="text-sm font-medium">{localData.maxTokens}</span>
            </div>
            <Slider
              value={[localData.maxTokens]}
              onValueChange={([value]) => updateField('maxTokens', value)}
              min={100}
              max={currentModel?.contextWindow ? Math.min(4000, currentModel.contextWindow) : 4000}
              step={50}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum response length in tokens
            </p>
          </div>

          {/* Advanced Parameters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Advanced Parameters</Label>
              <Badge variant="outline" className="text-xs">Optional</Badge>
            </div>
            
            {/* Top P */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Top P</Label>
                <span className="text-sm">{localData.topP}</span>
              </div>
              <Slider
                value={[localData.topP || 1]}
                onValueChange={([value]) => updateField('topP', value)}
                min={0.1}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Frequency Penalty */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Frequency Penalty</Label>
                <span className="text-sm">{localData.frequencyPenalty}</span>
              </div>
              <Slider
                value={[localData.frequencyPenalty || 0]}
                onValueChange={([value]) => updateField('frequencyPenalty', value)}
                min={-2}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Presence Penalty */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Presence Penalty</Label>
                <span className="text-sm">{localData.presencePenalty}</span>
              </div>
              <Slider
                value={[localData.presencePenalty || 0]}
                onValueChange={([value]) => updateField('presencePenalty', value)}
                min={-2}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Streaming */}
          <div className="flex items-center space-x-2">
            <Switch
              id="streaming"
              checked={localData.streaming}
              onCheckedChange={(checked) => updateField('streaming', checked)}
            />
            <Label htmlFor="streaming">
              <div>
                <p className="font-medium">Enable streaming</p>
                <p className="text-sm text-muted-foreground">
                  Show responses as they are generated
                </p>
              </div>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Cost Estimation */}
      {currentModel && (
        <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-600">Estimated Cost</p>
            <p className="text-muted-foreground">
              ~${((currentModel.costPer1kTokens.input + currentModel.costPer1kTokens.output) * 2).toFixed(3)} per query 
              (assuming ~1k input, ~1k output)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}