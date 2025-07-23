'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';  // Added this line
import { WizardStepProps } from '@/types/wizard.types';
import { Info, Search, Zap, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import pipelineConfig from '@/config/pipeline-config.json';

interface RetrievalData {
  searchMethod: 'vector' | 'hybrid' | 'keyword';
  topK: number;
  scoreThreshold?: number;
  hybridAlpha?: number;
  reranker?: {
    enabled: boolean;
    model?: string;
    topN?: number;
  };
  _isValid?: boolean;
}

const rerankerModels = [
  { id: 'cross-encoder/ms-marco-MiniLM-L-12-v2', label: 'MS MARCO MiniLM (Fast)', speed: 'fast' },
  { id: 'cross-encoder/ms-marco-MiniLM-L-6-v2', label: 'MS MARCO MiniLM L6 (Faster)', speed: 'faster' },
  { id: 'BAAI/bge-reranker-large', label: 'BGE Reranker Large (Accurate)', speed: 'slow' },
  { id: 'BAAI/bge-reranker-base', label: 'BGE Reranker Base (Balanced)', speed: 'medium' },
];

export function RetrievalConfigStep({ data, onChange }: WizardStepProps) {
  const [localData, setLocalData] = useState<RetrievalData>(() => {
    const initialData = data as RetrievalData;
    return {
      searchMethod: initialData?.searchMethod || 'hybrid',
      topK: initialData?.topK || 5,
      scoreThreshold: initialData?.scoreThreshold || 0.7,
      hybridAlpha: initialData?.hybridAlpha || 0.5,
      reranker: initialData?.reranker || {
        enabled: false,
        model: 'cross-encoder/ms-marco-MiniLM-L-12-v2',
        topN: 3,
      },
    };
  });

  useEffect(() => {
    onChange({ ...localData, _isValid: true }); // Always valid with defaults
  }, [localData, onChange]);

  const updateField = (field: keyof RetrievalData, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const updateReranker = (field: string, value: any) => {
    setLocalData(prev => ({
      ...prev,
      reranker: {
        ...prev.reranker!,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Retrieval Configuration</p>
          <p className="text-muted-foreground">
            Configure how your pipeline searches and ranks relevant documents. Hybrid search typically provides the best results.
          </p>
        </div>
      </div>

      {/* Search Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Method
          </CardTitle>
          <CardDescription>
            Choose how to search through your documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={localData.searchMethod}
            onValueChange={(value) => updateField('searchMethod', value as any)}
          >
            {pipelineConfig.searchMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3 mb-4">
                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Hybrid Alpha Slider (only for hybrid search) */}
          {localData.searchMethod === 'hybrid' && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center">
                <Label>Hybrid Balance</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round((localData.hybridAlpha || 0.5) * 100)}% Vector / {Math.round((1 - (localData.hybridAlpha || 0.5)) * 100)}% Keyword
                </span>
              </div>
              <Slider
                value={[localData.hybridAlpha || 0.5]}
                onValueChange={([value]) => updateField('hybridAlpha', value)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Keyword</span>
                <span>More Semantic</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Retrieval Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Retrieval Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top K */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Number of Results (Top-K)</Label>
              <span className="text-sm font-medium">{localData.topK}</span>
            </div>
            <Slider
              value={[localData.topK]}
              onValueChange={([value]) => updateField('topK', value)}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Number of document chunks to retrieve for each query
            </p>
          </div>

          {/* Score Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Minimum Relevance Score</Label>
              <span className="text-sm font-medium">{localData.scoreThreshold}</span>
            </div>
            <Slider
              value={[localData.scoreThreshold || 0.7]}
              onValueChange={([value]) => updateField('scoreThreshold', value)}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Only return results above this similarity threshold
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reranker Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Reranking <Badge variant="secondary" className="ml-2">Optional</Badge>
          </CardTitle>
          <CardDescription>
            Use a reranker model to improve result relevance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="reranker"
              checked={localData.reranker?.enabled || false}
              onCheckedChange={(checked) => updateReranker('enabled', checked)}
            />
            <Label htmlFor="reranker">Enable reranking</Label>
          </div>

          {localData.reranker?.enabled && (
            <>
              {/* Reranker Model */}
              <div className="space-y-2">
                <Label>Reranker Model</Label>
                <RadioGroup
                  value={localData.reranker.model}
                  onValueChange={(value) => updateReranker('model', value)}
                >
                  {rerankerModels.map((model) => (
                    <div key={model.id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={model.id} id={model.id} />
                      <Label htmlFor={model.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>{model.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {model.speed}
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Top N for Reranker */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Rerank Top N</Label>
                  <span className="text-sm font-medium">{localData.reranker.topN}</span>
                </div>
                <Slider
                  value={[localData.reranker.topN || 3]}
                  onValueChange={([value]) => updateReranker('topN', value)}
                  min={1}
                  max={Math.min(localData.topK, 10)}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Number of results to return after reranking
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Performance Note */}
      {localData.reranker?.enabled && (
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-600">Performance Impact</p>
            <p className="text-muted-foreground">
              Reranking improves accuracy but adds {localData.reranker.model?.includes('L-6') ? '~50ms' : '~100-200ms'} latency per query.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}