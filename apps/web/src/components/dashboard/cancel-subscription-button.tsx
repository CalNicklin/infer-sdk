"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { cancelSubscription } from "@/app/actions/cancel-subscription";

export function CancelSubscriptionButton() {
  const [isCanceling, setIsCanceling] = useState(false);

  async function handleCancelSubscription() {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }

    setIsCanceling(true);
    try {
      const result = await cancelSubscription();
      if (result.success) {
        window.location.reload();
      } else {
        alert("Failed to cancel subscription. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while canceling your subscription.");
    } finally {
      setIsCanceling(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleCancelSubscription}
      disabled={isCanceling}
      className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
    >
      {isCanceling ? "Canceling..." : "Cancel Subscription"}
    </Button>
  );
}
