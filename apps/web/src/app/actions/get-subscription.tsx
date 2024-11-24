import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { env } from "@/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function getSubscription() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Find customer by userId in metadata
    const customers = await stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
    });

    if (!customers.data.length) {
      return null;
    }

    const customer = customers.data[0];

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
    });

    if (!subscriptions.data.length) {
      return null;
    }

    const subscription = subscriptions.data[0];
    const invoice = subscription.latest_invoice as Stripe.Invoice;

    return {
      plan: {
        name: subscription.items.data[0].plan.nickname || "Pro",
        amount: subscription.items.data[0].plan.amount
          ? subscription.items.data[0].plan.amount / 100
          : "Free",
        interval: subscription.items.data[0].plan.interval || "month",
      },
      currentPeriod: {
        start: new Date(subscription.current_period_start * 1000),
        end: new Date(subscription.current_period_end * 1000),
      },
      currentBill: {
        amount: invoice.amount_due / 100,
        date: new Date(invoice.created * 1000),
      },
      status: subscription.status,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}
