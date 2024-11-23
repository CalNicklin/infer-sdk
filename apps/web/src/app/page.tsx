"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PricingPage from "./pricing/page";
import HomePage from "./home/page";
import FeaturesPage from "./features/page";
import { usePathname } from "next/navigation";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const activeSection = pathname === "/" ? "home" : pathname.slice(1);

  const renderContent = () => {
    let content;

    switch (activeSection) {
      case "features":
        content = <FeaturesPage />;
        break;
      case "pricing":
        content = <PricingPage />;
        break;
      case "home":
        content = <HomePage />;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        className="text-center space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={springTransition}
      >
        <div
          className={`mx-auto ${activeSection !== "home" ? "max-w-7xl" : ""}`}
        >
          {content}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[calc(100vh-72px)] bg-transparent text-white"
    >
      <div
        className={`w-full ${
          activeSection === "home" ? "h-full" : "min-h-full"
        }`}
      >
        <div className="w-full py-8">
          <AnimatePresence mode="wait">
            <div key={activeSection} className="w-full">
              {renderContent()}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
