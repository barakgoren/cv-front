"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ErrorPage } from "@/components/error-page";
import { DynamicSEO } from "@/components/dynamic-seo";
import {
  applicationService,
  useApplication,
} from "@/services/application.service";
import { Application } from "@/types/application";
import { useTemplate } from "@/services/template.service";
import {
  Template,
  FieldType,
  FormField as TemplateFormField,
} from "@/types/template";
import { Loader2 } from "lucide-react";

// Helper function to create dynamic validation schema for custom fields
const createCustomFieldsSchema = (formFields: TemplateFormField[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  formFields.forEach((field) => {
    let validator: z.ZodTypeAny;

    switch (field.fieldType) {
      case FieldType.Email:
        validator = z.string().email("Please enter a valid email address");
        break;
      case FieldType.Number:
        validator = z.string().regex(/^\d+$/, "Please enter a valid number");
        break;
      case FieldType.Url:
        validator = z.string().url("Please enter a valid URL");
        break;
      case FieldType.Tel:
        validator = z
          .string()
          .regex(
            /^\d{1,15}$/,
            "Please enter a valid phone number (1-15 digits)"
          );
        break;
      case FieldType.File:
        // For file fields, we'll store the file name or file data
        validator = z.any();
        break;
      default:
        validator = z.string();
    }

    if (field.required && field.fieldType !== FieldType.File) {
      validator = (validator as z.ZodString).min(
        1,
        `${field.label} is required`
      );
    } else if (field.required && field.fieldType === FieldType.File) {
      validator = z.any().refine((file) => file != null, {
        message: `${field.label} is required`,
      });
    } else if (!field.required) {
      validator = validator.optional();
    }

    schemaFields[field.fieldName] = validator;
  });

  return z.object(schemaFields);
};

// Application schema matching backend structure
const createApplicationSchema = (formFields: TemplateFormField[] = []) => {
  return z.object({
    fullName: z.string().min(1, "Full name is required"),
    companyId: z.number(),
    applicationTypeId: z.number().optional(),
    customFields:
      formFields.length > 0
        ? createCustomFieldsSchema(formFields)
        : z.record(z.any()).optional(),
  });
};

// Helper function to map field names/types to appropriate autocomplete attributes
const getAutocompleteAttribute = (field: TemplateFormField): string => {
  const fieldName = field.fieldName.toLowerCase();
  const fieldType = field.fieldType;

  // Map common field names to autocomplete values
  if (fieldName.includes("email")) return "email";
  if (fieldName.includes("phone") || fieldName.includes("tel")) return "tel";
  if (fieldName.includes("address")) return "address-line1";
  if (fieldName.includes("city")) return "address-level2";
  if (fieldName.includes("state") || fieldName.includes("region"))
    return "address-level1";
  if (fieldName.includes("zip") || fieldName.includes("postal"))
    return "postal-code";
  if (fieldName.includes("country")) return "country";
  if (fieldName.includes("organization") || fieldName.includes("company"))
    return "organization";
  if (fieldName.includes("title") || fieldName.includes("position"))
    return "organization-title";
  if (fieldName.includes("website") || fieldName.includes("url")) return "url";

  // Map by field type
  switch (fieldType) {
    case FieldType.Email:
      return "email";
    case FieldType.Tel:
      return "tel";
    case FieldType.Url:
      return "url";
    case FieldType.File:
      return "off"; // Files don't need autocomplete
    default:
      return "off";
  }
};

// Component to render individual form fields
const DynamicFormField = ({
  field,
  control,
}: {
  field: TemplateFormField;
  control: any;
}) => {
  const renderInput = (value: any, onChange: (value: any) => void) => {
    const commonProps = {
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      autoComplete: getAutocompleteAttribute(field),
      className:
        "h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors",
    };

    switch (field.fieldType) {
      case FieldType.Textarea:
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            {...commonProps}
            rows={4}
            className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
          />
        );
      case FieldType.File:
        return (
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange(file || null);
              }}
              className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 file:h-full hover:file:bg-blue-100 hover:file:cursor-pointer"
              accept={field.placeholder || "*"} // Use placeholder as accept attribute for file types
            />
          </div>
        );
      case FieldType.Email:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            {...commonProps}
            type="email"
          />
        );
      case FieldType.Tel:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            {...commonProps}
            type="tel"
          />
        );
      case FieldType.Number:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            {...commonProps}
            type="number"
          />
        );
      case FieldType.Url:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            {...commonProps}
            type="url"
          />
        );
      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            {...commonProps}
            type="text"
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={`customFields.${field.fieldName}`}
      render={({ field: formField }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-semibold text-gray-700">
            {field.label} {field.required && "*"}
          </FormLabel>
          <FormControl>
            {renderInput(formField.value, formField.onChange)}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

/**
 * Application Form Component
 *
 * This component renders a dynamic application form that matches the backend schema:
 * - fullName: string (required)
 * - companyId: number (extracted from URL params)
 * - applicationTypeId: number (from applicationId query param)
 * - customFields: Record<string, any> (dynamic fields from template.formFields)
 *
 * The form uses react-hook-form with zod validation for type safety and proper error handling.
 * Custom fields are rendered dynamically based on the template configuration.
 */

export default function ApplicationForm() {
  const params = useParams();
  const applicationId = params.applicationId as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    data: template,
    isLoading,
    error,
  } = useTemplate<Template>({
    path: `${applicationId}`,
  });

  // Create application schema based on template form fields
  const applicationSchema = createApplicationSchema(template?.formFields);

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      companyId: template?.companyId || 0, // Set companyId from template or default to 0
      applicationTypeId: applicationId ? parseInt(applicationId) : undefined,
      customFields:
        template?.formFields?.reduce((acc, field) => {
          // Set appropriate default values based on field type
          acc[field.fieldName] = field.fieldType === FieldType.File ? null : "";
          return acc;
        }, {} as Record<string, any>) || {},
    },
  });

  // Reset form when template changes
  useEffect(() => {
    if (template?.formFields) {
      const customFieldsDefaults = template.formFields.reduce((acc, field) => {
        // Set appropriate default values based on field type
        acc[field.fieldName] = field.fieldType === FieldType.File ? null : "";
        return acc;
      }, {} as Record<string, any>);

      form.reset({
        fullName: "",
        companyId: template.companyId || 0, // Set companyId from template or default to 0
        applicationTypeId: applicationId ? parseInt(applicationId) : undefined,
        customFields: customFieldsDefaults,
      });
    }
  }, [template, form, applicationId]);

  const onSubmit = async (data: {
    fullName: string;
    companyId: number;
    applicationTypeId?: number;
    customFields: Record<string, any>;
  }) => {
    const message = await applicationService.postApplication(data);
    toast({
      title: "Application Submitted",
      description:
        message || "Your application has been submitted successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-300 to-blue-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <ErrorPage
        title="Application Not Found"
        message="The requested application could not be found."
        statusCode={404}
      />
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-emerald-300 to-blue-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md border-0">
          <CardHeader className="flex flex-col items-center space-y-4 pb-6">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {template.name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Title and Description */}
            <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 tracking-tight text-center">
              {template.name}
            </CardTitle>
            <CardDescription className="text-slate-600 text-center text-base leading-relaxed">
              {template.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-6"
              >
                {/* Full name required field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoComplete="name"
                          placeholder="Enter your full name"
                          className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {template.formFields?.map((field) => (
                  <DynamicFormField
                    key={field.fieldName}
                    field={field}
                    control={form.control}
                  />
                ))}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg tracking-wide disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
