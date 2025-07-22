import { NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';

interface JobsData {
  jobs: any[];
}

export async function GET() {
  try {
    const data = await storageService.readJSON<JobsData>('jobs.json');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading jobs:', error);
    return NextResponse.json({ jobs: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate job ID
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create job object
    const newJob = {
      id: jobId,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update jobs file
    await storageService.updateJSON<JobsData>('jobs.json', (data) => {
      if (!data.jobs) {
        data.jobs = [];
      }
      data.jobs.push(newJob);
      return data;
    });
    
    return NextResponse.json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}