import React from "react";
import { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { serverApiService } from "@/services/server-api.service";
import { ErrorPage, NotFoundPage } from "@/components/error-page";
import { PageProps } from "@/types/application";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { companyName } = await params;
  const { application } = await searchParams;

  if (!companyName || !application) {
    return {
      title: "Application Form",
      description: "Fill out the application form",
    };
  }

  const {
    company,
    application: appData,
    isValid,
  } = await serverApiService.validateCompanyApplication(
    companyName,
    application
  );

  if (!isValid || !company || !appData) {
    return {
      title: "Application Not Found",
      description: "The requested application could not be found",
    };
  }

  return {
    title: `${appData.name} by ${company.name}`,
    description: `Apply for ${appData.name} at ${company.name}`,
    openGraph: {
      title: `${appData.name} by ${company.name}`,
      description: `Apply for ${appData.name} at ${company.name}`,
      type: "website",
    },
  };
}

export default async function ApplicationForm({
  params,
  searchParams,
}: PageProps) {
  // Await the dynamic route parameters
  const { companyName } = await params;
  const { application } = await searchParams;

  // Validate required parameters
  if (!companyName || !application) {
    return (
      <ErrorPage
        title="Missing Parameters"
        message="Both company name and application ID are required to view this form."
        statusCode={400}
      />
    );
  }

  // Fetch and validate company and application data
  const {
    company,
    application: appData,
    isValid,
    error,
  } = await serverApiService.validateCompanyApplication(
    companyName,
    application
  );

  // Handle validation errors
  if (!isValid || !company || !appData) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 to-blue-500 flex items-center justify-center">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-3xl font-extrabold text-blue-700 tracking-tight text-center">
            {appData.name}
          </CardTitle>
          <CardDescription className="text-slate-500 text-center text-base mt-2">
            {appData.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                className=""
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className=""
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Type your message here..."
                className="resize-vertical"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg py-3 mt-2 shadow-md hover:from-blue-700 hover:to-cyan-500 transition text-lg tracking-wide"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
