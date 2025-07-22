import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';
import { moduleService } from '@/services/module.service';

interface PipelinesData {
  pipelines: any[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await storageService.readJSON<PipelinesData>('pipelines.json');
    const pipeline = data.pipelines.find(p => p.id === params.id);
    
    if (!pipeline) {
      return NextResponse.json(
        { error: 'Pipeline not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(pipeline);
  } catch (error) {
    console.error('Error reading pipeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pipeline' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    
    const updated = await storageService.updateJSON<PipelinesData>('pipelines.json', (data) => {
      const index = data.pipelines.findIndex(p => p.id === params.id);
      
      if (index === -1) {
        throw new Error('Pipeline not found');
      }
      
      // Validate status and state if provided
      if (updates.status && !moduleService.validateStatus('pipeline', updates.status)) {
        throw new Error('Invalid status');
      }
      
      if (updates.state && !moduleService.validateState('pipeline', updates.state)) {
        throw new Error('Invalid state');
      }
      
      // Update pipeline
      data.pipelines[index] = {
        ...data.pipelines[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      // Update stateDetails if state changed
      if (updates.state) {
        data.pipelines[index].stateDetails = {
          message: moduleService.getStateDescription('pipeline', updates.state),
          lastStateChange: new Date().toISOString()
        };
      }
      
      return data;
    });
    
    const updatedPipeline = updated.pipelines.find(p => p.id === params.id);
    return NextResponse.json(updatedPipeline);
  } catch (error) {
    console.error('Error updating pipeline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update pipeline' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await storageService.updateJSON<PipelinesData>('pipelines.json', (data) => {
      const index = data.pipelines.findIndex(p => p.id === params.id);
      
      if (index === -1) {
        throw new Error('Pipeline not found');
      }
      
      data.pipelines.splice(index, 1);
      return data;
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pipeline:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete pipeline' },
      { status: 500 }
    );
  }
}