import Redis from "ioredis"

const globalForRedis = global as unknown as { redisClient: Redis }

export const redis = globalForRedis.redisClient ?? new Redis(process.env.REDIS_URL as string)

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redis
}

export default redis
