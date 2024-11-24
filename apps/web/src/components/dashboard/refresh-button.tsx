"use client";

import { Button } from "../ui/button";

export function RefreshButton() {
  return (
    <Button
      className="bg-white/10 text-white/80 hover:bg-white/20"
      onClick={() => window.location.reload()}
    >
      Refresh Status
    </Button>
  );
}
