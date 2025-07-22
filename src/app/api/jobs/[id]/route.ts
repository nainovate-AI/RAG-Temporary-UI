import { NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';

interface JobsData {
  jobs: any[];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await storageService.readJSON<JobsData>('jobs.json');
    const job = data.jobs?.find((j: any) => j.id === params.id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error reading job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    
    await storageService.updateJSON<JobsData>('jobs.json', (data) => {
      const jobIndex = data.jobs?.findIndex((j: any) => j.id === params.id);
      
      if (jobIndex === -1 || jobIndex === undefined) {
        throw new Error('Job not found');
      }
      
      data.jobs[jobIndex] = {
        ...data.jobs[jobIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      return data;
    });
    
    // Read the updated job
    const updatedData = await storageService.readJSON<JobsData>('jobs.json');
    const updatedJob = updatedData.jobs?.find((j: any) => j.id === params.id);
    
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update job' },
      { status: error instanceof Error && error.message === 'Job not found' ? 404 : 500 }
    );
  }
}