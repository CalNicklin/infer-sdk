'use client'

import { generateApiKey } from "@/app/actions/generate-key";
import { Copy } from "lucide-react";
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

function GenerateButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-white/10 text-white/80 hover:bg-white/20 disabled:opacity-50"
    >
      {pending ? "Generating..." : "Generate API Key"}
    </Button>
  )
}

export default function ApiKey() {
  const [apiKey, setApiKey] = useState<string>()

  const handleGenerate = async () => {
    try {
      const result = await generateApiKey()
      if (result.key) {
        setApiKey(result.key)
      }
    } catch (error) {
      console.error("Error generating key:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
              className="text-white/70 hover:text-white/80"
            >
              <Copy className="h-4 w-4" />
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
