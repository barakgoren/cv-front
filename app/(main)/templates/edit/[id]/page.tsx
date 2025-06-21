"use client";

import Loader from "@/components/loader";
import TemplateCard from "@/components/templates/template-card";
import { useTemplate } from "@/services/template.service";
import { Template } from "@/types/template";
import { useParams, useRouter } from "next/navigation";

export default function EditTemplatePage() {
  const params = useParams();
  const id = params.id;
  const { data, isLoading, isValidating, mutate } = useTemplate<Template>({
    path: `${id}`,
  });

  if (isLoading || isValidating) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-8 h-8">
          <Loader />
        </div>
        Looking for a template...
      </div>
    );
  }
  return <TemplateCard template={data} />;
}
