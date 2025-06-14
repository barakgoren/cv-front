"use client";

import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import Loader from "@/components/loader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth, user } = useAuthStore((state) => state);
  useEffect(() => {
    const checkAuth = async () => {
      if (!(await auth())) {
        redirect("/login");
      }
    };
    checkAuth();
  }, []);

  if (!user) {
    return (
      <div className="w-8 h-8 fixed top-1/2 left-1/2">
        <Loader />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </SidebarProvider>
  );
}
