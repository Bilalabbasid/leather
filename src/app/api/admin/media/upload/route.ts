import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only JPEG, PNG, WEBP, and AVIF are permitted.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds maximum permitted size of 8MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Check for Cloudinary server configuration
    const cloudinaryCloud = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryKey = process.env.CLOUDINARY_API_KEY;
    const cloudinarySecret = process.env.CLOUDINARY_API_SECRET;

    if (
      cloudinaryCloud &&
      cloudinaryKey &&
      cloudinarySecret &&
      !cloudinaryCloud.includes('mock') &&
      !cloudinaryCloud.includes('placeholder')
    ) {
      // In production with real Cloudinary keys, upload to Cloudinary
      const form = new FormData();
      const blob = new Blob([buffer], { type: file.type });
      form.append('file', blob);
      form.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'acemen_luxury');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloud}/image/upload`,
        { method: 'POST', body: form }
      );

      const cloudData = await cloudRes.json();
      if (!cloudRes.ok) {
        throw new Error(cloudData.error?.message || 'Cloudinary upload failed');
      }

      return NextResponse.json({
        success: true,
        url: cloudData.secure_url,
        publicId: cloudData.public_id,
        storageProvider: 'Cloudinary CDN',
      });
    }

    // 2. Standard server local storage with clear transparency (No fake CDN claimed)
    const sanitizedName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');
    const filename = `acemen_${Date.now()}_${sanitizedName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      publicId: filename,
      storageProvider: 'Local Atelier Storage (Configure CLOUDINARY_* for production CDN)',
    });
  } catch (err: any) {
    console.error('[Media Upload Error]', err);
    return NextResponse.json(
      { error: err.message || 'Media upload failed' },
      { status: 500 }
    );
  }
}
