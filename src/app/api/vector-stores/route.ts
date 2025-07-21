import { NextResponse } from 'next/server';
import vectorStoresData from '@/data/vector-stores.json';

export async function GET() {
  try {
    return NextResponse.json(vectorStoresData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch vector stores' },
      { status: 500 }
    );
  }
}