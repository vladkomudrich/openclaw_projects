import Redis from 'ioredis';

declare global {
  var redis: Redis | undefined;
}

const getRedisClient = (): Redis => {
  if (globalThis.redis) {
    return globalThis.redis;
  }

  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  redis.on('connect', () => {
    console.log('Redis connected successfully');
  });

  if (process.env.NODE_ENV !== 'production') {
    globalThis.redis = redis;
  }

  return redis;
};

export const redis = getRedisClient();

export default redis;
