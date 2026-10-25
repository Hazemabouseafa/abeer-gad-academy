import { NextResponse } from 'next/server';
import { toggleSlotStatus, deleteSlot } from '@/lib/data-store';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const updated = toggleSlotStatus(params.id);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Slot not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, slot: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to toggle slot' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deleted = deleteSlot(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Slot not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Slot deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete slot' }, { status: 500 });
  }
}
