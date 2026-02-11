import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { errorResponse, successResponse } from '@/lib/api-utils';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// POST /api/admin/upload - Upload image(s)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      // Try single file upload
      const file = formData.get('file') as File | null;
      if (file) {
        files.push(file);
      }
    }

    if (files.length === 0) {
      return errorResponse('No files provided', 400);
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedFiles: { url: string; name: string }[] = [];
    const errors: { name: string; error: string }[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push({
          name: file.name,
          error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}`,
        });
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push({
          name: file.name,
          error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 5MB`,
        });
        continue;
      }

      try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const extension = path.extname(file.name) || getExtensionFromMime(file.type);
        const filename = `${timestamp}-${randomStr}${extension}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Convert file to buffer and write
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        uploadedFiles.push({
          url: `/uploads/${filename}`,
          name: file.name,
        });
      } catch (error) {
        console.error(`Error saving file ${file.name}:`, error);
        errors.push({
          name: file.name,
          error: 'Failed to save file',
        });
      }
    }

    if (uploadedFiles.length === 0 && errors.length > 0) {
      return errorResponse('All uploads failed', 400, { errors });
    }

    return successResponse(
      {
        files: uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
      },
      `${uploadedFiles.length} file(s) uploaded successfully`
    );
  } catch (error) {
    console.error('Upload error:', error);
    return errorResponse('Upload failed', 500);
  }
}

function getExtensionFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
  };
  return map[mimeType] || '.jpg';
}
