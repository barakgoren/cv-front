"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ExternalLink, Link2, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/types/template";
import {
  createTemplateSchema,
  CreateTemplateSchema,
} from "@/schema/template.schema";
import { templateService } from "@/services/template.service";
import PageWrapper from "@/components/page-wrapper";
import FormFieldsPicker from "@/components/form-fields-picker";
import { lookForParam } from "@/lib/utils";
import Link from "next/link";
import QualiPicker from "./qualy-picker";

interface TemplateCardProps {
  template?: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!template;

  const form = useForm<CreateTemplateSchema>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      isActive: template?.isActive ?? true,
      formFields: template?.formFields || [],
      qualifications: template?.qualifications || [],
    },
  });
  const handleSubmit = async (values: CreateTemplateSchema) => {
    try {
      setIsSubmitting(true);

      let result;
      if (isEditMode && template) {
        // Update existing template
        result = await templateService.updateTemplate(template.id, values);
      } else {
        // Create new template
        result = await templateService.createTemplate(values);
      }

      if (result) {
        toast({
          title: "Success",
          description: isEditMode
            ? "Template updated successfully"
            : "Template created successfully",
        });
        router.push("/templates");
      } else {
        toast({
          title: "Error",
          description: isEditMode
            ? "Failed to update template"
            : "Failed to create template",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(
        isEditMode ? "Error updating template:" : "Error creating template:",
        error
      );
      toast({
        title: "Error",
        description: isEditMode
          ? "Failed to update template"
          : "Failed to create template",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (errors: any) => {
    const errorMessage = lookForParam("message", errors);
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <PageWrapper>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-7 w-7"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Template" : "Create New Template"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Update the template details below"
                : "Fill in the details to create a new template"}
            </p>
          </div>
        </div>
        <div>
          <Link
            href={`/view/${template?.companyId}?applicationId=${template?.id}`}
            target="_blank"
          >
            <Button variant="outline" size="icon" tooltip="View Template">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Card className="max-w-full">
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Modify the template name, description, and status."
              : "Enter the template name, description, and set its initial status."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit, handleError)}
            className="space-y-6"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter template name"
                    {...field}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter template description"
                    rows={4}
                    {...field}
                    disabled={isSubmitting}
                  />
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
            <Controller
              name="qualifications"
              control={form.control}
              render={({ field, fieldState }) => {
                return <QualiPicker {...field} fieldState={fieldState} />;
              }}
            />

            <Controller
              name="isActive"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="isActive">Active Template</Label>
                  {fieldState.error && (
                    <p className="text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="formFields"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <div className="space-y-2">
                    <FormFieldsPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && (
                      <p className="text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : isEditMode ? (
                  "Update Template"
                ) : (
                  "Create Template"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Template Metadata - Only show in edit mode */}
      {isEditMode && template && (
        <Card className="max-w-2xl mt-6">
          <CardHeader>
            <CardTitle>Template Metadata</CardTitle>
            <CardDescription>Information about this template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Template ID:</span>
              <span className="text-sm text-muted-foreground">
                {template.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm text-muted-foreground">
                {template.createdAt.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="text-sm text-muted-foreground">
                {template.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </PageWrapper>
  );
}
