import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getOrSet, CACHE_KEYS } from '@/lib/cache';

// GET /api/apps - List published apps (public, cached)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');

    // Build cache key
    const cacheKey = `${CACHE_KEYS.APPS_LIST}:${categorySlug || 'all'}`;

    const apps = await getOrSet(
      cacheKey,
      async () => {
        const where: {
          isPublished: boolean;
          category?: { slug: string };
        } = {
          isPublished: true,
        };

        if (categorySlug) {
          where.category = { slug: categorySlug };
        }

        return prisma.app.findMany({
          where,
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            iconUrl: true,
            screenshots: true,
            externalLink: true,
            accentColor: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });
      },
      300 // 5 minute cache
    );

    return successResponse(apps);
  } catch (error) {
    console.error('Error fetching apps:', error);
    return errorResponse('Failed to fetch apps', 500);
  }
}
