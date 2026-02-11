import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse, generateSlug } from '@/lib/api-utils';
import { invalidateAppCache } from '@/lib/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/apps/[id] - Get single app
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const app = await prisma.app.findUnique({
      where: { id },
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

    if (!app) {
      return errorResponse('App not found', 404);
    }

    return successResponse(app);
  } catch (error) {
    console.error('Error fetching app:', error);
    return errorResponse('Failed to fetch app', 500);
  }
}

// PATCH /api/admin/apps/[id] - Update app
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();

    // Check if app exists
    const existing = await prisma.app.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse('App not found', 404);
    }

    // Build update data
    const updateData: {
      title?: string;
      slug?: string;
      description?: string;
      iconUrl?: string;
      screenshots?: string[];
      externalLink?: string;
      categoryId?: string;
      accentColor?: string;
      isPublished?: boolean;
      position?: number;
    } = {};

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

    if (title !== undefined) {
      updateData.title = title;
      const baseSlug = generateSlug(title);
      let slug = baseSlug;
      let counter = 1;

      // Ensure unique slug (excluding current app)
      while (
        await prisma.app.findFirst({
          where: { slug, NOT: { id } },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    if (description !== undefined) updateData.description = description;
    if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
    if (screenshots !== undefined) updateData.screenshots = screenshots;
    if (externalLink !== undefined) updateData.externalLink = externalLink;
    if (accentColor !== undefined) updateData.accentColor = accentColor;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (position !== undefined) updateData.position = position;

    if (categoryId !== undefined) {
      // Verify category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return errorResponse('Category not found', 404);
      }
      updateData.categoryId = categoryId;
    }

    const app = await prisma.app.update({
      where: { id },
      data: updateData,
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

    return successResponse(app, 'App updated successfully');
  } catch (error) {
    console.error('Error updating app:', error);
    return errorResponse('Failed to update app', 500);
  }
}

// DELETE /api/admin/apps/[id] - Delete app
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    // Check if app exists
    const existing = await prisma.app.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse('App not found', 404);
    }

    await prisma.app.delete({
      where: { id },
    });

    await invalidateAppCache();

    return successResponse({ id }, 'App deleted successfully');
  } catch (error) {
    console.error('Error deleting app:', error);
    return errorResponse('Failed to delete app', 500);
  }
}
