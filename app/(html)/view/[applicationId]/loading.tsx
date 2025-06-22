import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationFormLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 to-blue-500 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center">
          <Skeleton className="h-9 w-48 mb-2 animate-pulse" />
          <Skeleton className="h-4 w-64 animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-16 animate-pulse" />
            <Skeleton className="h-10 w-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-16 animate-pulse" />
            <Skeleton className="h-10 w-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-1">
            {/* Loading dots animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
            </div>
            <Skeleton className="h-4 w-20 animate-pulse" />
            <Skeleton className="h-20 w-full animate-pulse" />
          </div>
          <div className="relative">
            <Skeleton className="h-12 w-full rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
