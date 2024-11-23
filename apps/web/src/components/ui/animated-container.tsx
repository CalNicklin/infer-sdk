"use client";

import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function AnimatedContainer({ children }: PropsWithChildren) {
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
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={springTransition}
    >
      {children}
    </motion.div>
  );
}
