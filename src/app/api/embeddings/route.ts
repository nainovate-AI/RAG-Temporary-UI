import { NextResponse } from 'next/server';
import embeddingsData from '@/data/embeddings.json';

export async function GET() {
  try {
    return NextResponse.json(embeddingsData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch embeddings' },
      { status: 500 }
    );
  }
}