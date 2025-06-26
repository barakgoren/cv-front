"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Calendar,
  FileText,
} from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedinUrl: string;
  portfolioUrl: string;
}

interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements: string[];
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa: string;
}

interface CVAnalysis {
  personalInfo: PersonalInfo;
  summary: string;
  skills: Skills;
  experience: Experience[];
  education: Education[];
  certifications: any[];
  projects: any[];
  awards: any[];
  additionalInfo: string;
}

interface CVMetadata {
  totalPages: number;
  textLength: number;
  analyzedAt: string;
}

interface CVPreviewData {
  analysis: CVAnalysis;
  metadata: CVMetadata;
}

interface CVPreviewCardProps {
  data: CVPreviewData;
  className?: string;
}

export function CVPreviewCard({ data, className = "" }: CVPreviewCardProps) {
  const { analysis, metadata } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={`w-full max-w-4xl ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CV Analysis Preview
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {metadata.totalPages} page{metadata.totalPages !== 1 ? "s" : ""} • {metadata.textLength} chars
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Analyzed on {formatDate(metadata.analyzedAt)}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
            <User className="h-4 w-4" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{analysis.personalInfo.fullName}</span>
            </div>
            {analysis.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{analysis.personalInfo.email}</span>
              </div>
            )}
            {analysis.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{analysis.personalInfo.phone}</span>
              </div>
            )}
            {analysis.personalInfo.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{analysis.personalInfo.address}</span>
              </div>
            )}
            {analysis.personalInfo.linkedinUrl && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{analysis.personalInfo.linkedinUrl}</span>
              </div>
            )}
            {analysis.personalInfo.portfolioUrl && (
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{analysis.personalInfo.portfolioUrl}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Summary */}
        {analysis.summary && (
          <>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <FileText className="h-4 w-4" />
                Professional Summary
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.summary}
              </p>
            </div>
            <Separator />
          </>
        )}

        {/* Skills */}
        {analysis.skills.technical.length > 0 && (
          <>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Code className="h-4 w-4" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.technical.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Experience */}
        {analysis.experience.length > 0 && (
          <>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Briefcase className="h-4 w-4" />
                Work Experience
              </h3>
              <div className="space-y-4">
                {analysis.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {exp.duration}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 text-sm space-y-1">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Education */}
        {analysis.education.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <GraduationCap className="h-4 w-4" />
              Education
            </h3>
            <div className="space-y-3">
              {analysis.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-muted pl-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      {edu.field && (
                        <p className="text-xs text-muted-foreground">{edu.field}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {edu.graduationYear}
                      </div>
                      {edu.gpa && (
                        <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {analysis.certifications.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Award className="h-4 w-4" />
                Certifications
              </h3>
              <div className="space-y-2">
                {analysis.certifications.map((cert, index) => (
                  <div key={index} className="text-sm">
                    {/* Add certification display logic based on your data structure */}
                    {JSON.stringify(cert)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Additional Info */}
        {analysis.additionalInfo && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.additionalInfo}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default CVPreviewCard;
