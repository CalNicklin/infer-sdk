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

    const customers = await stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
    });

    if (!customers.data.length) {
      return null;
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      expand: ['data.items.data.price'],
    });

    if (!subscriptions.data.length) {
      return null;
    }

    const subscription = subscriptions.data[0];
    const invoice = subscription.latest_invoice as Stripe.Invoice;

    // Get the subscription item and its price
    const subscriptionItem = subscription.items.data[0];
    const meterId = subscriptionItem.price.recurring?.meter;

    let currentUsage = 0;
    if (meterId) {
      const now = Math.floor(Date.now() / 1000);
      const startOfPeriod = subscription.current_period_start;

      try {
        const summary = await stripe.billing.meters.listEventSummaries(meterId, {
          customer: customer.id,
          start_time: startOfPeriod,
          end_time: now,
        });

        // Check if we have any data
        if (summary.data.length > 0) {
          currentUsage = summary.data[0].aggregated_value;
        }
      } catch (error) {
        console.error('Error fetching meter summary:', error);
        currentUsage = 0;
      }
    }

    // Add quantity from subscription item as fallback
    const subscriptionQuantity = subscriptionItem.quantity || 0;

    return {
      plan: {
        name: subscriptionItem.price.nickname || "Pro",
        amount: subscriptionItem.price.unit_amount_decimal
          ? parseFloat(subscriptionItem.price.unit_amount_decimal)
          : 0,
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
      id: subscription.id,
      items: subscription.items,
      currentUsage: currentUsage || subscriptionQuantity, // Use quantity as fallback
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}
