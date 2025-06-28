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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  Star,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { applicationService } from "@/services/application.service";
import Loader from "@/components/loader";
import { ErrorPage } from "@/components/error-page";
import useGlobalStore from "@/store/global.store";
import { cn } from "@/lib/utils";
import { ApplicantsCompareResponse, ApplicantStructure } from "@/types/ai-responses.type";
import { toast } from "@/hooks/use-toast";

export default function CompareApplication() {
  const router = useRouter();
  const params = useSearchParams();
  const applicationTypeId = params.get("applicationTypeId");
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedItems: selectedApplicationIds } = useGlobalStore(
    (state) => state
  );
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

  // Mock data matching the correct ApplicantsCompareResponse structure
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
        matchPercentageReason: "Strong React and TypeScript experience with leadership skills. Perfect fit for senior frontend role with modern tech stack knowledge.",
        matchLabel: "Excellent Match"
      },
      {
        personalInfo: {
          fullName: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 987-6543",
          currentCompany: "Design Studio Pro",
          location: "New York, NY",
          experience: "3 years",
          skills: ["React", "Figma", "CSS", "JavaScript", "Adobe Creative Suite"],
          salaryExpectation: "$75,000",
        },
        matchPrecentage: 72,
        matchPercentageReason: "Good UI/UX design skills with modern framework knowledge. Suitable for mid-level frontend position but needs more full-stack experience.",
        matchLabel: "Good Match"
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
        matchPercentageReason: "Strong backend and system architecture skills but limited frontend framework experience. Better suited for full-stack or backend role.",
        matchLabel: "Partial Match"
      }
    ]
  };

  const displayData = useMemo(() => {
    if (selectedApplicationIds.length === 0) {
      return mockCompareData;
    }
    return compareData;
  }, [selectedApplicationIds.length, compareData]);

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getMatchBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "outline";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center gap-4 p-4 border-b">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Loading AI Comparison...</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16">
              <Loader />
            </div>
            <p className="text-muted-foreground">Analyzing applications with AI...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center gap-4 p-4 border-b">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Compare Applications</h1>
        </header>
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

  const averageScore = displayData.applicants.reduce((sum, app) => sum + app.matchPrecentage, 0) / displayData.applicants.length;
  const topCandidate = displayData.applicants.reduce((top, current) => 
    current.matchPrecentage > top.matchPrecentage ? current : top
  );

  return (
    <div className="flex flex-col min-h-screen">
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
            <h1 className="text-2xl font-bold">AI Application Comparison</h1>
            <p className="text-muted-foreground">
              {selectedApplicationIds.length > 0
                ? `AI Analysis of ${displayData.applicants.length} selected applications`
                : `Sample AI Analysis of ${displayData.applicants.length} applications`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {selectedApplicationIds.length > 0
              ? `${displayData.applicants.length} Selected`
              : `${displayData.applicants.length} Sample`}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Avg Score: {averageScore.toFixed(1)}%
          </Badge>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              AI Comparison Summary
            </CardTitle>
            <CardDescription>
              Intelligent analysis and ranking of candidate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {displayData.applicants.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Candidates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {averageScore.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Average Match Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {topCandidate.personalInfo.fullName}
                </div>
                <div className="text-sm text-muted-foreground">Top Candidate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicants Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Detailed AI Analysis
            </CardTitle>
            <CardDescription>
              AI-powered candidate evaluation with match percentages and reasoning
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
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Ranking Badge */}
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={index === 0 ? "default" : "secondary"} 
                              className="text-xs"
                            >
                              #{index + 1}
                            </Badge>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <User className="text-white h-6 w-6" />
                            </div>
                          </div>

                          {/* Name and Contact Info */}
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                {applicant.personalInfo.fullName}
                              </h3>
                              {index === 0 && (
                                <Badge variant="default" className="text-xs bg-yellow-500">
                                  Top Choice
                                </Badge>
                              )}
                              <Badge 
                                variant={getMatchBadgeVariant(applicant.matchPrecentage)} 
                                className="text-xs"
                              >
                                {applicant.matchLabel}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">
                                  {applicant.personalInfo.email}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{applicant.personalInfo.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="flex items-center gap-3 min-w-[250px]">
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end mb-1">
                              {getScoreIcon(applicant.matchPrecentage)}
                              <span className="text-sm font-medium">
                                {applicant.matchPrecentage}% Match
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              AI Confidence Score
                            </div>
                          </div>
                          <div className="w-24">
                            <Progress
                              value={applicant.matchPrecentage}
                              variant={
                                applicant.matchPrecentage >= 80 
                                  ? "success" 
                                  : applicant.matchPrecentage >= 60 
                                  ? "warning" 
                                  : "danger"
                              }
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Left Column - Personal Info & Skills */}
                        <div className="space-y-4">
                          {/* Personal Information */}
                          <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Personal Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Experience
                                  </label>
                                  <p className="text-sm mt-1">{applicant.personalInfo.experience || "N/A"}</p>
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Location
                                  </label>
                                  <p className="text-sm flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {applicant.personalInfo.location || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  Current Company
                                </label>
                                <p className="text-sm flex items-center gap-1 mt-1">
                                  <Briefcase className="h-3 w-3" />
                                  {applicant.personalInfo.currentCompany || "N/A"}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  Salary Expectation
                                </label>
                                <p className="text-sm mt-1">{applicant.personalInfo.salaryExpectation || "Not specified"}</p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Skills */}
                          <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                Skills & Technologies
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {applicant.personalInfo.skills?.map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                )) || (
                                  <span className="text-sm text-muted-foreground">No skills listed</span>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Right Column - AI Analysis */}
                        <div className="space-y-4">
                          {/* AI Reasoning */}
                          <Card className="shadow-sm bg-blue-50 border-blue-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
                                <Award className="h-4 w-4" />
                                AI Match Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {applicant.matchPrecentage}% Match
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {applicant.matchLabel}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-blue-800">
                                    {applicant.matchPercentageReason}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Contact Details */}
                          <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Contact Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  Email Address
                                </label>
                                <p className="text-sm mt-1 break-all">{applicant.personalInfo.email || "Not provided"}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  Phone Number
                                </label>
                                <p className="text-sm mt-1">{applicant.personalInfo.phone || "Not provided"}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("View details for", applicant.personalInfo.fullName);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            console.log("Schedule interview for", applicant.personalInfo.fullName);
                            toast({
                              title: "Interview Scheduled",
                              description: `Interview request sent for ${applicant.personalInfo.fullName}`,
                            });
                          }}
                        >
                          Schedule Interview
                        </Button>
                      </div>
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
