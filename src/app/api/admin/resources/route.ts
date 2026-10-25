import { NextResponse } from 'next/server';
import { getResources, saveResource } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const resources = getResources();
    return NextResponse.json({ success: true, resources });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    const resource = saveResource(body);
    return NextResponse.json({ success: true, resource });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save resource' }, { status: 500 });
  }
}
