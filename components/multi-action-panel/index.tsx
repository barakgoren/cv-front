import React from "react";
import { Separator } from "../ui/separator";
import Action from "@/types/action.type";
import ActionComp from "./action";
import { Delete, Eye, Trash } from "lucide-react";

interface MultiActionPanelProps {
  isOpen?: boolean;
  itemIds?: string[]; // Optional: IDs of items to perform actions on
  actions?: Action[];
}

export default function MultiActionPanel({
  isOpen,
  itemIds,
  actions,
}: MultiActionPanelProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isOpen
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-full opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-3 pt-2">
        <div className="flex items-start min-h-12 h-3 gap-3">
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">{itemIds?.length}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Selected
            </span>
          </div>
          <Separator orientation="vertical" />
          {actions?.map((action, index) => (
            <ActionComp key={index} action={action} />
          ))}
        </div>
      </div>
    </div>
  );
}
