import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8">
            <Skeleton className="h-8 w-8" />
          </div>
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  {i < 3 && <Skeleton className="h-px w-full my-4" />}
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
