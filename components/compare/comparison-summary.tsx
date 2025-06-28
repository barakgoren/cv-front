"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ComparisonSummaryProps {
  totalCandidates: number;
  averageScore: number;
  topCandidate: string;
  applicationTypeName: string;
}

export function ComparisonSummary({
  totalCandidates,
  averageScore,
  topCandidate,
  applicationTypeName,
}: ComparisonSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Comparison Summary
        </CardTitle>
        <CardDescription>
          AI-powered analysis for {applicationTypeName} position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalCandidates}</div>
            <div className="text-sm text-muted-foreground">Total Candidates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {averageScore.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{topCandidate}</div>
            <div className="text-sm text-muted-foreground">Top Candidate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
