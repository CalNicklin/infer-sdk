import { getSubscription } from "@/app/actions/get-subscription";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { CreditCard } from "lucide-react";
import { formatDate } from "@/lib/server/utils";

export default async function Billing() {
  const subscription = await getSubscription();

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
        <div className="p-4 bg-white/5 rounded-md border border-white/10">
          <h3 className="font-semibold mb-2 text-white/80">Current Bill</h3>
          <p className="text-2xl font-bold text-white/80">
            ${String(subscription.currentBill.amount)}
          </p>
          <p className="text-sm text-white/60">
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
