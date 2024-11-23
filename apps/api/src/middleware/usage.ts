import Stripe from 'stripe'
import { Context } from 'hono'
import { encoding_for_model } from 'tiktoken'
import { env } from '../env'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

interface SDKRequest {
  inputs: string
  parameters: {
    candidate_labels: string
  }
}

export async function usageMiddleware(c: Context, next: () => Promise<void>) {
  const startTime = Date.now()
  const encoder = encoding_for_model('gpt-3.5-turbo')
  const stripeCustomerId = c.get('stripeCustomerId')

  try {
    const sdkBody = await c.req.json() as SDKRequest
    const inputTokens = encoder.encode(sdkBody.inputs).length
    const labelsTokens = encoder.encode(sdkBody.parameters.candidate_labels).length

    await next()

    const response = c.res as Response
    const responseData = await response.clone().json()
    const outputTokens = response.ok && responseData.data?.labels ?
      responseData.data.labels.reduce((acc: number, label: string) =>
        acc + encoder.encode(label).length, 0
      ) : 0

    const totalTokens = inputTokens + labelsTokens + outputTokens
    const metadata = {
      latency: Date.now() - startTime,
      input_tokens: inputTokens,
      labels_tokens: labelsTokens,
      output_tokens: outputTokens
    }

    // Record total usage
    await stripe.billing.meterEvents.create({
      event_name: 'infer-paid-tier',
      payload: {
        stripe_customer_id: stripeCustomerId,
        value: totalTokens,
        metadata: JSON.stringify(metadata)
      },
      timestamp: Math.floor(Date.now() / 1000)
    })

  } catch (error) {
    console.error('Error in usage middleware:', error)
    throw error
  } finally {
    encoder.free()
  }
}
