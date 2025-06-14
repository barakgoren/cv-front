"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import PageWrapper from "@/components/page-wrapper";

export default function EditTemplateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Edit template error:", error);
  }, [error]);

  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle className="text-red-700">Something went wrong</CardTitle>
            <CardDescription>
              Failed to load the template for editing. This could be due to a network issue or the template may no longer exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
            <Button onClick={() => window.history.back()} variant="ghost">
              Go back
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
