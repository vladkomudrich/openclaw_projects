import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, generateSlug, validateRequired } from '@/lib/api-utils';
import { invalidateAppCache } from '@/lib/cache';

// GET /api/admin/apps - List all apps with categories
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const publishedOnly = searchParams.get('published') === 'true';

    const where: {
      categoryId?: string;
      isPublished?: boolean;
    } = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (publishedOnly) {
      where.isPublished = true;
    }

    const apps = await prisma.app.findMany({
      where,
      orderBy: { position: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return successResponse(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    return errorResponse('Failed to fetch apps', 500);
  }
}

// POST /api/admin/apps - Create app
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const {
      title,
      description,
      iconUrl,
      screenshots,
      externalLink,
      categoryId,
      accentColor,
      isPublished,
      position,
    } = body;

    // Validate required fields
    const validation = validateRequired(body, [
      'title',
      'description',
      'iconUrl',
      'externalLink',
      'categoryId',
      'accentColor',
    ]);

    if (!validation.valid) {
      return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`, 400);
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    // Generate slug from title
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.app.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Get max position if not provided
    let finalPosition = position;
    if (finalPosition === undefined) {
      const maxPosition = await prisma.app.aggregate({
        _max: { position: true },
      });
      finalPosition = (maxPosition._max.position || 0) + 1;
    }

    const app = await prisma.app.create({
      data: {
        title,
        slug,
        description,
        iconUrl,
        screenshots: screenshots || [],
        externalLink,
        categoryId,
        accentColor,
        isPublished: isPublished ?? false,
        position: finalPosition,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    await invalidateAppCache();

    return successResponse(app, 'App created successfully', 201);
  } catch (error) {
    console.error('Error creating app:', error);
    return errorResponse('Failed to create app', 500);
  }
}
