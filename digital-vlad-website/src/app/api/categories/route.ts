import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { getOrSet, CACHE_KEYS } from '@/lib/cache';

// GET /api/categories - List categories with app counts (public, cached)
export async function GET() {
  try {
    const cacheKey = CACHE_KEYS.CATEGORIES_LIST;

    const categories = await getOrSet(
      cacheKey,
      async () => {
        return prisma.category.findMany({
          orderBy: { position: 'asc' },
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            _count: {
              select: {
                apps: {
                  where: { isPublished: true },
                },
              },
            },
          },
        });
      },
      300 // 5 minute cache
    );

    // Transform to include appCount
    const categoriesWithCount = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      appCount: cat._count.apps,
    }));

    return successResponse(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse('Failed to fetch categories', 500);
  }
}
