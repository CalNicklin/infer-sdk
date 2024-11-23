"use client";

import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import PricingPage from "./pricing/page";
import HomePage from "./home/page";
import FeaturesPage from "./features/page";
import DocsPage from "./docs/page";
import { usePathname } from "next/navigation";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
      case "docs":
        content = <DocsPage />;
        break;
      default:
        return null;
    }

    return (
      <div className={`mx-auto ${activeSection !== "home" ? "max-w-7xl" : ""}`}>
        {content}
      </div>
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
