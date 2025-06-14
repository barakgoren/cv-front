import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function TemplateItemSkeleton() {
  return (
    <Skeleton className="h-full bg-gray-100 p-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/2 bg-gray-200" />
        <Skeleton className="h-6 w-1/5 bg-gray-200" />
      </div>
      <Skeleton className=" mt-2 h-10 w-full bg-gray-200" />
      <Skeleton className=" mt-6 h-10 w-full bg-gray-200" />
      <div className="flex justify-end items-center gap-2">
        <Skeleton className=" mt-6 h-6 w-10 bg-gray-200" />
        <Skeleton className=" mt-6 h-6 w-10 bg-gray-200" />
      </div>
    </Skeleton>
  );
}
