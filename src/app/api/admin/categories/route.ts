import { NextResponse } from 'next/server';
import { getCategories, saveCategory, deleteCategory } from '@/lib/data-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.nameAr) {
      return NextResponse.json({ success: false, error: 'Name and NameAr are required' }, { status: 400 });
    }
    const category = saveCategory(body);
    return NextResponse.json({ success: true, category, categories: getCategories() });
  } catch (error) {
    console.error('Error saving category:', error);
    return NextResponse.json({ success: false, error: 'Failed to save category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }
    const deleted = deleteCategory(id);
    return NextResponse.json({ success: deleted, categories: getCategories() });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
