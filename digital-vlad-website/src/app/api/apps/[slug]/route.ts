import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getOrSet, CACHE_KEYS } from '@/lib/cache';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/apps/[slug] - Get single app by slug (public, cached)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const cacheKey = `${CACHE_KEYS.APP_DETAIL}:${slug}`;

    const app = await getOrSet(
      cacheKey,
      async () => {
        return prisma.app.findFirst({
          where: {
            slug,
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            iconUrl: true,
            screenshots: true,
            externalLink: true,
            accentColor: true,
            createdAt: true,
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

    if (!app) {
      return errorResponse('App not found', 404);
    }

    return successResponse(app);
  } catch (error) {
    console.error('Error fetching app:', error);
    return errorResponse('Failed to fetch app', 500);
  }
}
