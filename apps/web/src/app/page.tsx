import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gray-400 text-black font-mono">
      <header className="p-6 border-b border-black rounded-b-lg flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Infer</h1>
          <p className="mt-2">
            A powerful, type-safe SDK for ML inference operations.
          </p>
        </div>
        <div>
          {userId ? (
            <Link
              href="/dashboard"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Sign Up
            </Link>
          )}
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside">
            <li>🏗️ No infra to manage</li>
            <li>🧸 No local models</li>
            <li>🚀 Zero-shot classification</li>
            <li>💪 Full TypeScript support</li>
            <li>🔒 Built-in error handling</li>
            <li>⚡️ Modern ESM and CommonJS support</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Installation</h2>
          <pre className="bg-gray-200 text-black p-4 overflow-x-auto rounded-lg">
            <code>npm install infer-sdk</code>
          </pre>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
          <pre className="bg-gray-200 text-black p-4 overflow-x-auto rounded-lg">
            <code>{`import Infer from 'infer-sdk';

const infer = new Infer({ apiKey: 'your-api-key' });

const result = await infer.zeroShot.classify(
  "I love this product!",
  ['positive', 'negative']
);`}</code>
          </pre>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Documentation</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/docs/api" className="underline">
                API Reference
              </Link>
            </li>
            <li>
              <Link href="/docs/errors" className="underline">
                Error Handling
              </Link>
            </li>
            <li>
              <Link href="/docs/examples" className="underline">
                Examples
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Error Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border border-black p-2">Error Class</th>
                  <th className="border border-black p-2">Description</th>
                  <th className="border border-black p-2">HTTP Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2">UnauthorizedError</td>
                  <td className="border border-black p-2">Invalid API key</td>
                  <td className="border border-black p-2">401</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">RateLimitError</td>
                  <td className="border border-black p-2">Too many requests</td>
                  <td className="border border-black p-2">429</td>
                </tr>
                <tr>
                  <td className="border border-black p-2">InferError</td>
                  <td className="border border-black p-2">Generic error</td>
                  <td className="border border-black p-2">Various</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="p-6 border-t border-black mt-12 rounded-t-lg">
        <p>License: MIT</p>
      </footer>
    </div>
  );
}
