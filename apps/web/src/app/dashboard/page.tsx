"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const generateKey = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/key", {
        method: "POST",
      });
      const data = await response.json();
      setApiKey(data.key);
    } catch (error) {
      console.error("Error generating key:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-400 text-gray-800 font-mono">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your API Key</h2>

          {!apiKey ? (
            <Button
              onClick={generateKey}
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate API Key"}
            </Button>
          ) : (
            <div className="bg-white p-4 rounded-md">
              <code className="text-sm break-all">{apiKey}</code>
            </div>
          )}

          {apiKey && (
            <p className="mt-4 text-sm text-gray-600">
              Store this key securely. You won&apos;t be able to see it again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
