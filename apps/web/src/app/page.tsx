'use client'

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, CheckCircle2, Menu } from 'lucide-react';
import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-400 text-black font-mono">
      <header className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-gray-400 shadow-md py-2' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className={`transition-all duration-300 ${isScrolled ? 'scale-75' : 'scale-100'}`}>
            <h1 className="text-4xl font-bold font-sans">Infer</h1>
            <p className={`mt-2 text-lg transition-all duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
              A powerful, type-safe SDK for ML inference operations.
            </p>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Button asChild className="bg-black text-white hover:bg-gray-800">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="border-black hover:bg-gray-300">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-black text-white hover:bg-gray-800">Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </nav>
          <Button variant="ghost" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-400 p-4">
            {isSignedIn ? (
              <>
                <Button asChild className="w-full mb-2 bg-black text-white hover:bg-gray-800">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <div className="flex justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full mb-2 border-black hover:bg-gray-300">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        )}
      </header>

      <main className="pt-32 p-6 max-w-7xl mx-auto">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 font-sans">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "🏗️ No infra to manage",
              "🧸 No need to cache models, no need to quantize",
              "🧨 < 250ms first response",
              "📈 Cheaper than HF Inference",
              "🚀 Zero-shot classification",
              "💪 Full TypeScript support",
              "🔒 Built-in error handling",
              "⚡️ Modern ESM and CommonJS support"
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-200 border-2 border-black">
                <CardContent className="p-4">
                  <p className="flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />
                    <span>{feature}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 font-sans">Installation</h2>
          <Card className="bg-gray-200 border-2 border-black">
            <CardContent className="p-4">
              <pre className="font-mono text-sm overflow-x-auto">
                <code>npm install infer-sdk</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 font-sans">Quick Start</h2>
          <Card className="bg-gray-200 border-2 border-black">
            <CardContent className="p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                <code>{`import Infer from 'infer-sdk';

const infer = new Infer({ apiKey: 'your-api-key' });

const result = await infer.zeroShot.classify(
  "I love this product!",
  ['positive', 'negative']
);`}</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 font-sans">Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "API Reference", href: "/docs/api" },
              { title: "Error Handling", href: "/docs/errors" },
              { title: "Examples", href: "/docs/examples" },
            ].map((doc, index) => (
              <Card key={index} className="bg-gray-200 border-2 border-black">
                <CardHeader>
                  <CardTitle className="text-xl font-sans">{doc.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="p-0">
                    <Link href={doc.href} className="flex items-center">
                      Read More <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 font-sans">Error Types</h2>
          <Card className="bg-gray-200 border-2 border-black">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-300">
                    <TableHead className="font-bold">Error Class</TableHead>
                    <TableHead className="font-bold">Description</TableHead>
                    <TableHead className="font-bold">HTTP Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>UnauthorizedError</TableCell>
                    <TableCell>Invalid API key</TableCell>
                    <TableCell>401</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>RateLimitError</TableCell>
                    <TableCell>Too many requests</TableCell>
                    <TableCell>429</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>InferError</TableCell>
                    <TableCell>Generic error</TableCell>
                    <TableCell>Various</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="p-6 border-t-4 border-black mt-12">
        <div className="max-w-7xl mx-auto">
          <p>License: MIT</p>
        </div>
      </footer>
    </div>
  );
}