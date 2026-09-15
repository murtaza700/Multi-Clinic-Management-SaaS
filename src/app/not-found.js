import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Building2 className="h-8 w-8" />
        </div>

        {/* Error Code */}
        <p className="text-7xl font-bold tracking-tight">404</p>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been
          moved, deleted, or the URL may be incorrect.
        </p>

        {/* Action */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
