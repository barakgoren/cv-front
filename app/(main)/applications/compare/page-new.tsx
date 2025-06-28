"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Award } from "lucide-react";
import { applicationService } from "@/services/application.service";
import { ErrorPage } from "@/components/error-page";
import useGlobalStore from "@/store/global.store";
import { ApplicantsCompareResponse } from "@/types/ai-responses.type";
import { toast } from "@/hooks/use-toast";

// Component imports
import { ComparisonHeader } from "@/components/compare/comparison-header";
import { ComparisonSummary } from "@/components/compare/comparison-summary";
import { ApplicantRow } from "@/components/compare/applicant-row";
import { ApplicantDetails } from "@/components/compare/applicant-details";
import { AIRecommendation } from "@/components/compare/ai-recommendation";
import { LoadingState } from "@/components/compare/loading-state";

export default function CompareApplication() {
  const router = useRouter();
  const params = useSearchParams();
  const applicationTypeId = params.get("applicationTypeId");
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedItems: selectedApplicationIds } = useGlobalStore();
  const [compareData, setCompareData] =
    useState<ApplicantsCompareResponse | null>(null);

  useEffect(() => {
    const getCompareData = async () => {
      if (
        selectedApplicationIds.length > 0 &&
        applicationTypeId &&
        !isNaN(Number(applicationTypeId))
      ) {
        setLoading(true);
        try {
          const response = await applicationService.compareApplications(
            selectedApplicationIds,
            applicationTypeId
          );
          setCompareData(response);
        } catch (error) {
          console.error("Error fetching comparison data:", error);
          toast({
            title: "Error",
            description: "Could not load comparison data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setCompareData(null);
      }
    };

    if (!compareData && selectedApplicationIds.length > 0) {
      getCompareData();
    }
  }, [selectedApplicationIds, applicationTypeId]);

  // Mock data for demonstration
  const mockCompareData: ApplicantsCompareResponse = {
    applicants: [
      {
        personalInfo: {
          fullName: "John Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567",
          currentCompany: "Tech Solutions Inc",
          location: "San Francisco, CA",
          experience: "5 years",
          skills: ["React", "TypeScript", "Node.js", "Git", "Jest"],
          salaryExpectation: "$95,000",
        },
        matchPrecentage: 87,
        matchPercentageReason:
          "Strong React and TypeScript experience with leadership skills. Perfect fit for senior frontend role with modern tech stack knowledge.",
        matchLabel: "Excellent Match",
      },
      {
        personalInfo: {
          fullName: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 987-6543",
          currentCompany: "Design Studio Pro",
          location: "New York, NY",
          experience: "3 years",
          skills: [
            "React",
            "Figma",
            "CSS",
            "JavaScript",
            "Adobe Creative Suite",
          ],
          salaryExpectation: "$75,000",
        },
        matchPrecentage: 72,
        matchPercentageReason:
          "Good UI/UX design skills with modern framework knowledge. Suitable for mid-level frontend position but needs more full-stack experience.",
        matchLabel: "Good Match",
      },
      {
        personalInfo: {
          fullName: "Michael Chen",
          email: "michael.chen@email.com",
          phone: "+1 (555) 456-7890",
          currentCompany: "Data Systems Corp",
          location: "Seattle, WA",
          experience: "7 years",
          skills: ["Python", "PostgreSQL", "AWS", "Docker", "API Design"],
          salaryExpectation: "$110,000",
        },
        matchPrecentage: 58,
        matchPercentageReason:
          "Strong backend and system architecture skills but limited frontend framework experience. Better suited for full-stack or backend role.",
        matchLabel: "Partial Match",
      },
    ],
  };

  const displayData = useMemo(() => {
    if (selectedApplicationIds.length === 0) {
      return mockCompareData;
    }
    return compareData;
  }, [selectedApplicationIds.length, compareData]);

  if (loading) {
    return (
      <LoadingState
        title="Loading AI Comparison..."
        message="Analyzing applications with AI..."
      />
    );
  }

  if (!displayData) {
    return (
      <div className="flex flex-col min-h-screen">
        <ComparisonHeader
          totalCandidates={0}
          averageScore={0}
          applicationTypeName="Frontend Developer"
          isUsingSelectedData={false}
        />
        <div className="flex-1 flex items-center justify-center">
          <ErrorPage
            title="No Comparison Data"
            message="Please select applications to compare from the applications list."
            statusCode={400}
          />
        </div>
      </div>
    );
  }

  const averageScore =
    displayData.applicants.reduce((sum, app) => sum + app.matchPrecentage, 0) /
    displayData.applicants.length;
  const topCandidate = displayData.applicants.reduce((top, current) =>
    current.matchPrecentage > top.matchPrecentage ? current : top
  );

  return (
    <div className="flex flex-col min-h-screen">
      <ComparisonHeader
        totalCandidates={displayData.applicants.length}
        averageScore={averageScore}
        applicationTypeName="Frontend Developer"
        isUsingSelectedData={selectedApplicationIds.length > 0}
      />

      <div className="flex-1 p-6 space-y-6">
        <ComparisonSummary
          totalCandidates={displayData.applicants.length}
          averageScore={averageScore}
          topCandidate={topCandidate.personalInfo.fullName}
          applicationTypeName="Frontend Developer"
        />

        {/* Detailed Applicants Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Detailed AI Analysis
            </CardTitle>
            <CardDescription>
              AI-powered candidate evaluation with match percentages and
              reasoning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-4">
              {displayData.applicants
                .sort((a, b) => b.matchPrecentage - a.matchPrecentage)
                .map((applicant, index) => (
                  <AccordionItem
                    key={`${applicant.personalInfo.fullName}-${index}`}
                    value={`applicant-${index}`}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <ApplicantRow
                        applicant={{
                          id: index + 1,
                          name: applicant.personalInfo.fullName,
                          email: applicant.personalInfo.email || "No email",
                          phone: applicant.personalInfo.phone || "No phone",
                          qualificationScore: applicant.matchPrecentage,
                        }}
                        rank={index + 1}
                      />
                    </AccordionTrigger>

                    <AccordionContent className="pt-4">
                      <ApplicantDetails
                        applicant={{
                          id: index + 1,
                          name: applicant.personalInfo.fullName,
                          email: applicant.personalInfo.email || "No email",
                          phone: applicant.personalInfo.phone || "No phone",
                          experience:
                            applicant.personalInfo.experience ||
                            "Not specified",
                          location:
                            applicant.personalInfo.location || "Not specified",
                          applicationDate: new Date().toISOString(), // Mock date
                          keySkills: applicant.personalInfo.skills || [],
                          strengths: applicant.personalInfo.keyStrengths || [
                            "No strengths provided",
                          ],
                          weaknesses: applicant.personalInfo
                            .areaForImprovement || [
                            "No areas for improvement provided",
                          ],
                        }}
                      />

                      <AIRecommendation
                        applicant={{
                          id: index + 1,
                          name: applicant.personalInfo.fullName,
                          recommendation: applicant.matchPercentageReason,
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
