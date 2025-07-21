import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await storageService.readJSON('collections.json');
    const collection = (data as any).collections.find((c: any) => c.id === params.id);
    
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
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
    
    const updated = await storageService.updateJSON('collections.json', (data: any) => {
      const index = data.collections.findIndex((c: any) => c.id === params.id);
      
      if (index === -1) {
        throw new Error('Collection not found');
      }

      data.collections[index] = {
        ...data.collections[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return data;
    });

    const collection = (updated as any).collections.find((c: any) => c.id === params.id);
    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await storageService.updateJSON('collections.json', (data: any) => {
      data.collections = data.collections.filter((c: any) => c.id !== params.id);
      return data;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}