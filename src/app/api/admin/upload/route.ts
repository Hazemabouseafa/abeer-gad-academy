import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Maximum allowed storage for uploads: 5 Gigabytes (5 * 1024 * 1024 * 1024 bytes)
const MAX_STORAGE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB = 5,368,709,120 bytes

/**
 * Recursively calculates the total disk size in bytes of a directory
 */
function getDirectorySizeBytes(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0;
  let total = 0;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      try {
        if (entry.isDirectory()) {
          total += getDirectorySizeBytes(fullPath);
        } else if (entry.isFile()) {
          const stat = fs.statSync(fullPath);
          total += stat.size;
        }
      } catch {
        // Skip inaccessible files or broken symlinks
      }
    }
  } catch (err) {
    console.error('Error reading directory size:', err);
  }
  return total;
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const currentUsageBytes = getDirectorySizeBytes(uploadsDir);
    const usedMb = parseFloat((currentUsageBytes / (1024 * 1024)).toFixed(2));
    const usedGb = parseFloat((currentUsageBytes / (1024 * 1024 * 1024)).toFixed(3));
    const percentage = parseFloat(((currentUsageBytes / MAX_STORAGE_BYTES) * 100).toFixed(1));

    return NextResponse.json({
      success: true,
      usedBytes: currentUsageBytes,
      maxBytes: MAX_STORAGE_BYTES,
      usedMb,
      maxMb: 5120,
      usedGb,
      maxGb: 5,
      percentage: Math.min(percentage, 100),
      isExceeded: currentUsageBytes >= MAX_STORAGE_BYTES,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const baseUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(baseUploadsDir)) {
      fs.mkdirSync(baseUploadsDir, { recursive: true });
    }

    // 1. Check current storage usage before saving file (Strict 5 GB Limit)
    const currentUsageBytes = getDirectorySizeBytes(baseUploadsDir);
    const newFileSize = file.size;

    if (currentUsageBytes + newFileSize > MAX_STORAGE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: 'لقد استنفذت المساحة المتاحة لك على السيرفر تواصل مع المدير',
          errorEn: 'You have exhausted the available server storage space (5 GB limit). Please contact the administrator.',
          storageExceeded: true,
          currentUsageBytes,
          maxStorageBytes: MAX_STORAGE_BYTES,
        },
        { status: 400 }
      );
    }

    // 2. Sanitize category folder name
    const safeCategory = category.replace(/[^a-zA-Z0-9_-]/g, '');
    const targetDir = path.join(baseUploadsDir, safeCategory);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 3. Read buffer & generate unique safe filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'file';
    const ext = path.extname(originalName) || '';
    const baseName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);

    const uniqueName = `${Date.now()}_${baseName}${ext}`;
    const filePath = path.join(targetDir, uniqueName);

    // 4. Write file to disk
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeCategory}/${uniqueName}`;
    const fileSizeMb = parseFloat((buffer.length / (1024 * 1024)).toFixed(2));
    const updatedUsageBytes = currentUsageBytes + buffer.length;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
      fileSizeMb,
      fileType: file.type || ext.replace('.', '').toUpperCase(),
      storage: {
        usedBytes: updatedUsageBytes,
        maxBytes: MAX_STORAGE_BYTES,
        usedMb: parseFloat((updatedUsageBytes / (1024 * 1024)).toFixed(2)),
        maxMb: 5120,
        percentage: parseFloat(((updatedUsageBytes / MAX_STORAGE_BYTES) * 100).toFixed(1)),
      },
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
