import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { env } from "@/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SubscriptionData = {
  plan: {
    name: string;
    amount: number;
    freeTierLimit: number;
    costPerToken: number;
  };
  currentPeriod: {
    start: Date;
    end: Date;
  };
  currentBill: {
    amount: number;
    date: Date;
    breakdown?: {
      units: number;
      cost: number;
      isFree: boolean;
    }[];
  };
  status: string;
  id: string;
  items: Stripe.SubscriptionItem[];
  currentUsage: number;
  freeUnitsRemaining?: number;
};

export async function getSubscription(): Promise<SubscriptionData | null> {
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

    // Get subscription with expanded price data
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      expand: ['data.items.data.price'],
    });

    if (!subscriptions.data.length) {
      return null;
    }

    const subscription = subscriptions.data[0];
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const subscriptionItem = subscription.items.data[0];

    const price = await stripe.prices.retrieve(subscriptionItem.price.id, {
      expand: ['tiers']
    });

    const meterId = price.recurring?.meter;

    // Get current usage from meter
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

        if (summary.data.length > 0) {
          currentUsage = summary.data[0].aggregated_value;
        }
      } catch (error) {
        console.error('Error fetching meter summary:', error);
        currentUsage = 0;
      }
    }

    // Use subscription quantity as fallback
    currentUsage = currentUsage || subscriptionItem.quantity || 0;

    // Calculate free tier limit from the first tier
    const FREE_TIER_LIMIT = price.tiers?.[0]?.up_to || 0;

    // Calculate billing breakdown based on tiers
    const billBreakdown: { units: number; cost: number; isFree: boolean }[] = [];

    if (price.tiers?.length) {
      let remainingUnits = currentUsage;

      for (const tier of price.tiers) {
        const tierMax = tier.up_to === null ? remainingUnits : tier.up_to;
        const tierUnits = Math.min(remainingUnits, tierMax - (tier.flat_amount ? 0 : tierMax));

        if (tierUnits > 0) {
          const tierCost = tier.flat_amount
            ? tier.flat_amount / 100
            : (tierUnits * (tier.unit_amount || 0)) / 100;

          billBreakdown.push({
            units: tierUnits,
            cost: tierCost,
            isFree: tier.unit_amount === 0 || tier.flat_amount === 0,
          });

          remainingUnits -= tierUnits;
        }

        if (remainingUnits <= 0) break;
      }
    }

    // Calculate remaining free units if first tier is free
    const freeTier = price.tiers?.[0];
    const freeUnitsRemaining = freeTier && freeTier.unit_amount === 0
      ? Math.max(0, freeTier.up_to! - currentUsage)
      : undefined;

    return {
      plan: {
        name: price.nickname || "Pro",
        amount: price.unit_amount_decimal
          ? parseFloat(price.unit_amount_decimal)
          : 0,
        freeTierLimit: FREE_TIER_LIMIT,
        costPerToken: (price.unit_amount || 0) / 100000,
      },
      currentPeriod: {
        start: new Date(subscription.current_period_start * 1000),
        end: new Date(subscription.current_period_end * 1000),
      },
      currentBill: {
        amount: invoice.amount_due / 100,
        date: new Date(invoice.created * 1000),
        breakdown: billBreakdown,
      },
      status: subscription.status,
      id: subscription.id,
      items: subscription.items.data,
      currentUsage,
      freeUnitsRemaining,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}