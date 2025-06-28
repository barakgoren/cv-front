"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormDialog } from "@/components/ui/form-dialog";
import { templateService } from "@/services/template.service";
import { Template } from "@/types/template";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTemplateSchema,
  createTemplateSchema,
} from "@/schema/template.schema";

interface AddTemplateButtonProps {
  onTemplateCreated?: (template: Template) => void;
}

export function AddTemplateButton({
  onTemplateCreated,
}: AddTemplateButtonProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateTemplateSchema>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const handleSubmit = async (values: CreateTemplateSchema) => {
    try {
      const result = await templateService.createTemplate(values);
      if (result) {
        toast({
          title: "Success",
          description: "Template created successfully",
        });
        setIsDialogOpen(false);
        form.reset();
        onTemplateCreated?.(result);
      } else {
        toast({
          title: "Error",
          description: "Failed to create template",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  const trigger = (
    <Button onClick={() => setIsDialogOpen(true)}>
      <Plus className="h-4 w-4 mr-2" />
      Add Template
    </Button>
  );

  return (
    <FormDialog
      trigger={trigger}
      title="Add New Template"
      description="Create a new template for your applications."
      isOpen={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onSubmit={form.handleSubmit(handleSubmit, handleError)}
      isSubmitting={form.formState.isSubmitting}
      submitText="Create Template"
      submittingText="Creating..."
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input {...field} id="name" placeholder="Template name" />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>
        )}
      />

      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <div className="col-span-3">
              <Textarea
                {...field}
                id="description"
                placeholder="Template description"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </div>
        )}
      />

      <Controller
        name="isActive"
        control={form.control}
        render={({ field }) => (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isActive" className="text-right">
              Active
            </Label>
            <Switch
              id="isActive"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />
    </FormDialog>
  );
}
