import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

type PageWrapperProps = {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function PageWrapper({
  children,
  title = "Home",
  subtitle = "Welcome to your system",
  action,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground leading-none">{subtitle}</p>
          </div>
        </div>
        {action && <div>{action}</div>}
      </header>
      <div className="flex-1 p-6 space-y-6">{children}</div>
    </div>
  );
}
