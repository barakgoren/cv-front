import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX } from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/page-wrapper";

export default function TemplateNotFound() {
  return (
    <PageWrapper>
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <FileX className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <CardTitle>Template Not Found</CardTitle>
            <CardDescription>
              The template you're looking for doesn't exist or may have been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/templates">
                Back to Templates
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/">
                Go to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
