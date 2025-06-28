"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Star, MapPin, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ApplicantDetailsProps {
  applicant: {
    id: number;
    name: string;
    email: string;
    phone: string;
    experience: string;
    location: string;
    applicationDate: string;
    keySkills: string[];
    strengths: string[];
    weaknesses: string[];
  };
}

export function ApplicantDetails({ applicant }: ApplicantDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Left Column - Basic Info & Strengths */}
      <div className="space-y-4">
        {/* Basic Info */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Candidate Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Experience
                </label>
                <p className="text-sm mt-1">{applicant.experience}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Location
                </label>
                <p className="text-sm flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {applicant.location}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Applied Date
              </label>
              <p className="text-sm flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(applicant.applicationDate), "MMM dd, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {applicant.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Skills & Weaknesses */}
      <div className="space-y-4">
        {/* Key Skills */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Key Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {applicant.keySkills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {applicant.weaknesses.map((weakness, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
