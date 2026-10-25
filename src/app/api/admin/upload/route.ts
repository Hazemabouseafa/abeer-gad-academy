import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // 1. Sanitize category folder name
    const safeCategory = category.replace(/[^a-zA-Z0-9_-]/g, '');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', safeCategory);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 2. Generate safe unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'file';
    const ext = path.extname(originalName) || '';
    const baseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);

    const uniqueName = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    // 3. Write file to disk
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeCategory}/${uniqueName}`;
    const fileSizeMb = parseFloat((buffer.length / (1024 * 1024)).toFixed(2));

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
      fileSizeMb,
      fileType: file.type || ext.replace('.', '').toUpperCase(),
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
