"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SignUpButton } from "@clerk/nextjs";

export default function PricingPage() {
  const [tokens, setTokens] = useState(10000);

  const calculatePrice = (tokenCount: number) => {
    if (tokenCount <= 10000) return 0;
    const paidTokens = tokenCount - 10000;
    return (Math.ceil(paidTokens / 1000) * 0.001).toFixed(2);
  };

  const price = calculatePrice(tokens);

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-transparent text-white font-light p-4 sm:p-8 flex flex-col justify-start"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={springTransition}
      >
        <main className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white/5 p-6 rounded-lg"
              variants={fadeInVariants}
              transition={springTransition}
            >
              <h2 className="text-2xl mb-4">Free Tier</h2>
              <ul className="space-y-2 mb-6 text-sm">
                <li>10,000 tokens free per month</li>
                <li>Ideal for testing and small projects</li>
                <li>~25 requests of 400 tokens each</li>
              </ul>
              <SignUpButton mode="modal">
                <Button className="bg-white/10 text-white hover:bg-white/20 transition-colors w-full">
                  Get Started
                </Button>
              </SignUpButton>
            </motion.div>

            <motion.div
              className="bg-white/5 p-6 rounded-lg"
              variants={fadeInVariants}
              transition={springTransition}
            >
              <h2 className="text-2xl mb-4">Paid Tier</h2>
              <p className="mb-4 text-sm">
                $0.001 per 1000 tokens (after free tier)
              </p>
              <div className="space-y-6">
                <div>
                  <label htmlFor="token-slider" className="block mb-2 text-sm">
                    Estimate your usage:
                  </label>
                  <Slider
                    id="token-slider"
                    min={0}
                    max={1000000}
                    step={1000}
                    value={[tokens]}
                    onValueChange={(value) => setTokens(value[0])}
                    className="w-full"
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">
                    {tokens.toLocaleString()} tokens
                  </p>
                  <p className="text-lg">Estimated cost: ${price}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 text-center text-sm text-white/60 space-y-1"
            variants={fadeInVariants}
            transition={springTransition}
          >
            <p>
              1,000 tokens = $0.001 • 10,000 tokens = $0.01 • 100,000 tokens =
              $0.10 • 1,000,000 tokens = $1.00
            </p>
          </motion.div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}