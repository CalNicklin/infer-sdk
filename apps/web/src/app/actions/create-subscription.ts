'use server'

import { env } from '@/env'
import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export async function createSubscription(): Promise<{ url: string | null }> {
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

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
        },
      ],
      mode: 'subscription',
      success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    })

    return { url: session.url }
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create subscription')
  }
}
