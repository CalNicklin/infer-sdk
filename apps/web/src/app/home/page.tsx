"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      className="text-center space-y-8 relative z-10 max-w-2xl mx-auto justify-start"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={springTransition}
    >
      <motion.p
        className="text-xl sm:text-2xl text-white/80 font-semibold tracking-tight"
        variants={fadeInVariants}
      >
        Fast ML inference for serverless environments
      </motion.p>
      <motion.div
        className="bg-white/10 p-6 rounded-lg text-left"
        variants={fadeInVariants}
      >
        <pre className="text-sm overflow-x-auto">
          <code>{`
import Infer from 'infer-sdk';

const infer = new Infer({ apiKey: 'your-api-key' });

const result = await infer.zeroShot.classify({
  text: "I love this product!",
  labels: ["positive", "negative"],
});

console.log(result);
`}</code>
        </pre>
      </motion.div>
      <motion.div variants={fadeInVariants}>
        <Button
          className="bg-white/10 text-white/80 hover:bg-white/20 transition-colors font-normal"
          onClick={() => router.push("/docs")}
        >
          Get started
        </Button>
      </motion.div>
      <motion.p className="text-white/80" variants={fadeInVariants}>
        Check our full documentation for more details on installation, API
        reference, and advanced usage.
      </motion.p>
    </motion.div>
  );
}
