'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { useAppSelector } from '@/store/hooks';
import { useCollectionsStore } from '@/stores';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  FileText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Hash,
  Calendar,
  HardDrive,
  Loader2,
  Database,
  Sparkles
} from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';
import { dataService } from '@/services/data.service';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  const [loading, setLoading] = useState(true);

  // Get collection from Redux store
  // const collection = useAppSelector(state => state.collections.entities[collectionId]);
  const { getCollectionById } = useCollectionsStore();
  const collection = getCollectionById(collectionId);

  useEffect(() => {
    const checkCollectionStatus = async () => {
      try {
        // If collection is still processing, check for active job
        if (collection?.status === 'processing') {
          const jobsResponse = await dataService.getJobs();
          if (jobsResponse.data) {
            const activeJob = jobsResponse.data.jobs.find((job: any) =>
              job.targetId === collectionId &&
              job.type === 'ingestion' &&
              job.status === 'processing'
            );

            if (activeJob) {
              // Redirect to job monitoring page
              router.replace(`/jobs/${activeJob.id}`);
              return;
            }
          }
        }

        // Collection is ready, show the page
        setLoading(false);
      } catch (error) {
        console.error('Error checking collection status:', error);
        setLoading(false);
      }
    };

    if (collection) {
      checkCollectionStatus();
    } else {
      // Collection not found
      router.replace('/contexter');
    }
  }, [collectionId, collection, router]);

  if (loading) {
    return (
      <MainLayout>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </PageContent>
      </MainLayout>
    );
  }

  if (!collection) {
    return null;
  }

  return (
    <MainLayout>
      <PageHeader
        title={collection.name}
        description={collection.description}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/contexter')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Collections
          </Button>
          <Button
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Re-index
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <div className="space-y-6">
          {/* Collection Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collection.documentCount}</div>
                <p className="text-xs text-muted-foreground">Total documents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chunks</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collection.totalChunks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Vector embeddings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(collection.totalSize)}</div>
                <p className="text-xs text-muted-foreground">Total size</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Created</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{formatDate(collection.createdAt)}</div>
                <p className="text-xs text-muted-foreground">Last updated {formatDate(collection.updatedAt)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Search Documents</CardTitle>
              <CardDescription>
                Search through documents in this collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Test Query
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Collection Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Embedding Model</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model:</span>
                      <span>{collection.embeddingModel?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="capitalize">{collection.embeddingModel?.provider || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span>{collection.embeddingModel?.dimensions || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Chunking Strategy</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Strategy:</span>
                      <span className="capitalize">{collection.chunkingConfig?.strategy || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chunk Size:</span>
                      <span>{collection.chunkingConfig?.chunkSize || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overlap:</span>
                      <span>{collection.chunkingConfig?.chunkOverlap || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vector Store</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{collection.vectorStore?.type || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collection Name:</span>
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      {collection.vectorStore?.collectionName || 'Unknown'}
                    </span>
                  </div>
                  {collection.vectorStore?.namespace && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Namespace:</span>
                      <span>{collection.vectorStore.namespace}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Metadata</h4>
                  <div className="flex flex-wrap gap-1">
                    {collection.metadata?.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Documents in this collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>Document list will be available once integrated with your vector store</p>
                <p className="text-sm mt-2">Use the search above to query your documents</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </MainLayout>
  );
}