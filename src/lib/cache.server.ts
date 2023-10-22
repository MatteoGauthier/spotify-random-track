import redis from "@/lib/redis.server"

type WithCacheProps = {
  key: string
  ttl: number
  debug?: boolean
}

type WithCacheReturn<T> = Promise<{
  data: T
  cacheStatus: "HIT" | "MISS"
}>

export const defaultWithCacheTTL = 60 * 60 * 2 // 2 hours

export async function withCache<T>(
  fn: () => Promise<T> | T,
  { key, ttl = defaultWithCacheTTL, debug = false }: WithCacheProps
): WithCacheReturn<T> {
  if (debug) console.log(`[withCache]: ${key}`, "Get key...")
  const cached = (await redis.call("JSON.GET", key, "$")) as string
  if (debug) console.log(`[withCache]: ${key}`, "Get key success")

  if (cached) {
    try {
      if (debug) console.log(`[withCache]: ${key}`, "Parse key...")
      const parsedCached = JSON.parse(cached)
      if (debug) console.log(`[withCache]: ${key}`, "Parse key success")
      if (parsedCached && parsedCached.length > 0) {
        return {
          data: parsedCached[0],
          cacheStatus: "HIT",
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  if (debug) console.log(`[withCache]: ${key}`, "Calling function...")
  const data = await fn()
  if (debug) console.log(`[withCache]: ${key}`, "Calling function success")

  if (debug) console.log(`[withCache]: ${key}`, "Set key...")
  await redis.call("JSON.SET", key, "$", JSON.stringify(data))
  await redis.call("EXPIRE", key, ttl)
  if (debug) console.log(`[withCache]: ${key}`, "Set key success")

  return {
    data,
    cacheStatus: "MISS",
  }
}
