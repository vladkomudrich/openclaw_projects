import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, generateSlug } from '@/lib/api-utils';
import { invalidateCategoryCache } from '@/lib/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/categories/[id] - Get single category
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        apps: {
          where: { isPublished: true },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return errorResponse('Failed to fetch category', 500);
  }
}

// PATCH /api/admin/categories/[id] - Update category
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();
    const { name, icon, position } = body;

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse('Category not found', 404);
    }

    // Build update data
    const updateData: {
      name?: string;
      slug?: string;
      icon?: string | null;
      position?: number;
    } = {};

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = generateSlug(name);

      // Check if new slug conflicts with another category
      const slugExists = await prisma.category.findFirst({
        where: {
          slug: updateData.slug,
          NOT: { id },
        },
      });

      if (slugExists) {
        return errorResponse('Category with this name already exists', 409);
      }
    }

    if (icon !== undefined) {
      updateData.icon = icon || null;
    }

    if (position !== undefined) {
      updateData.position = position;
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    await invalidateCategoryCache();

    return successResponse(category, 'Category updated successfully');
  } catch (error) {
    console.error('Error updating category:', error);
    return errorResponse('Failed to update category', 500);
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    // Check if category exists
    const existing = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { apps: true },
        },
      },
    });

    if (!existing) {
      return errorResponse('Category not found', 404);
    }

    // Check if category has apps
    if (existing._count.apps > 0) {
      return errorResponse(
        'Cannot delete category with apps. Move or delete the apps first.',
        409
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    await invalidateCategoryCache();

    return successResponse({ id }, 'Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
    return errorResponse('Failed to delete category', 500);
  }
}
