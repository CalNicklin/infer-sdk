import Stripe from 'stripe'
import { Context } from 'hono'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function usageMiddleware(c: Context, next: () => Promise<void>) {
  const start = Date.now()
  
  await next()
  
  const duration = Date.now() - start
  const ownerId = c.get('ownerId')
  
  // Record usage to Stripe
  await stripe.subscriptionItems.createUsageRecord(
    process.env.STRIPE_SUBSCRIPTION_ITEM_ID!,
    {
      quantity: 1, // Each API call counts as 1 unit
      timestamp: 'now',
      action: 'increment',
      customerId: ownerId
    }
  )
}
