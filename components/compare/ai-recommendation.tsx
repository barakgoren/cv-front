"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface AIRecommendationProps {
  applicant: {
    id: number;
    name: string;
    recommendation: string;
  };
}

export function AIRecommendation({ applicant }: AIRecommendationProps) {
  const router = useRouter();

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
          <Award className="h-4 w-4" />
          AI Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-800 mb-4">{applicant.recommendation}</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/applications/${applicant.id}`)}
          >
            View Details
          </Button>
          <Button
            size="sm"
            onClick={() => {
              console.log("Schedule interview for", applicant.name);
              toast({
                title: "Interview Scheduled",
                description: `Interview request sent for ${applicant.name}`,
              });
            }}
          >
            Schedule Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
