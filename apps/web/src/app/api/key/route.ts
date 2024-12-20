import { auth, currentUser } from '@clerk/nextjs/server'
import { Unkey } from '@unkey/api'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const unkey = new Unkey({ token: process.env.UNKEY_TOKEN! })

  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: user.primaryEmailAddress?.emailAddress,
      limit: 1,
    })

    let customer
    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      // Create new Stripe customer if none exists
      customer = await stripe.customers.create({
        metadata: {
          userId
        },
        email: user.primaryEmailAddress?.emailAddress,
        name: user.firstName + ' ' + user.lastName
      })
    }

    // Check for existing subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
    })

    let subscription
    if (subscriptions.data.length > 0) {
      subscription = subscriptions.data[0]
    } else {
      // Create new subscription if none exists
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID!,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['pending_setup_intent'],
      })
    }

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
      subscriptionId: subscription.id
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate key' },
      { status: 500 }
    )
  }
}
