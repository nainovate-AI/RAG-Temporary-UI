import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { moduleService } from '@/services/module.service';

interface PipelinesData {
  pipelines: any[];
}

export async function GET() {
  try {
    const data = await storageService.readJSON<PipelinesData>('pipelines.json');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading pipelines:', error);
    return NextResponse.json({ pipelines: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate pipeline ID
    const pipelineId = `pipe_${uuidv4()}`;
    
    // Validate status and state using module service
    const isValidStatus = moduleService.validateStatus('pipeline', body.status || 'draft');
    const isValidState = moduleService.validateState('pipeline', body.state || 'configuring');
    
    if (!isValidStatus || !isValidState) {
      return NextResponse.json(
        { error: 'Invalid status or state' },
        { status: 400 }
      );
    }
    
    // Create pipeline object
    const newPipeline = {
      id: pipelineId,
      name: body.name,
      description: body.description || '',
      type: body.type || 'rag',
      module: 'pipeline',
      status: body.status || 'draft',
      state: body.state || 'configuring',
      stateDetails: {
        message: moduleService.getStateDescription('pipeline', body.state || 'configuring'),
        lastStateChange: new Date().toISOString()
      },
      config: body.config || {},
      metrics: {
        totalQueries: 0,
        avgLatency: 0,
        successRate: 0,
        costPerDay: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update pipelines file
    await storageService.updateJSON<PipelinesData>('pipelines.json', (data) => {
      if (!data.pipelines) {
        data.pipelines = [];
      }
      data.pipelines.push(newPipeline);
      return data;
    });
    
    return NextResponse.json(newPipeline);
  } catch (error) {
    console.error('Error creating pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to create pipeline' },
      { status: 500 }
    );
  }
}