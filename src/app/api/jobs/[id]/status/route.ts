import { NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';

interface JobsData {
  jobs: any[];
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, state } = await request.json();
    
    await storageService.updateJSON<JobsData>('jobs.json', (data) => {
      const jobIndex = data.jobs?.findIndex((j: any) => j.id === params.id);
      
      if (jobIndex === -1 || jobIndex === undefined) {
        throw new Error('Job not found');
      }
      
      // Update job
      data.jobs[jobIndex] = {
        ...data.jobs[jobIndex],
        status,
        state,
        stateDetails: {
          ...data.jobs[jobIndex].stateDetails,
          message: state === 'completed' ? 'Ingestion complete' : `State: ${state}`,
          lastStateChange: new Date().toISOString(),
          completedAt: state === 'completed' ? new Date().toISOString() : undefined,
        },
        updatedAt: new Date().toISOString(),
        // Add mock results for completed jobs
        ...(status === 'completed' ? {
          results: {
            chunksCreated: 1234,
            embeddingsGenerated: 1234,
            indexedDocuments: data.jobs[jobIndex].stateDetails?.progress?.total || 1,
            failedDocuments: 0,
          }
        } : {})
      };
      
      return data;
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update job status' },
      { status: error instanceof Error && error.message === 'Job not found' ? 404 : 500 }
    );
  }
}