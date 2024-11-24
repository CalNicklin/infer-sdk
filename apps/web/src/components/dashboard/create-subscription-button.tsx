"use client";

import { createSubscription } from "@/app/actions/create-subscription";
import { useState } from "react";

export function CreateSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubscribe() {
    try {
      setIsLoading(true);
      const result = await createSubscription();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="bg-white/10 text-white/80 hover:bg-white/20 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
    >
      {isLoading ? "Redirecting to Checkout..." : "Subscribe"}
    </button>
  );
}
