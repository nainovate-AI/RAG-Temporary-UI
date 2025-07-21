'use client';

import { useState, useEffect } from 'react';
import { WizardStepProps } from '@/types/wizard.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Scissors, 
  Layers,
  Info,
  Type,
  Braces,
  Hash,
  FileCode,
  CheckCircle,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngestState } from '../providers/ingest-state-provider';
import chunkingStrategiesData from '@/data/chunking-strategies.json';

interface ProcessingData {
  strategy: 'recursive' | 'fixed' | 'semantic';
  chunkSize: number;
  chunkOverlap: number;
  preprocessing: string[];
}

// Map icon names to actual components
const iconMap: Record<string, LucideIcon> = {
  FileText,
  Scissors,
  Layers,
  Type,
  Braces,
  Hash,
  FileCode
};

// Transform the data to include actual icon components
const chunkingStrategies = chunkingStrategiesData.strategies.map(strategy => ({
  ...strategy,
  icon: iconMap[strategy.icon] || FileText
}));

const preprocessingOptions = chunkingStrategiesData.preprocessingOptions.map(option => ({
  ...option,
  icon: iconMap[option.icon] || FileText
}));

export function ProcessingStep({ 
  data = {}, 
  onChange,
  errors 
}: WizardStepProps) {
  const { updateStepData } = useIngestState();
  const [formData, setFormData] = useState<ProcessingData>({
    strategy: 'recursive',
    chunkSize: 512,
    chunkOverlap: 64,
    preprocessing: preprocessingOptions
      .filter(opt => opt.defaultEnabled)
      .map(opt => opt.id),
    ...data
  });

  useEffect(() => {
    onChange(formData);
    updateStepData('processing', formData);
  }, [formData]);

  const selectedStrategy = chunkingStrategies.find(s => s.id === formData.strategy);

  const togglePreprocessing = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      preprocessing: prev.preprocessing.includes(optionId)
        ? prev.preprocessing.filter(id => id !== optionId)
        : [...prev.preprocessing, optionId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Chunking Strategy */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-1">Chunking Strategy</h3>
          <p className="text-sm text-muted-foreground">
            Choose how to split your documents into smaller pieces
          </p>
        </div>

        <div className="grid gap-4">
          {chunkingStrategies.map((strategy) => {
            const Icon = strategy.icon;
            const isSelected = formData.strategy === strategy.id;

            return (
              <Card
                key={strategy.id}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected && "border-primary ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => setFormData(prev => ({ ...prev, strategy: strategy.id as any }))}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{strategy.name}</CardTitle>
                        {strategy.recommended && (
                          <Badge variant="secondary" className="mt-1">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {strategy.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">Pros:</span>
                      <span className="text-xs text-muted-foreground">
                        {strategy.pros.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Cons:</span>
                      <span className="text-xs text-muted-foreground">
                        {strategy.cons.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium">Best for:</span>
                      <span className="text-xs text-muted-foreground">
                        {strategy.bestFor}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chunk Size Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chunk Configuration</CardTitle>
          <CardDescription>
            Configure the size and overlap of text chunks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chunk Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="chunk-size">Chunk Size</Label>
              <span className="text-sm font-medium">{formData.chunkSize} tokens</span>
            </div>
            <Slider
              id="chunk-size"
              min={128}
              max={2048}
              step={128}
              value={[formData.chunkSize]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, chunkSize: value }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>128</span>
              <span>Small chunks for precise retrieval</span>
              <span>Large chunks for more context</span>
              <span>2048</span>
            </div>
          </div>

          {/* Chunk Overlap */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="chunk-overlap">Chunk Overlap</Label>
              <span className="text-sm font-medium">{formData.chunkOverlap} tokens</span>
            </div>
            <Slider
              id="chunk-overlap"
              min={0}
              max={256}
              step={32}
              value={[formData.chunkOverlap]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, chunkOverlap: value }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>No overlap</span>
              <span>Some context preservation</span>
              <span>256</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-600 dark:text-blue-400">
              <p className="font-medium mb-1">Recommendations:</p>
              <ul className="space-y-1 text-xs">
                <li>• Chunk size: 512-1024 tokens for most use cases</li>
                <li>• Overlap: 10-20% of chunk size to preserve context</li>
                <li>• Smaller chunks = more precise retrieval but less context</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preprocessing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Text Preprocessing</CardTitle>
          <CardDescription>
            Apply preprocessing to improve text quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {preprocessingOptions.map((option) => {
              const Icon = option.icon;
              const isEnabled = formData.preprocessing.includes(option.id);

              return (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <Label
                      htmlFor={option.id}
                      className="font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                  <Switch
                    id={option.id}
                    checked={isEnabled}
                    onCheckedChange={() => togglePreprocessing(option.id)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Processing Configuration</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Strategy:</span>
              <span className="ml-2 font-medium">{selectedStrategy?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Chunk Size:</span>
              <span className="ml-2 font-medium">{formData.chunkSize} tokens</span>
            </div>
            <div>
              <span className="text-muted-foreground">Overlap:</span>
              <span className="ml-2 font-medium">{formData.chunkOverlap} tokens</span>
            </div>
            <div>
              <span className="text-muted-foreground">Preprocessing:</span>
              <span className="ml-2 font-medium">{formData.preprocessing.length} options</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}