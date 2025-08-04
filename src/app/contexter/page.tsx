'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/badge';
import { 
  Plus,
  Search,
  FileText,
  Clock,
  HardDrive,
  Hash,
  Database,
  Loader2,
} from 'lucide-react';
import { cn, formatDate, formatFileSize } from '@/lib/utils';
import { 
  useCollectionsStore, 
  useCollectionsActions 
} from '@/stores';
import { useModuleService } from '@/hooks/useModuleService';

export default function ContexterPage() {
  const router = useRouter();
  const moduleService = useModuleService();
  
  // Get collections from Redux store
  const { entities: collections, loading, error } = useCollectionsStore();
const { loadCollections } = useCollectionsActions();
const collectionsArray = Object.values(collections);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Get status configurations from module service
  const statusConfigs = moduleService.getModuleStatuses('ingest');
  
  // Load collections on mount
  useEffect(() => {
    loadCollections();
  }, []);

  
  // Filter collections based on search and status
  const filteredCollections = collectionsArray.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || collection.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Calculate stats
  const stats = {
    total: collectionsArray.length,
    processing: collectionsArray.filter(c => c.status === 'processing').length,
    ready: collectionsArray.filter(c => c.status === 'ready').length,
    failed: collectionsArray.filter(c => c.status === 'error' || c.status === 'partial').length,
    totalSize: collectionsArray.reduce((acc, c) => acc + (c.totalSize || 0), 0),
    totalChunks: collectionsArray.reduce((acc, c) => acc + (c.totalChunks || 0), 0),
  };
  
  const handleCreateCollection = () => {
    router.push('/contexter/ingest');
  };
  
  const handleCollectionClick = (collectionId: string) => {
    router.push(`/contexter/collections/${collectionId}`);
  };
  
  const getStatusConfig = (status: string) => {
    return statusConfigs[status] || {
      label: status,
      color: 'gray',
      icon: 'help-circle',
      description: ''
    };
  };

  if (loading && collectionsArray.length === 0) {
    return (
      <MainLayout>
        <PageHeader
          title="Document Collections"
          description="Manage your document collections for RAG pipelines"
        />
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </PageContent>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Document Collections"
        description="Manage your document collections for RAG pipelines"
      >
        <Button onClick={handleCreateCollection} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Collection
        </Button>
      </PageHeader>

      <PageContent>
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.processing} processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {collectionsArray.reduce((acc, c) => acc + (c.documentCount || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all collections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Chunks</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChunks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Vector embeddings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
                <p className="text-xs text-muted-foreground">
                  Total storage
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'ready' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('ready')}
              >
                Ready
              </Button>
              <Button
                variant={statusFilter === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('processing')}
              >
                Processing
              </Button>
              <Button
                variant={statusFilter === 'error' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('error')}
              >
                Failed
              </Button>
            </div>
          </div>

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                {collectionsArray.length === 0 ? (
                  <>
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No collections yet</h3>
                    <p className="text-muted-foreground text-center max-w-sm mt-2">
                      Get started by creating your first document collection for RAG pipelines.
                    </p>
                    <Button onClick={handleCreateCollection} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Collection
                    </Button>
                  </>
                ) : (
                  <>
                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No results found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCollections.map((collection) => {
                const statusConfig = getStatusConfig(collection.status);
                return (
                  <Card
                    key={collection.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{collection.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {collection.description}
                          </CardDescription>
                        </div>
                        <StatusBadge status={collection.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{collection.documentCount} docs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span>{collection.totalChunks.toLocaleString()} chunks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <HardDrive className="h-4 w-4 text-muted-foreground" />
                          <span>{formatFileSize(collection.totalSize)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(collection.updatedAt)}</span>
                        </div>
                      </div>
                      
                      {/* Show progress for processing collections */}
                      {collection.status === 'processing' && collection.progress && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{collection.progress.stage}</span>
                            <span>{Math.round((collection.progress.current / collection.progress.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{ width: `${(collection.progress.current / collection.progress.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {collection.metadata?.tags && collection.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {collection.metadata.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {collection.metadata.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{collection.metadata.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </PageContent>
    </MainLayout>
  );
}