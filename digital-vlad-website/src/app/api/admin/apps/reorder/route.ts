import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { invalidateAppCache } from '@/lib/cache';

interface ReorderItem {
  id: string;
  position: number;
}

// PATCH /api/admin/apps/reorder - Update app positions
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authenticated) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { items } = body as { items: ReorderItem[] };

    if (!items || !Array.isArray(items)) {
      return errorResponse('Invalid request: items array required', 400);
    }

    // Validate all items have id and position
    for (const item of items) {
      if (!item.id || typeof item.position !== 'number') {
        return errorResponse('Invalid item format: each item needs id and position', 400);
      }
    }

    // Update all positions in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.app.update({
          where: { id: item.id },
          data: { position: item.position },
        })
      )
    );

    await invalidateAppCache();

    return successResponse({ updated: items.length }, 'Positions updated successfully');
  } catch (error) {
    console.error('Error reordering apps:', error);
    return errorResponse('Failed to reorder apps', 500);
  }
}
