"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function Home() {
  const { isSignedIn } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const containerRef = useRef<HTMLDivElement>(null);

  const skewY = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newSkew =
        (scrollY / (document.body.offsetHeight - window.innerHeight)) * 15;
      skewY.set(newSkew);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [skewY]);

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="text-center space-y-8 relative z-10">
            <motion.h1
              className="text-7xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Infer
            </motion.h1>
            <motion.p
              className="text-2xl text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Redefining ML Inference
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                className="bg-white text-black hover:bg-white/90 transition-colors"
                onClick={() => setActiveSection("features")}
              >
                Explore
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
                "Serverless Architecture",
                "Sub-250ms Response Time",
                "Zero-shot Classification",
                "Full TypeScript Support",
                "Intelligent Error Handling",
                "Seamless ESM Integration",
                "Cost-Effective Scaling",
                "Automated Model Caching",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
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
      className="min-h-screen w-screen overflow-hidden bg-transparent text-white font-mono"
    >
      <motion.div
        className="h-full w-full relative"
        style={{
          skewY,
          transformStyle: "preserve-3d",
          transformOrigin: "right top",
        }}
      >
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Infer
          </Link>
          <div className="flex space-x-4">
            {["Home", "Features", "Docs"].map((item) => (
              <Button
                key={item}
                variant="ghost"
                className="text-white/80 hover:text-white transition-colors"
                onClick={() => setActiveSection(item.toLowerCase())}
              >
                {item}
              </Button>
            ))}
            {isSignedIn ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="h-screen w-full flex items-center justify-center">
          {renderContent()}
        </main>
      </motion.div>
    </div>
  );
}
