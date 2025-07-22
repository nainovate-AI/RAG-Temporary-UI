import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';
import { moduleService } from '@/services/module.service';

interface PipelinesData {
  pipelines: any[];
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, state } = await request.json();
    
    // Validate status and state
    if (!moduleService.validateStatus('pipeline', status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    if (!moduleService.validateState('pipeline', state)) {
      return NextResponse.json(
        { error: 'Invalid state' },
        { status: 400 }
      );
    }
    
    const updated = await storageService.updateJSON<PipelinesData>('pipelines.json', (data) => {
      const pipeline = data.pipelines.find(p => p.id === params.id);
      
      if (!pipeline) {
        throw new Error('Pipeline not found');
      }
      
      pipeline.status = status;
      pipeline.state = state;
      pipeline.stateDetails = {
        message: moduleService.getStateDescription('pipeline', state),
        lastStateChange: new Date().toISOString()
      };
      pipeline.updatedAt = new Date().toISOString();
      
      return data;
    });
    
    const updatedPipeline = updated.pipelines.find(p => p.id === params.id);
    return NextResponse.json(updatedPipeline);
  } catch (error) {
    console.error('Error updating pipeline status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update status' },
      { status: 500 }
    );
  }
}