import Stripe from 'stripe'
import { Context } from 'hono'
import { encode } from 'gpt-tokenizer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function usageMiddleware(c: Context, next: () => Promise<void>) {
  const startTime = Date.now()

  const body = await c.req.json() as {
    sequence: string
    labels: string[]
  }

  const inputTokens = encode(body.sequence).length
  const labelsTokens = body.labels.reduce((acc, label) =>
    acc + encode(label).length, 0
  )

  c.set('inputTokens', inputTokens + labelsTokens)

  await next()

  const response = c.res as Response
  const responseData = await response.clone().json()

  const outputTokens = response.ok ?
    responseData.labels.reduce((acc: number, label: string) =>
      acc + encode(label).length, 0
    ) : 0

  const totalTokens = inputTokens + labelsTokens + outputTokens

  try {
    await stripe.billing.meterEvents.create({
      event_name: 'infer-api',
      payload: {
        stripe_customer_id: c.get('stripeCustomerId'),
        value: totalTokens,
        metadata: `${JSON.stringify({
          latency: Date.now() - startTime,
          input_tokens: inputTokens,
          labels_tokens: labelsTokens,
          output_tokens: outputTokens
        })}`
      },
      timestamp: Math.floor(Date.now() / 1000)
    })
  } catch (error) {
    console.error('Failed to record token usage:', error)
  }
}
