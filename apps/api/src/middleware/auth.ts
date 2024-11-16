import { Unkey } from '@unkey/api'
import { Context } from 'hono'

const unkey = new Unkey({ token: process.env.UNKEY_TOKEN! })

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!apiKey) {
    return c.json({ error: 'Missing API key' }, 401)
  }

  const { result, error } = await unkey.keys.verify({ key: apiKey })
  
  if (error || !result.valid) {
    return c.json({ error: 'Invalid API key' }, 401)
  }

  // Attach key metadata to context for usage tracking
  c.set('keyId', result.keyId)
  c.set('ownerId', result.ownerId)
  c.set('stripeCustomerId', result.meta?.stripeCustomerId)
  
  await next()
}
