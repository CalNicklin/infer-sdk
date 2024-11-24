import { Ratelimit } from "@unkey/ratelimit"
import { Context } from 'hono'
import { env } from '../env'

const ratelimit = new Ratelimit({
  rootKey: env.UNKEY_TOKEN!,
  namespace: "api-requests",
  limit: 150, // Adjust this number based on your needs
  duration: "1m", // 1 minute window
  timeout: {
    ms: 3000, // 3 second timeout
    fallback: (identifier) => ({
      success: false,
      limit: 150,
      remaining: 0,
      reset: Date.now() + 60000
    })
  },
  onError: (err, identifier) => {
    console.error(`Rate limit error for ${identifier}:`, err)
    return {
      success: false,
      limit: 100,
      remaining: 0,
      reset: Date.now() + 60000
    }
  }
})

export async function ratelimitMiddleware(c: Context, next: () => Promise<void>) {
  const ownerId = c.get('ownerId')

  if (!ownerId) {
    return c.json({ error: 'Missing owner ID' }, 401)
  }

  const { success, remaining, reset } = await ratelimit.limit(ownerId)

  if (!success) {
    return c.json({
      error: 'Rate limit exceeded',
      remaining,
      reset: new Date(reset).toISOString()
    }, 429)
  }

  await next()
}
