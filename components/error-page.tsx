import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorPageProps {
  title?: string;
  message?: string;
  statusCode?: number;
}

export function ErrorPage({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this page.",
  statusCode = 500
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <CardTitle className="text-xl text-red-700">
            {statusCode === 404 ? "Page Not Found" : title}
          </CardTitle>
          <CardDescription className="text-center">
            {statusCode === 404 
              ? "The company or application you're looking for doesn't exist or has been moved."
              : message
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Error code: {statusCode}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <ErrorPage
      title="Not Found"
      message="The company or application you're looking for doesn't exist."
      statusCode={404}
    />
  );
}
