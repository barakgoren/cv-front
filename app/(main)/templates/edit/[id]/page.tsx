"use client";

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
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/types/template";
import {
  updateTemplateSchema,
  UpdateTemplateSchema,
} from "@/schema/template.schema";
import { templateService } from "@/services/template.service";
import PageWrapper from "@/components/page-wrapper";

interface EditTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateTemplateSchema>({
    resolver: zodResolver(updateTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  // Fetch template data
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setIsLoading(true);
        const fetchedTemplate = await templateService.getTemplate(
          resolvedParams.id
        );
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate);
          // Reset form with fetched data
          form.reset({
            name: fetchedTemplate.name,
            description: fetchedTemplate.description,
            isActive: fetchedTemplate.isActive,
          });
        } else {
          toast({
            title: "Error",
            description: "Template not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        toast({
          title: "Error",
          description: "Failed to load template",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [resolvedParams.id, form, toast, router]);

  const handleSubmit = async (values: UpdateTemplateSchema) => {
    if (!template) return;

    try {
      setIsSubmitting(true);
      const updatedTemplate = await templateService.updateTemplate(
        template.id,
        values
      );

      if (updatedTemplate) {
        toast({
          title: "Success",
          description: "Template updated successfully",
        });
        router.push("/templates");
      } else {
        toast({
          title: "Error",
          description: "Failed to update template",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading template...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!template) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Template not found</h2>
            <Button onClick={() => router.push("/templates")} className="mt-4">
              Back to Templates
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex items-center gap-4 mb-6">
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">
            Update the template details below
          </p>
        </div>
      </div>

      <Card className="max-w-full">
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
          <CardDescription>
            Modify the template name, description, and status.
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

            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Template"
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

      {/* Template Metadata */}
      <Card className="max-w-2xl mt-6">
        <CardHeader>
          <CardTitle>Template Metadata</CardTitle>
          <CardDescription>Information about this template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Template ID:</span>
            <span className="text-sm text-muted-foreground">{template.id}</span>
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
    </PageWrapper>
  );
}
