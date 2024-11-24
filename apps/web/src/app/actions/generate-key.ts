'use server'

import { env } from '@/env'
import { auth } from '@clerk/nextjs/server'
import { Unkey } from '@unkey/api'
import { getSubscription } from './get-subscription'

const unkey = new Unkey({ token: env.UNKEY_TOKEN })

export async function generateApiKey() {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    // Verify active subscription
    const subscription = await getSubscription()
    if (!subscription || subscription.status !== 'active') {
      throw new Error('Active subscription required')
    }

    // Generate API key with Unkey
    const { result: key } = await unkey.keys.create({
      apiId: env.UNKEY_API_ID,
      prefix: 'infer',
      ownerId: userId,
      meta: { subscriptionId: subscription.id }
    })

    return { key: key?.key }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to generate key')
  }
}
