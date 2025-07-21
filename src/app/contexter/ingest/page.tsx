'use client';

import { IngestStateProvider } from '@/components/contexter/ingest/providers/ingest-state-provider';
import { IngestWizard } from '@/components/contexter/ingest/ingest-wizard';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function IngestPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <PageHeader
        title="Create Document Collection"
        description="Upload and process documents for your RAG pipeline"
      >
        <Button
          variant="outline"
          onClick={() => router.push('/contexter')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Button>
      </PageHeader>
      
      <PageContent>
        <IngestStateProvider>
          <IngestWizard />
        </IngestStateProvider>
      </PageContent>
    </MainLayout>
  );
}