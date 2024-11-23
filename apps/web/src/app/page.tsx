"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import PricingPage from "./pricing/page";

export default function Home() {
  const { isSignedIn } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const containerRef = useRef<HTMLDivElement>(null);

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="text-center space-y-6 sm:space-y-8 relative z-10">
            <motion.h1
              className="text-4xl sm:text-7xl font-medium tracking-tighter text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              infer
            </motion.h1>
            <motion.p
              className="text-xl sm:text-2xl text-white/60 font-light tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Fast ML inference for serverless environments
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                className="bg-white/10 text-white/90 hover:bg-white/20 transition-colors font-normal"
                onClick={() => setActiveSection("docs")}
              >
                Get started
              </Button>
            </motion.div>
          </div>
        );
      case "features":
        return (
          <div className="text-center space-y-8 relative z-10">
            <h2 className="text-5xl font-bold mb-6">Features</h2>
            <ul className="grid grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              {[
                "Sub-250ms Cold Start",
                "Zero-shot Classification",
                "Full TypeScript Support",
                "Intelligent Error Handling",
                "Seamless ESM Integration",
                "Cost-Effective Scaling",
                "Request Latency Tracking",
                "Real-time API usage metrics",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        );
      case "pricing":
        return (
          <div className="text-center space-y-8 relative z-10">
            <div className="max-w-7xl mx-auto">
              <PricingPage />
            </div>
          </div>
        );
      case "docs":
        return (
          <div className="text-center space-y-8 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-5xl font-bold mb-6">Documentation</h2>
            <div className="bg-white/10 p-6 rounded-lg text-left">
              <pre className="text-sm overflow-x-auto">
                <code>{`
import Infer from 'infer-sdk';

const infer = new Infer({ apiKey: 'your-api-key' });

const result = await infer.zeroShot.classify(
  "I love this product!",
  ['positive', 'negative']
);

console.log(result);
                `}</code>
              </pre>
            </div>
            <p className="text-white/80">
              Check our full documentation for more details on installation, API
              reference, and advanced usage.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-screen overflow-hidden bg-transparent text-white"
    >
      <motion.div
        className="h-full w-full relative"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "right top",
        }}
      >
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full px-4 sm:px-6 py-4 z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              href="/"
              className="text-2xl font-medium tracking-tight text-white/90"
            >
              infer
            </Link>

            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4">
              {[
                { name: "Home", section: "home" },
                { name: "Features", section: "features" },
                { name: "Pricing", section: "pricing" },
                { name: "Docs", section: "docs" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.section)}
                  className={`
                    px-3 py-2 text-sm transition-colors font-sans
                    ${
                      activeSection === item.section
                        ? "text-white font-medium"
                        : "text-white/60 hover:text-white/80 font-normal"
                    }
                  `}
                >
                  {item.name}
                </button>
              ))}

              <div className="h-4 w-px bg-white/20 mx-2 hidden sm:block" />

              {isSignedIn ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-white/70 hover:text-white/90 transition-colors font-normal"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-4">
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      className="text-white/70 hover:text-white/90 font-normal"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      variant="ghost"
                      className="text-white/70 hover:text-white/90 font-normal"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 pt-24">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
        </main>
      </motion.div>
    </div>
  );
}
