'use client';

import { useState, useEffect } from 'react';
import { WizardStepProps } from '@/types/wizard.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  Database,
  Cloud,
  Server,
  CheckCircle,
  Info,
  Globe,
  Lock,
  Zap,
  Shield,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngestState } from '../providers/ingest-state-provider';
import { useVectorStoresStore } from '@/stores';

interface VectorStoreData {
  type: string;
  connectionType: 'cloud' | 'local';
  collectionName: string;
  namespace?: string;
}

export function VectorStoreStep({ 
  data = {}, 
  onChange,
  errors 
}: WizardStepProps) {
  const { updateStepData } = useIngestState();
  const { entities: vectorStores, ids: vectorStoreIds, loading } = useVectorStoresStore();

  
  // Filter only active vector stores
  const activeStores = vectorStoreIds
    .map(id => vectorStores[id])
    .filter(store => store && store.status === 'active');

  const [formData, setFormData] = useState<VectorStoreData>({
    type: activeStores[0]?.id || 'qdrant',
    connectionType: 'cloud',
    collectionName: '',
    namespace: '',
    ...data
  });

  useEffect(() => {
    // Auto-generate collection name if empty
    if (!formData.collectionName) {
      const timestamp = Date.now();
      setFormData(prev => ({
        ...prev,
        collectionName: `collection_${timestamp}`
      }));
    }
  }, []);

  useEffect(() => {
    // Set default vector store if not set and stores are loaded
    if (!formData.type && activeStores.length > 0) {
      setFormData(prev => ({
        ...prev,
        type: activeStores[0].id,
        connectionType: activeStores[0].cloudOption ? 'cloud' : 'local'
      }));
    }
  }, [activeStores]);

  useEffect(() => {
    onChange(formData);
    updateStepData('vectorStore', formData);
  }, [formData]);

  const selectedStore = vectorStores[formData.type];
  const isValid = formData.collectionName.trim().length > 0;

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading vector stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-1">Configure Vector Store</h3>
        <p className="text-sm text-muted-foreground">
          Choose where to store your document embeddings
        </p>
      </div>

      {/* Check if there are any active vector stores */}
      {activeStores.length === 0 ? (
        <>
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                No Active Vector Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                No vector stores are currently active. Please activate at least one vector store in the configuration.
              </p>
            </CardContent>
          </Card>

          {/* Info Box - Show even when no stores are active */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Info className="h-4 w-4" />
                Vector Store Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>Qdrant</strong>: Best for production with advanced filtering needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>Pinecone</strong>: Easiest to get started, fully managed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>ChromaDB</strong>: Great for local development and testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>FAISS</strong>: Fastest for similarity search, best for large scale</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Vector Store Selection */}
          <div className="grid gap-4">
            {activeStores.map((store) => {
              const isSelected = formData.type === store.id;

              return (
                <Card
                  key={store.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    isSelected && "border-primary ring-2 ring-primary ring-offset-2"
                  )}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    type: store.id,
                    connectionType: store.cloudOption ? 'cloud' : 'local'
                  }))}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg text-2xl",
                          isSelected ? "bg-primary/10" : "bg-muted"
                        )}>
                          {store.icon}
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {store.name}
                            {store.recommended && (
                              <Badge variant="secondary" className="text-xs">
                                Recommended
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {store.cloudOption && (
                              <Badge variant="outline" className="text-xs">
                                <Cloud className="h-3 w-3 mr-1" />
                                Cloud
                              </Badge>
                            )}
                            {store.selfHosted && (
                              <Badge variant="outline" className="text-xs">
                                <Server className="h-3 w-3 mr-1" />
                                Self-hosted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {store.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {store.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Connection Type */}
          {selectedStore && selectedStore.cloudOption && selectedStore.selfHosted && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Connection Type</CardTitle>
                <CardDescription>
                  Choose how to connect to {selectedStore.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.connectionType}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    connectionType: value as 'cloud' | 'local' 
                  }))}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <label htmlFor="cloud" className="cursor-pointer">
                      <Card className={cn(
                        "p-4",
                        formData.connectionType === 'cloud' && "border-primary"
                      )}>
                        <RadioGroupItem value="cloud" id="cloud" className="sr-only" />
                        <div className="flex items-center gap-3 mb-2">
                          <Cloud className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">Cloud Hosted</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Managed service, no infrastructure needed
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Easy setup
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Pay as you go
                          </Badge>
                        </div>
                      </Card>
                    </label>

                    <label htmlFor="local" className="cursor-pointer">
                      <Card className={cn(
                        "p-4",
                        formData.connectionType === 'local' && "border-primary"
                      )}>
                        <RadioGroupItem value="local" id="local" className="sr-only" />
                        <div className="flex items-center gap-3 mb-2">
                          <Server className="h-5 w-5 text-green-500" />
                          <span className="font-medium">Self-Hosted</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Full control, runs on your infrastructure
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Data privacy
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Full control
                          </Badge>
                        </div>
                      </Card>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Collection Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Collection Settings</CardTitle>
              <CardDescription>
                Configure your vector collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Collection Name */}
              <div className="space-y-2">
                <Label htmlFor="collection-name">Collection Name *</Label>
                <Input
                  id="collection-name"
                  value={formData.collectionName}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    collectionName: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
                  }))}
                  placeholder="e.g., customer_support_v1"
                  className={errors?.collectionName ? 'border-red-500' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and underscores only
                </p>
                {errors?.collectionName && (
                  <p className="text-sm text-red-500">{errors.collectionName}</p>
                )}
              </div>

              {/* Namespace (for Pinecone) */}
              {formData.type === 'pinecone' && (
                <div className="space-y-2">
                  <Label htmlFor="namespace">Namespace (Optional)</Label>
                  <Input
                    id="namespace"
                    value={formData.namespace || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      namespace: e.target.value
                    }))}
                    placeholder="e.g., production"
                  />
                  <p className="text-xs text-muted-foreground">
                    Organize vectors within your index
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Box */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Info className="h-4 w-4" />
                Vector Store Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>Qdrant</strong>: Best for production with advanced filtering needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>Pinecone</strong>: Easiest to get started, fully managed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>ChromaDB</strong>: Great for local development and testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-xs mt-1">•</span>
                  <span><strong>FAISS</strong>: Fastest for similarity search, best for large scale</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Summary - Only show when stores are loaded and one is selected */}
          {selectedStore && (
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Vector Store Configuration</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Store:</span>
                    <span className="ml-2 font-medium">{selectedStore.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium capitalize">{formData.connectionType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Collection:</span>
                    <span className="ml-2 font-medium font-mono text-xs">{formData.collectionName}</span>
                  </div>
                  {formData.namespace && (
                    <div>
                      <span className="text-muted-foreground">Namespace:</span>
                      <span className="ml-2 font-medium">{formData.namespace}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}