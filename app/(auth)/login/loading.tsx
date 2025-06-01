import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto mt-6" />
          <Skeleton className="h-4 w-64 mx-auto mt-2" />
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Skeleton className="h-px w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </div>
  )
}
