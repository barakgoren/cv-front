"use client";

import Loader from "@/components/loader";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface LoadingStateProps {
  title?: string;
  message?: string;
}

export function LoadingState({ 
  title = "Loading Comparison...", 
  message = "Analyzing applications..." 
}: LoadingStateProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-4 p-4 border-b">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16">
            <Loader />
          </div>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
