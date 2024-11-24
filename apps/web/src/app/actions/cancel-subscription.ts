'use server'

import Stripe from "stripe";
import { env } from "@/env";
import { getSubscription } from "./get-subscription"

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function cancelSubscription() {
  try {
    const subscription = await getSubscription()

    if (!subscription) {
      throw new Error('No active subscription found')
    }

    await stripe.subscriptions.cancel(subscription.id)

    return { success: true }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return { success: false, error: 'Failed to cancel subscription' }
  }
}
