'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PipelineStateProvider } from '@/components/inferencer/pipelines/providers/pipeline-state-provider';
import { PipelineWizard } from '@/components/inferencer/pipelines/pipeline-wizard';
import { MainLayout, PageHeader, PageContent } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function PipelineCreationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pipelineType = searchParams.get('type') as 'rag' | 'llm';

  // Redirect if no type is provided
  if (!pipelineType || !['rag', 'llm'].includes(pipelineType)) {
    router.push('/inferencer/new');
    return null;
  }

  return (
    <PipelineStateProvider initialType={pipelineType}>
      <PipelineWizard />
    </PipelineStateProvider>
  );
}

export default function NewPipelineWizardPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <PageHeader
        title="Create Pipeline"
        description="Configure your AI pipeline step by step"
      >
        <Button
          variant="outline"
          onClick={() => router.push('/inferencer/new')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Selection
        </Button>
      </PageHeader>
      
      <PageContent>
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <PipelineCreationContent />
        </Suspense>
      </PageContent>
    </MainLayout>
  );
}