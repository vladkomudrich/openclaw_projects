import redis from './redis';

// Cache key prefixes
export const CACHE_KEYS = {
  APPS_LIST: 'apps:list',
  APP_DETAIL: 'apps:detail',
  CATEGORIES_LIST: 'categories:list',
} as const;

// Default TTL in seconds (5 minutes)
const DEFAULT_TTL = 300;

/**
 * Get cached data or fetch from source
 */
export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Cache error, falling back to direct fetch:', error);
    return fetcher();
  }
}

/**
 * Set cache value
 */
export async function set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Get cache value
 */
export async function get<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Delete cache by key
 */
export async function del(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

/**
 * Delete cache by pattern (e.g., "apps:*")
 */
export async function delPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Cache delete pattern error:', error);
  }
}

/**
 * Invalidate all app-related cache
 */
export async function invalidateAppCache(): Promise<void> {
  await delPattern(`${CACHE_KEYS.APPS_LIST}*`);
  await delPattern(`${CACHE_KEYS.APP_DETAIL}*`);
}

/**
 * Invalidate all category-related cache
 */
export async function invalidateCategoryCache(): Promise<void> {
  await delPattern(`${CACHE_KEYS.CATEGORIES_LIST}*`);
  // Also invalidate app cache since apps include category info
  await invalidateAppCache();
}
