"use client";

import { generateApiKey } from "@/app/actions/generate-key";
import { Copy, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";

interface ApiKeyProps {
  hasActiveSubscription?: boolean;
}

function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-50"
    >
      {pending ? "Generating..." : "Generate API Key"}
    </Button>
  );
}

export default function ApiKey({ hasActiveSubscription = false }: ApiKeyProps) {
  const [apiKey, setApiKey] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>();

  const handleGenerate = async () => {
    try {
      const result = await generateApiKey();
      if (result.key) {
        setApiKey(result.key);
      }
    } catch (error) {
      console.error("Error generating key:", error);
      setError("Failed to generate API key. Please try again.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasActiveSubscription) {
    return (
      <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white/80">Your API Key</CardTitle>
          <CardDescription className="text-white/60">
            Subscribe to generate an API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-white/5 border-white/10">
            <AlertCircle className="h-4 w-4 text-white/70" />
            <AlertDescription className="text-white/60">
              You need an active subscription to generate API keys. Subscribe to
              get started with 10,000 free tokens per month. Head to
              &apos;Billing&apos; to subscribe.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white/80">Your API Key</CardTitle>
        <CardDescription className="text-white/60">
          Generate and manage your API key
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!apiKey ? (
          <form action={handleGenerate}>
            <GenerateButton />
          </form>
        ) : (
          <div className="bg-white/5 p-4 rounded-md border border-white/10 backdrop-blur-sm flex items-center justify-between">
            <code className="text-sm break-all text-white/80">{apiKey}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(apiKey)}
              className="text-white/70 hover:text-white/80 relative"
            >
              <Copy className="h-4 w-4" />
              {copied && (
                <span className="absolute -top-8 right-0 text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                  Copied!
                </span>
              )}
              <span className="sr-only">Copy API key</span>
            </Button>
          </div>
        )}
        {apiKey && (
          <p className="text-sm text-white/60">
            Store this key securely. You won&apos;t be able to see it again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
