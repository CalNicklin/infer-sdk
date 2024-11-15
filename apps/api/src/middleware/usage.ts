import Stripe from 'stripe'
import { Context } from 'hono'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function usageMiddleware(c: Context, next: () => Promise<void>) {

  const inputTokens = c.get('inputTokens')
  const outputTokens = c.get('outputTokens')
  const totalTokens = inputTokens + outputTokens

  await next()

  try {
    await stripe.billing.meterEvents.create({
      event_name: 'infer-api',
      payload: {
        stripe_customer_id: c.get('ownerId'),
        value: totalTokens
      },
      timestamp: Math.floor(Date.now() / 1000)
    })
  } catch (error) {
    console.error('Failed to record token usage:', error)
  }
}
