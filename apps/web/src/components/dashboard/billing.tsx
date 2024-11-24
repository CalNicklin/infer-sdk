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
import { CreditCard, Activity, DollarSign, Hash } from "lucide-react";
import { formatDate } from "@/lib/server/utils";

export default async function Billing() {
  const subscription = await getSubscription();
  const usage = await getApiUsage();

  // Calculate current period usage
  const currentPeriodRequests = usage.reduce(
    (acc, day) => acc + day.requests,
    0
  );
  const currentPeriodTokens = subscription?.currentBill?.amount ?? 0;
  console.log(subscription);
  const costPerToken = 0.0001; // $0.0001 per token
  const currentCost = (currentPeriodTokens * costPerToken).toFixed(2);

  if (!subscription) {
    return (
      <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white/80">Billing Information</CardTitle>
          <CardDescription className="text-white/60">
            Start your subscription to access the API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/60">No active subscription found.</p>
        </CardContent>
        <CardFooter>
          <Button className="bg-white/10 text-white/80 hover:bg-white/20">
            Subscribe Now
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
              Current Plan: {subscription.plan.name}
            </span>
          </div>
          <span className="text-white/80 font-bold">
            ${subscription.plan.amount}/{subscription.plan.interval}
          </span>
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
              <h3 className="font-semibold text-white/80">Tokens Used</h3>
            </div>
            <p className="text-2xl font-bold text-white/80">
              {currentPeriodTokens.toLocaleString()}
            </p>
            <p className="text-sm text-white/60">
              ${costPerToken.toFixed(6)} per token
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-md border border-white/10">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 mr-2 text-white/70" />
              <h3 className="font-semibold text-white/80">Usage Cost</h3>
            </div>
            <p className="text-2xl font-bold text-white/80">${currentCost}</p>
            <p className="text-sm text-white/60">Based on token usage</p>
          </div>
        </div>

        {/* Total Bill */}
        <div className="p-4 bg-white/5 rounded-md border border-white/10">
          <h3 className="font-semibold mb-2 text-white/80">Total Bill</h3>
          <p className="text-2xl font-bold text-white/80">
            $
            {(
              Number(subscription.currentBill.amount) + Number(currentCost)
            ).toFixed(2)}
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm text-white/60">
              <span>Base Plan</span>
              <span>${subscription.currentBill.amount}</span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>
                Token Usage ({currentPeriodTokens.toLocaleString()} tokens)
              </span>
              <span>${currentCost}</span>
            </div>
          </div>
          <p className="text-sm text-white/60 mt-4">
            Next billing date: {formatDate(subscription.currentPeriod.end)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-white/10 text-white/80 hover:bg-white/20">
          Manage Subscription
        </Button>
      </CardFooter>
    </Card>
  );
}