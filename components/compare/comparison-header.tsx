"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ComparisonHeaderProps {
  totalCandidates: number;
  averageScore: number;
  applicationTypeName: string;
  isUsingSelectedData: boolean;
}

export function ComparisonHeader({
  totalCandidates,
  averageScore,
  applicationTypeName,
  isUsingSelectedData,
}: ComparisonHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Button variant="ghost" size="sm" asChild>
          <Link href="/applications">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Compare Applications</h1>
          <p className="text-muted-foreground">
            {isUsingSelectedData
              ? `AI Analysis: ${applicationTypeName} Position`
              : `Sample AI Analysis: ${applicationTypeName} Position`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm">
          {isUsingSelectedData ? `${totalCandidates} Selected` : `${totalCandidates} Sample`}
        </Badge>
        <Badge variant="outline" className="text-sm">
          Avg Score: {averageScore.toFixed(1)}%
        </Badge>
      </div>
    </header>
  );
}
