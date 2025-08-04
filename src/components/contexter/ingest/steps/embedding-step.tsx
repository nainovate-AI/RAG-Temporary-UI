'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WizardStepProps } from '@/types/wizard.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain,
  Zap,
  DollarSign,
  Info,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngestState } from '../providers/ingest-state-provider';
import { useEmbeddingsStore } from '@/stores';

interface EmbeddingData {
  model: string;
  provider: string;
}

export function EmbeddingStep({ 
  data = {}, 
  onChange,
  errors 
}: WizardStepProps) {
  const router = useRouter();
  const { updateStepData } = useIngestState();
  
  // ✅ Fixed: Get both entities and active embeddings
  const { entities: embeddings, getActiveEmbeddings, getEmbeddingById } = useEmbeddingsStore();
  const activeEmbeddings = getActiveEmbeddings();
  
  const [formData, setFormData] = useState<EmbeddingData>({
    model: activeEmbeddings[0]?.id || '',
    provider: activeEmbeddings[0]?.provider || '',
    ...data
  });

  useEffect(() => {
    onChange(formData);
    updateStepData('embedding', formData);
  }, [formData]);

  // ✅ Fixed: Use getEmbeddingById for object lookup
  const selectedEmbedding = getEmbeddingById(formData.model);

  return (
    <div className="space-y-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Select Embedding Model</h3>
            <p className="text-sm text-muted-foreground">
              Choose how to convert your documents into searchable vectors
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/config/embeddings')}
            type="button"
          >
            <Settings className="mr-1 h-3 w-3" />
            Configure Models
          </Button>
        </div>
      </CardHeader>

      {/* Check if there are any active embeddings */}
      {activeEmbeddings.length === 0 ? (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="h-4 w-4" />
              No Active Embedding Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              No embedding models are currently active. Please activate at least one embedding model in the configuration.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Model Grid */}
          <div className="grid gap-4">
            {activeEmbeddings.map((embedding) => {
              const isSelected = formData.model === embedding.id;

              return (
                <Card
                  key={embedding.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    isSelected && "border-primary ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={() => setFormData({ 
                    model: embedding.id, 
                    provider: embedding.provider 
                  })}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg text-2xl",
                          isSelected ? "bg-primary/10" : "bg-muted"
                        )}>
                          {getProviderIcon(embedding.provider)}
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {embedding.name}
                            {embedding.id === 'text-embedding-ada-002' && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Most Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <Badge 
                            variant="outline" 
                            className={cn("mt-1", getProviderBadgeColor(embedding.provider))}
                          >
                            {embedding.provider}
                          </Badge>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {embedding.description}
                    </p>

                    {/* Model Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Brain className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Dimensions</p>
                        <p className="text-sm font-medium">{embedding.dimensions}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Zap className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Max Tokens</p>
                        <p className="text-sm font-medium">{embedding.maxInputTokens.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Per 1K Tokens</p>
                        <p className="text-sm font-medium">${embedding.costPer1kTokens}</p>
                      </div>
                    </div>

                    {/* Performance Indicators */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">High Performance</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">Available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recommendation Box */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Info className="h-4 w-4" />
                Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                For most use cases, we recommend OpenAI's text-embedding-ada-002 for its balance of performance and cost.
              </p>
            </CardContent>
          </Card>

          {/* Cost Estimation */}
          {selectedEmbedding && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-sm">Estimated Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Based on selected model: <span className="font-medium">{selectedEmbedding.name}</span>
                </p>
                <p className="text-lg font-semibold mt-2">
                  ${selectedEmbedding.costPer1kTokens} per 1K tokens
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

// Helper functions stay the same
const getProviderBadgeColor = (provider: string) => {
  switch (provider) {
    case 'openai':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'anthropic':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'cohere':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'voyage':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  }
};

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'openai':
      return '🤖';
    case 'anthropic':
      return '🧠';
    case 'cohere':
      return '🎯';
    case 'voyage':
      return '🚀';
    default:
      return '💡';
  }
};