'use client';

import { useEffect, useState } from 'react';
import { WizardStepProps } from '@/types/wizard.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle,
  Folder,
  FileText,
  Settings,
  Brain,
  Database,
  AlertCircle,
  Info,
  Clock,
  DollarSign,
  HardDrive,
  Hash,
  Loader2,
  Edit2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIngestState } from '../providers/ingest-state-provider';
import { useAppSelector } from '@/store/hooks';


export function ReviewStep({ 
  data, 
  onChange,
  onNext,
  onBack,
  errors,
  isLastStep 
}: WizardStepProps) {
  const { state } = useIngestState();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Get data from Redux for display names
  const embeddings = useAppSelector(state => state.embeddings.entities);
  const vectorStores = useAppSelector(state => state.vectorStores.entities);
  
  const formData = state.formData;
  const selectedEmbedding = embeddings[formData.embedding?.model || ''];
  const selectedVectorStore = vectorStores[formData.vectorStore?.type || ''];

  // Calculate estimates
  const estimates = {
    chunks: Math.ceil((formData.documents?.totalSize || 0) / (formData.processing?.chunkSize || 512) / 100),
    processingTime: Math.ceil((formData.documents?.files.length || 0) * 0.5),
    cost: ((formData.documents?.totalSize || 0) / 1000000) * (selectedEmbedding?.costPer1kTokens || 0.0001) * 1.2,
    storage: (formData.documents?.totalSize || 0) * 0.3, // Approximate 30% of original size
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canStart = agreedToTerms && isLastStep;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium mb-1">Review Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Review your settings before starting the ingestion process
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-4">
        {/* Collection Info */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Collection Information</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBack()}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{formData.collectionInfo?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Access Level</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {formData.collectionInfo?.accessLevel || 'public'}
                </Badge>
              </div>
            </div>
            {formData.collectionInfo?.description && (
              <div>
                <p className="text-muted-foreground text-sm">Description</p>
                <p className="text-sm mt-1">{formData.collectionInfo.description}</p>
              </div>
            )}
            {formData.collectionInfo?.tags && formData.collectionInfo.tags.length > 0 && (
              <div className="flex gap-2 pt-2">
                {formData.collectionInfo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Files</p>
                <p className="font-medium">{formData.documents?.files.length || 0} documents</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Size</p>
                <p className="font-medium">{formatFileSize(formData.documents?.totalSize || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Processing Configuration */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Processing Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Strategy</p>
                <p className="font-medium capitalize">{formData.processing?.strategy || 'recursive'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Chunk Size</p>
                <p className="font-medium">{formData.processing?.chunkSize || 512} tokens</p>
              </div>
              <div>
                <p className="text-muted-foreground">Overlap</p>
                <p className="font-medium">{formData.processing?.chunkOverlap || 64} tokens</p>
              </div>
              <div>
                <p className="text-muted-foreground">Preprocessing</p>
                <p className="font-medium">{formData.processing?.preprocessing?.length || 0} options</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Embedding & Vector Store */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Embedding Model</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{selectedEmbedding?.name || formData.embedding?.model || 'Not selected'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedEmbedding?.provider || formData.embedding?.provider || ''}
              </p>
              {selectedEmbedding && (
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>{selectedEmbedding.dimensions} dims</span>
                  <span>•</span>
                  <span>${selectedEmbedding.costPer1kTokens}/1K tokens</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Vector Store</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{selectedVectorStore?.name || formData.vectorStore?.type || 'Not selected'}</p>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {formData.vectorStore?.connectionType || 'cloud'} hosted
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-3">
                {formData.vectorStore?.collectionName || ''}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Estimates */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Info className="h-4 w-4" />
            Processing Estimates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <Hash className="h-4 w-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground">Est. Chunks</p>
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                ~{estimates.chunks.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <Clock className="h-4 w-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground">Processing Time</p>
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                ~{estimates.processingTime} min
              </p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <DollarSign className="h-4 w-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground">Est. Cost</p>
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                ${estimates.cost.toFixed(3)}
              </p>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
              <HardDrive className="h-4 w-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-muted-foreground">Storage Size</p>
              <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                ~{formatFileSize(estimates.storage)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Switch
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
            />
            <div className="space-y-1">
              <Label htmlFor="terms" className="font-normal cursor-pointer">
                I understand that this process will:
              </Label>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Process and chunk my documents according to the settings above</li>
                <li>• Generate embeddings using the selected model (charges may apply)</li>
                <li>• Store the embeddings in the configured vector database</li>
                <li>• Take approximately {estimates.processingTime} minutes to complete</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Review all settings carefully before starting</span>
        </div>
      </div>
    </div>
  );
}