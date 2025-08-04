'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { WizardStepProps } from '@/types/wizard.types';
import { usePipelineState } from '@/components/inferencer/pipelines/providers/pipeline-state-provider';
// ❌ Remove Redux import:
// import { useAppSelector } from '@/store/hooks';

// ✅ Add Zustand imports:
import { useCollectionsStore, useModelsStore } from '@/stores';
import { 
  CheckCircle,
  Info,
  FileText,
  Database,
  Search,
  Brain,
  Cpu,
  MessageSquare,
  Edit2,
  AlertCircle,
  Rocket,
  TestTube
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewData {
  agreedToTerms?: boolean;
  runTestQuery?: boolean;
  _isValid?: boolean;
}

export function ReviewDeployStep({ data, onChange, isLastStep }: WizardStepProps) {
  const { state: pipelineState } = usePipelineState();
  
  // ✅ Replace Redux with Zustand
  const { getCollectionById } = useCollectionsStore();
  const { getModelById } = useModelsStore();
  
  const [localData, setLocalData] = useState<ReviewData>({
    agreedToTerms: false,
    runTestQuery: true,
    ...(data as ReviewData || {}),
  });

  const formData = pipelineState.formData;
  const pipelineType = pipelineState.pipelineType;

  // ✅ Get selected collections using Zustand getter (for RAG)
  const selectedCollections = formData.collections?.map(id => getCollectionById(id)).filter(Boolean) || [];
  
  // ✅ Get selected model using Zustand getter
  const selectedModel = getModelById(formData.llm?.model || '');

  // Calculate estimates
  const estimates = {
    setupTime: pipelineType === 'rag' ? '2-3 minutes' : '1-2 minutes',
    monthlyCost: selectedModel ? 
      `$${(selectedModel.costPer1kTokens.input * 100 + selectedModel.costPer1kTokens.output * 100).toFixed(2)}/month` : 
      'N/A',
    queryLatency: pipelineType === 'rag' ? 
      (formData.retrieval?.reranker?.enabled ? '200-400ms' : '100-200ms') : 
      '50-100ms',
  };

  const updateField = (field: keyof ReviewData, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    
    // Update validation
    const isValid = newData.agreedToTerms === true;
    onChange({ ...newData, _isValid: isValid });
  };

  const renderConfigSection = (
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    items: Array<{ label: string; value: string | number | React.ReactNode }>
  ) => {
    const Icon = icon;
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <dt className="text-sm text-muted-foreground">{item.label}</dt>
                <dd className="text-sm font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Review & Deploy</h2>
        <p className="text-muted-foreground">
          Review your pipeline configuration before deployment
        </p>
      </div>

      {/* Pipeline Type Badge */}
      <div className="flex justify-center">
        <Badge variant="outline" className="text-sm px-3 py-1">
          {pipelineType === 'rag' ? 'RAG Pipeline' : 'LLM Pipeline'}
        </Badge>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-4">
        {/* Basic Info */}
        {renderConfigSection(Info, 'Basic Information', [
          { label: 'Name', value: formData.basicInfo?.name || 'Untitled' },
          { label: 'Use Case', value: formData.basicInfo?.useCase || 'custom' },
          { 
            label: 'Tags', 
            value: formData.basicInfo?.tags?.length ? (
              <div className="flex gap-1">
                {formData.basicInfo.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : 'None'
          },
        ])}

        {/* Collections (RAG only) */}
        {pipelineType === 'rag' && (
          renderConfigSection(Database, 'Document Collections', [
            { label: 'Selected Collections', value: selectedCollections.length },
            { 
              label: 'Total Documents', 
              value: selectedCollections.reduce((acc, c) => acc + (c?.documentCount || 0), 0).toLocaleString()
            },
            { 
              label: 'Total Chunks', 
              value: selectedCollections.reduce((acc, c) => acc + (c?.totalChunks || 0), 0).toLocaleString()
            },
          ])
        )}

        {/* Retrieval Config (RAG only) */}
        {pipelineType === 'rag' && formData.retrieval && (
          renderConfigSection(Search, 'Retrieval Configuration', [
            { label: 'Search Method', value: formData.retrieval.searchMethod || 'hybrid' },
            { label: 'Top K', value: formData.retrieval.topK || 5 },
            { label: 'Score Threshold', value: formData.retrieval.scoreThreshold || 0.7 },
            { 
              label: 'Reranker', 
              value: formData.retrieval.reranker?.enabled ? 
                <Badge variant="default" className="text-xs">Enabled</Badge> : 
                <Badge variant="secondary" className="text-xs">Disabled</Badge>
            },
          ])
        )}

        {/* Memory Config */}
        {formData.memory && (
          renderConfigSection(Brain, 'Memory Configuration', [
            { 
              label: 'Memory Type', 
              value: formData.memory.enabled ? formData.memory.type : 'Disabled' 
            },
            ...(formData.memory.enabled ? [
              { label: 'Storage Backend', value: formData.memory.storageBackend || 'memory' },
              { label: 'Window Size', value: `${formData.memory.windowSize || 10} messages` },
            ] : []),
          ])
        )}

        {/* MCP Tools */}
        {formData.mcp && (
          renderConfigSection(Cpu, 'MCP Tools', [
            { 
              label: 'Status', 
              value: formData.mcp.enabled ? 
                <Badge variant="default" className="text-xs">Enabled</Badge> : 
                <Badge variant="secondary" className="text-xs">Disabled</Badge>
            },
            ...(formData.mcp.enabled && formData.mcp.servers.length > 0 ? [
              { label: 'Connected Tools', value: formData.mcp.servers.length },
            ] : []),
          ])
        )}

        {/* LLM Config */}
        {renderConfigSection(MessageSquare, 'LLM Configuration', [
          { label: 'Provider', value: formData.llm?.provider || 'openai' },
          { label: 'Model', value: selectedModel?.name || formData.llm?.model || 'Unknown' },
          { label: 'Temperature', value: formData.llm?.temperature || 0.7 },
          { label: 'Max Tokens', value: formData.llm?.maxTokens || 1000 },
          { 
            label: 'Streaming', 
            value: formData.llm?.streaming ? 
              <Badge variant="default" className="text-xs">Enabled</Badge> : 
              <Badge variant="secondary" className="text-xs">Disabled</Badge>
          },
        ])}

        {/* Deployment Estimates */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Deployment Estimates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between items-center">
                <dt className="text-sm text-muted-foreground">Setup Time</dt>
                <dd className="text-sm font-medium">{estimates.setupTime}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-sm text-muted-foreground">Estimated Cost</dt>
                <dd className="text-sm font-medium">{estimates.monthlyCost}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-sm text-muted-foreground">Query Latency</dt>
                <dd className="text-sm font-medium">{estimates.queryLatency}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch
            id="test-query"
            checked={localData.runTestQuery}
            onCheckedChange={(checked) => updateField('runTestQuery', checked)}
          />
          <Label htmlFor="test-query" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Run test query after deployment
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="terms"
            checked={localData.agreedToTerms}
            onCheckedChange={(checked) => updateField('agreedToTerms', checked)}
          />
          <Label htmlFor="terms">
            I understand this will create resources and may incur costs
          </Label>
        </div>
      </div>

      {/* Warning */}
      {!localData.agreedToTerms && isLastStep && (
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-600">Action Required</p>
            <p className="text-muted-foreground">
              Please agree to the terms before deploying your pipeline.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}