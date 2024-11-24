"use client";

import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-white/60">
            © {new Date().getFullYear()} Infer AI. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Mail className="h-4 w-4" />
            <a
              href="mailto:support@infer-ai.dev"
              className="hover:text-white/80 transition-colors"
            >
              support@infer-ai.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
