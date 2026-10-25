import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    path: string[];
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const filePathArray = params.path || [];
    const relativePath = filePathArray.join('/');

    // Prevent directory traversal attacks
    const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(process.cwd(), 'public', 'downloads', safePath);

    if (fs.existsSync(fullPath) && !fs.statSync(fullPath).isDirectory()) {
      const fileBuffer = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();

      const mimeTypes: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.mp3': 'audio/mpeg',
        '.txt': 'text/plain',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };

      const contentType = mimeTypes[ext] || 'application/octet-stream';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileBuffer.length.toString(),
          'Content-Disposition': `attachment; filename="${path.basename(fullPath)}"`,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Dynamic clean fallback PDF for any starter resources if file is not physically on disk yet
    const filename = path.basename(safePath) || 'resource.pdf';
    const cleanTitle = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase();

    // Generate a minimal valid PDF document on the fly
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 285 >>
stream
BT
/F1 20 Tf
70 700 Td
(Abeer Gad Academy - Official Resource) Tj
0 -35 Td
/F1 14 Tf
(Resource: ${cleanTitle}) Tj
0 -30 Td
/F1 11 Tf
(Quran & Classical Arabic Studies with Verified Continuous Sanad) Tj
0 -25 Td
(Visit: https://abeergadacademy.com) Tj
0 -25 Td
(For full interactive courses, recitation audits, and 1-on-1 sessions.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000580 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
653
%%EOF`;

    return new NextResponse(Buffer.from(pdfContent), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename.endsWith('.pdf') ? filename : filename + '.pdf'}"`,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    return new NextResponse('Error generating download', { status: 500 });
  }
}
