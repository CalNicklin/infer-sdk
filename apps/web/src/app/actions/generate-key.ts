'use server'

import { env } from '@/env'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Unkey } from '@unkey/api'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)
const unkey = new Unkey({ token: env.UNKEY_TOKEN })

export async function generateApiKey() {

  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const user = await currentUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: user.primaryEmailAddress?.emailAddress,
      limit: 1,
    })

    const customer = customers.data[0] ?? await stripe.customers.create({
      metadata: { userId },
      email: user.primaryEmailAddress?.emailAddress,
      name: user.firstName + ' ' + user.lastName
    })

    // Check for existing subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
    })

    const subscription = subscriptions.data[0] ?? await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: env.STRIPE_PRICE_ID }],
      payment_behavior: 'default_incomplete',
      expand: ['pending_setup_intent'],
    })

    // Generate API key with Unkey
    const { result: key } = await unkey.keys.create({
      apiId: env.UNKEY_API_ID,
      prefix: 'infer',
      ownerId: userId,
      meta: { stripeCustomerId: customer.id }
    })

    return { key: key?.key, subscriptionId: subscription.id }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to generate key')
  }
}
