'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/badge';
import { WizardStepProps } from '@/types/wizard.types';
import { useCollectionsStore, useActiveCollections } from '@/stores';
import { 
  Search, 
  Database, 
  FileText, 
  Check, 
  Info,
  AlertCircle,
  Hash
} from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface CollectionsData {
  collections: string[]; // Collection IDs
  _isValid?: boolean;
}

export function CollectionsStep({ data, onChange }: WizardStepProps) {
  // ✅ Replace Redux with Zustand - much cleaner!
  const { entities: allCollections } = useCollectionsStore();
  const collectionsArray = useActiveCollections(); // Use the selector hook directly
  
  const [selectedCollections, setSelectedCollections] = useState<string[]>(() => {
    const initialData = data as CollectionsData;
    return initialData?.collections || [];
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const isValid = selectedCollections.length > 0;
    onChange({ collections: selectedCollections, _isValid: isValid });
  }, [selectedCollections, onChange]);

  // Rest of the component logic stays the same
  const filteredCollections = collectionsArray.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.metadata.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const selectedStats = {
    totalDocuments: selectedCollections.reduce((acc, id) => {
        const collection = allCollections[id];
        return acc + (collection?.documentCount || 0);
    }, 0),
    totalChunks: selectedCollections.reduce((acc, id) => {
        const collection = allCollections[id];
        return acc + (collection?.totalChunks || 0);
    }, 0),
    totalSize: selectedCollections.reduce((acc, id) => {
        const collection = allCollections[id];
        return acc + (collection?.totalSize || 0);
    }, 0),
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <Info className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-primary mb-1">Select Document Collections</p>
          <p className="text-muted-foreground">
            Choose one or more collections that contain the documents your RAG pipeline will use for retrieval.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search collections..."
          className="pl-10"
        />
      </div>

      {/* Selected Summary */}
      {selectedCollections.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Selected Collections Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-semibold">{selectedCollections.length}</p>
                <p className="text-muted-foreground">Collections</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{selectedStats.totalDocuments.toLocaleString()}</p>
                <p className="text-muted-foreground">Documents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{selectedStats.totalChunks.toLocaleString()}</p>
                <p className="text-muted-foreground">Chunks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collections Grid */}
      <div className="space-y-3">
        {filteredCollections.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No collections found matching your search.' : 'No ready collections available.'}
              </p>
              <Button
                variant="link"
                onClick={() => window.location.href = '/contexter/ingest'}
                className="mt-2"
              >
                Create a new collection
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCollections.map((collection) => {
            const isSelected = selectedCollections.includes(collection.id);
            
            return (
              <Card
                key={collection.id}
                className={cn(
                  'cursor-pointer transition-all',
                  isSelected && 'ring-2 ring-primary bg-primary/5'
                )}
                onClick={() => toggleCollection(collection.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-base">{collection.name}</CardTitle>
                      {collection.description && (
                        <CardDescription className="text-sm">
                          {collection.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                      isSelected 
                        ? 'bg-primary border-primary' 
                        : 'border-gray-300 dark:border-gray-600'
                    )}>
                      {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{collection.documentCount || 0} docs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      <span>{collection.totalChunks?.toLocaleString() || 0} chunks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-4 w-4" />
                      <span>{formatFileSize(collection.totalSize || 0)}</span>
                    </div>
                  </div>
                  {collection.metadata?.tags && collection.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {collection.metadata.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {selectedCollections.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-600">
            Please select at least one collection to continue.
          </p>
        </div>
      )}
    </div>
  );
}