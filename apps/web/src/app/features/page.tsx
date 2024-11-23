"use client";

import { motion } from "framer-motion";

export default function FeaturesPage() {
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
      className="text-center space-y-12 relative z-10 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={springTransition}
    >
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-8"
        variants={fadeInVariants}
      >
        {[
          {
            title: "Sub-250ms Cold Start",
            description:
              "Lightning-fast initialization for immediate responsiveness.",
          },
          {
            title: "Zero-shot Classification",
            description:
              "Classify text without prior training on specific categories.",
          },
          {
            title: "Full TypeScript Support",
            description: "Enjoy type safety and improved developer experience.",
          },
          {
            title: "Intelligent Error Handling",
            description: "Robust error management for reliable operations.",
          },
          {
            title: "Seamless ESM Integration",
            description: "Easy integration with ECMAScript modules.",
          },
          {
            title: "Cost-Effective Scaling",
            description: "Optimize resources and reduce operational costs.",
          },
          {
            title: "Request Latency Tracking",
            description:
              "Monitor and analyze request performance in real-time.",
          },
          {
            title: "Real-time API Usage Metrics",
            description: "Gain insights into your API usage patterns.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white/5 p-6 rounded-lg text-left text-white"
            variants={fadeInVariants}
          >
            <h3 className="text-xl font-semibold mb-2 text-white/90">
              {feature.title}
            </h3>
            <p className="text-white/70">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
