import { NextResponse } from 'next/server';
import modelsData from '@/data/models.json';

export async function GET() {
  try {
    // In a real app, this would come from a database
    return NextResponse.json(modelsData);
  } catch (error) {
    console.error('Error loading models:', error);
    return NextResponse.json({ models: [] });
  }
}