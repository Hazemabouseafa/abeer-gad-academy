import { NextResponse } from 'next/server';
import { deleteResource } from '@/lib/data-store';

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deleted = deleteResource(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete resource' }, { status: 500 });
  }
}
