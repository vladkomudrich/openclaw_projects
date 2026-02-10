import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, generateSlug, validateRequired } from '@/lib/api-utils';
import { invalidateCategoryCache } from '@/lib/cache';

// GET /api/admin/categories - List all categories
export async function GET() {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: { apps: true },
        },
      },
    });

    return successResponse(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}

// POST /api/admin/categories - Create category
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, icon, position } = body;

    // Validate required fields
    const validation = validateRequired(body, ['name']);
    if (!validation.valid) {
      return errorResponse(`Missing required fields: ${validation.missing.join(', ')}`, 400);
    }

    // Generate slug from name
    const slug = generateSlug(name);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return errorResponse('Category with this name already exists', 409);
    }

    // Get max position if not provided
    let finalPosition = position;
    if (finalPosition === undefined) {
      const maxPosition = await prisma.category.aggregate({
        _max: { position: true },
      });
      finalPosition = (maxPosition._max.position || 0) + 1;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: icon || null,
        position: finalPosition,
      },
    });

    await invalidateCategoryCache();

    return successResponse(category, 'Category created successfully', 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse('Failed to create category', 500);
  }
}
