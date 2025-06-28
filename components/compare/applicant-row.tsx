"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Phone, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

interface ApplicantRowProps {
  applicant: {
    id: number;
    name: string;
    email: string;
    phone: string;
    qualificationScore: number;
  };
  rank: number;
}

export function ApplicantRow({ applicant, rank }: ApplicantRowProps) {
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Review";
  };

  const getProgressVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  return (
    <div className="flex items-center justify-between w-full pr-4">
      <div className="flex items-center gap-4 flex-1">
        {/* Ranking Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={rank === 1 ? "default" : "secondary"} className="text-xs">
            #{rank}
          </Badge>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="text-white h-6 w-6" />
          </div>
        </div>

        {/* Name and Contact Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{applicant.name}</h3>
            {rank === 1 && (
              <Badge variant="default" className="text-xs bg-gold">
                Top Choice
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[200px]">{applicant.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{applicant.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Qualification Score */}
      <div className="flex items-center gap-3 min-w-[250px]">
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end mb-1">
            {getScoreIcon(applicant.qualificationScore)}
            <span className="text-sm font-medium">
              {getScoreLabel(applicant.qualificationScore)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {applicant.qualificationScore}% Match
          </div>
        </div>
        <div className="w-24">
          <Progress 
            value={applicant.qualificationScore} 
            variant={getProgressVariant(applicant.qualificationScore)} 
            className="h-2" 
          />
        </div>
      </div>
    </div>
  );
}
