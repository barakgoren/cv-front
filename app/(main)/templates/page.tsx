"use client";

import PageWrapper from "@/components/page-wrapper";
import TemplateItemSkeleton from "@/components/skeletons/template-item-skeleton";
import TemplateItem from "@/components/templates/template-item";
import { AddTemplateButton } from "@/components/templates/add-template-button";
import { useTemplate } from "@/services/template.service";
import { Template } from "@/types/template";
import React from "react";

export default function TemplatesPage() {
  const { data, isLoading, isValidating, mutate } = useTemplate<Template[]>({});

  const handleTemplateCreated = (template: Template) => {
    mutate(); // Refresh the data
  };

  const handleTemplateUpdate = (updatedTemplate: Template) => {
    // Optimistically update the cache
    mutate((currentData) => {
      if (!currentData) return currentData;
      return currentData.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template
      );
    }, false); // false means don't revalidate immediately
  };

  const handleTemplateDelete = (templateId: string) => {
    // Optimistically remove from cache
    mutate((currentData) => {
      if (!currentData) return currentData;
      return currentData.filter((template) => template.id !== templateId);
    }, false); // false means don't revalidate immediately
  };

  return (
    <PageWrapper 
      subtitle="Manage your templates" 
      title="Templates" 
      action={<AddTemplateButton onTemplateCreated={handleTemplateCreated} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading || isValidating
          ? Array.from({ length: 6 }).map((_, index) => (
              <TemplateItemSkeleton key={index} />
            ))
          : data?.map((template, index) => {
              return (
                <TemplateItem 
                  key={template.id} 
                  template={template} 
                  onTemplateUpdate={handleTemplateUpdate}
                  onTemplateDelete={handleTemplateDelete}
                />
              );
            })}
      </div>
    </PageWrapper>
  );
}
