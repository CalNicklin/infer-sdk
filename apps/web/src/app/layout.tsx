import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BackgroundParticles } from "@/components/ui/background-particles";
import { Nav } from "@/components/nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Infer - ML Inference SDK",
  description: "A powerful, type-safe SDK for ML inference operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      dynamic
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-black min-h-screen`}
        >
          {/* Background container */}
          <div className="fixed inset-0 z-0">
            {/* Prism Effect */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-transparent to-blue-500/30" />
              <div className="absolute inset-0 bg-gradient-to-tl from-red-500/30 via-transparent to-yellow-500/30" />
            </div>
            <BackgroundParticles />
          </div>

          <Nav />
          <main className="mt-[72px] px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full z-10">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
