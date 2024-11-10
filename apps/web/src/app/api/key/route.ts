import { auth } from '@clerk/nextjs/server'
import { Unkey } from '@unkey/api'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const unkey = new Unkey({ token: process.env.UNKEY_TOKEN! })

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      metadata: {
        userId
      }
    })

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: process.env.STRIPE_PRICE_ID!
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    })

    // Generate API key with Unkey
    const { result: key } = await unkey.keys.create({
      apiId: process.env.UNKEY_API_ID!,
      prefix: 'infer',
      ownerId: userId,
      meta: {
        stripeCustomerId: customer.id
      }
    })

    return NextResponse.json({ 
      key: key?.key,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate key' }, 
      { status: 500 }
    )
  }
}
