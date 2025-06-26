"use client";

import React from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  Phone,
  Download,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useApplication } from "@/services/application.service";
import { Application } from "@/types/application";
import Loader from "@/components/loader";
import { ErrorPage } from "@/components/error-page";
import Link from "next/link";
import { LinkPreviewCard } from "@/components/link-preview-card";
import { FilePreview } from "@/components/file-preview";

// Helper function to render custom field value
const renderCustomFieldValue = (
  application: Application,
  key: string,
  value: any
) => {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">Not provided</span>;
  }

  // Handle file fields
  if (
    key.toLowerCase().includes("cv") ||
    key.toLowerCase().includes("resume") ||
    key.toLowerCase().includes("file")
  ) {
    if (value && typeof value === "string") {
      return <FilePreview fileUrl={value} fileName={value} showInline={true} />;
    }
    return <span className="text-muted-foreground">No file uploaded</span>;
  }

  // Check if value regular expression matches URL patterns
  const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w- .\/?%&=]*)?$/;

  const isValueUrl = typeof value === "string" && urlPattern.test(value);

  if (
    key.toLowerCase().includes("website") ||
    key.toLowerCase().includes("url") ||
    key.toLowerCase().includes("portfolio") ||
    isValueUrl
  ) {
    if (
      value &&
      typeof value === "string" &&
      (value.startsWith("http") || value.startsWith("www"))
    ) {
      const linkPreviewData = application.linkPreviews?.find(
        (preview) => preview.key === key
      );
      return (
        <div>
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {value}
          </a>
          {linkPreviewData && linkPreviewData.preview && (
            <LinkPreviewCard linkPreview={linkPreviewData.preview} />
          )}
        </div>
      );
    }
  }

  // Handle email fields
  if (key.toLowerCase().includes("email")) {
    return (
      <a
        href={`mailto:${value}`}
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <Mail className="h-4 w-4" />
        {value}
      </a>
    );
  }

  // Handle phone fields
  if (
    key.toLowerCase().includes("phone") ||
    key.toLowerCase().includes("tel")
  ) {
    return (
      <a
        href={`tel:${value}`}
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <Phone className="h-4 w-4" />
        {value}
      </a>
    );
  }

  // Handle long text (textarea fields)
  if (typeof value === "string" && value.length > 100) {
    return (
      <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md text-sm">
        {value}
      </div>
    );
  }

  // Default rendering for other values
  return <span>{String(value)}</span>;
};

// Helper function to format field name for display
const formatFieldName = (fieldName: string) => {
  return fieldName
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/\b\w/g, (str) => str.toUpperCase()); // Capitalize each word
};

export default function ApplicationView() {
  const params = useParams();
  const applicationId = params.id as string;

  const {
    data: application,
    isLoading,
    error,
  } = useApplication<Application>({
    path: applicationId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Loading Application...</h1>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <ErrorPage
        title="Application Not Found"
        message="The requested application could not be found."
        statusCode={404}
      />
    );
  }

  // Separate basic info from custom fields
  const customFieldEntries = Object.entries(application.customFields || {});

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/applications">
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Application Details</h1>
            <p className="text-muted-foreground">
              Viewing application #{application.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Call Candidate
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="text-white h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {application.fullName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied on{" "}
                      {format(application.createdAt, "MMMM dd, yyyy")}
                    </span>
                    {application.applicationTypeName && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        {application.applicationTypeName}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                #{application.id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center">
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Application Type
                </h4>
                <p>{application.applicationTypeName}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                  Last Updated
                </h4>
                <p>
                  {format(application.updatedAt, "MMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Fields Card */}
        {customFieldEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Information provided by the candidate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">
                      Full name
                    </h4>
                    <div className="text-sm">
                      {application.fullName || "Not provided"}
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
                {customFieldEntries.map(([key, value], index) => (
                  <div key={key}>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">
                        {formatFieldName(key)}
                      </h4>
                      <div className="text-sm">
                        {renderCustomFieldValue(application, key, value)}
                      </div>
                    </div>
                    {index < customFieldEntries.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage this application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Application
              </Button>
              <Button variant="destructive" className="ml-auto">
                Reject Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
