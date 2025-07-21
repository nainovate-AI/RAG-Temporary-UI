import { NextRequest, NextResponse } from 'next/server';
import { storageService } from '@/services/storage.service';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const data = await storageService.readJSON('collections.json');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCollection = {
      ...body,
      id: `coll_${uuidv4()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = await storageService.updateJSON('collections.json', (data: any) => {
      data.collections.push(newCollection);
      return data;
    });

    return NextResponse.json(newCollection);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}