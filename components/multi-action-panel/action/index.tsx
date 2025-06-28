import { Button } from "@/components/ui/button";
import ActionType from "@/types/action.type";
import React from "react";

interface ActionProps {
  action?: ActionType;
}

export default function Action({ action }: ActionProps) {
  // Placeholder for action handling logic
  return (
    <div className="flex flex-col h-full items-center">
      <Button
        size={"none"}
        variant={"ghost"}
        className="text-2xl font-semibold py-1 h-full w-full"
        onClick={() => {
          if (action?.onClick) {
            action.onClick({} as any); // Replace with actual item type
          }
        }}
      >
        {action?.icon}
      </Button>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {action?.label}
      </span>
    </div>
  );
}
