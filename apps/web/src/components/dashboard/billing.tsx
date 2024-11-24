import { getSubscription } from "@/app/actions/get-subscription";
import { getApiUsage } from "@/app/actions/get-api-usage";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { CreditCard, Activity, PoundSterling, Hash, Gift } from "lucide-react";
import { formatDate } from "@/lib/server/utils";
import { CancelSubscriptionButton } from "./cancel-subscription-button";

const safeNumber = (value: string | number): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export default async function Billing() {
  const subscription = await getSubscription();
  const usage = await getApiUsage();

  const currentPeriodRequests =
    usage?.reduce((acc, day) => acc + safeNumber(day.requests), 0) ?? 0;

  const currentPeriodTokens = safeNumber(subscription?.currentUsage ?? 0);
  const freeUnitsRemaining = subscription?.freeUnitsRemaining ?? 0;
  const FREE_TIER_LIMIT = subscription?.plan?.freeTierLimit ?? 0;
  const COST_PER_TOKEN = subscription?.plan?.costPerToken ?? 0;
  
  // Calculate billable tokens (only tokens above free tier)
  const billableTokens = Math.max(0, currentPeriodTokens - FREE_TIER_LIMIT);
  const currentCost = (billableTokens * COST_PER_TOKEN).toFixed(3);
  const basePlanAmount = safeNumber(subscription?.plan?.amount ?? 0).toFixed(3);
  const totalBill = (
    safeNumber(basePlanAmount) / 100 +
    safeNumber(currentCost)
  ).toFixed(3);

  if (!subscription) {
    return (
      <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white/80">Subscription Status</CardTitle>
          <CardDescription className="text-white/60">
            Your subscription is being processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center p-4 bg-white/5 rounded-md border border-white/10">
            <CreditCard className="h-6 w-6 mr-2 text-white/70" />
            <div>
              <p className="text-white/80">Subscription Pending</p>
              <p className="text-sm text-white/60">
                Your subscription is being set up. This may take a few moments.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="bg-white/10 text-white/80 hover:bg-white/20"
            onClick={() => window.location.reload()}
          >
            Refresh Status
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white/80">Billing Information</CardTitle>
        <CardDescription className="text-white/60">
          Manage your billing and view current charges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-md border border-white/10">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-white/70" />
            <span className="text-white/80">
              Current Plan: {subscription.plan?.name ?? "Free"}
            </span>
          </div>
        </div>

        {/* Free Tier Status */}
        <div className="p-4 bg-white/5 rounded-md border border-white/10">
          <div className="flex items-center mb-2">
            <Gift className="h-5 w-5 mr-2 text-white/70" />
            <h3 className="font-semibold text-white/80">Free Tier Status</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white/60">
              {freeUnitsRemaining > 0 
                ? `${freeUnitsRemaining.toLocaleString()} free tokens remaining`
                : 'Free tier limit reached'}
            </p>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-white/40 h-2 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(100, (currentPeriodTokens / FREE_TIER_LIMIT) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-white/40">
              {currentPeriodTokens.toLocaleString()} / {FREE_TIER_LIMIT.toLocaleString()} tokens used
            </p>
          </div>
        </div>

        {/* Current Period Usage */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-md border border-white/10">
            <div className="flex items-center mb-2">
              <Activity className="h-5 w-5 mr-2 text-white/70" />
              <h3 className="font-semibold text-white/80">API Requests</h3>
            </div>
            <p className="text-2xl font-bold text-white/80">
              {currentPeriodRequests.toLocaleString()}
            </p>
            <p className="text-sm text-white/60">Total requests this period</p>
          </div>

          <div className="p-4 bg-white/5 rounded-md border border-white/10">
            <div className="flex items-center mb-2">
              <Hash className="h-5 w-5 mr-2 text-white/70" />
              <h3 className="font-semibold text-white/80">Billable Tokens</h3>
            </div>
            <p className="text-2xl font-bold text-white/80">
              {billableTokens.toLocaleString()}
            </p>
            <p className="text-sm text-white/60">
              £{COST_PER_TOKEN.toFixed(5)} per token
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-md border border-white/10">
            <div className="flex items-center mb-2">
              <PoundSterling className="h-5 w-5 mr-2 text-white/70" />
              <h3 className="font-semibold text-white/80">Usage Cost</h3>
            </div>
            <p className="text-2xl font-bold text-white/80">£{currentCost}</p>
            <p className="text-sm text-white/60">Based on billable tokens</p>
          </div>
        </div>

        {/* Total Bill */}
        <div className="p-4 bg-white/5 rounded-md border border-white/10">
          <h3 className="font-semibold mb-2 text-white/80">Total Bill</h3>
          <p className="text-2xl font-bold text-white/80">£{totalBill}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm text-white/60">
              <span>Free Tier Usage</span>
              <span>{Math.min(currentPeriodTokens, FREE_TIER_LIMIT).toLocaleString()} tokens</span>
            </div>
            {billableTokens > 0 && (
              <div className="flex justify-between text-sm text-white/60">
                <span>Billable Usage</span>
                <span>{billableTokens.toLocaleString()} tokens (£{currentCost})</span>
              </div>
            )}
          </div>
          <p className="text-sm text-white/60 mt-4">
            Next billing date: {formatDate(subscription.currentPeriod?.end ?? new Date())}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <CancelSubscriptionButton />
      </CardFooter>
    </Card>
  );
}