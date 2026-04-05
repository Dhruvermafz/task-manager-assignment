"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-6">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Heading */}
        <h1 className="text-6xl font-bold tracking-tight">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold">Page not found</h2>

        {/* Description */}
        <p className="text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>

          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
