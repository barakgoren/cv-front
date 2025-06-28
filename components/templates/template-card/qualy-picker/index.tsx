import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import React from "react";

interface QualiPickerProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  fieldState?: any;
}

export default function QualiPicker({
  value,
  onChange,
  fieldState,
}: QualiPickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleAddQualification = () => {
    const inputValue = inputRef.current?.value.trim();
    if (!inputValue || inputValue === "") return;
    console.log("Adding qualification:", inputValue);
    onChange?.([...(value || []), inputValue]);
  };

  const handleRemoveQualification = (index: number) => {
    console.log("Removing qualification at index:", index);
    const newValue = value?.filter((_, i) => i !== index);
    onChange?.(newValue || []);
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="qualifications">Qualifications</Label>

        {value && value.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:bg-red-100 hover:text-red-500"
            style={{ border: "1px solid #fca5a5" }}
            onClick={() => onChange?.([])}
          >
            <X />
            Delete All qualifications
          </Button>
        )}
      </div>
      {!value || value.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No qualifications added yet. You can add them below.
        </p>
      ) : (
        <ul className="list-disc pl-4 space-y-1">
          {value?.map((qual, index) => (
            <li
              key={index}
              className="text-sm text-muted-foreground hover:bg-gray-50 rounded-md hover:cursor-pointer"
            >
              <div className="flex items-center justify-between">
                {qual}
                <Button
                  variant="ghost"
                  size="none"
                  className="text-red-500 hover:bg-red-100 hover:text-red-500 p-1 rounded-full"
                  onClick={() => handleRemoveQualification(index)}
                >
                  <X />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center space-x-2">
        <Input
          ref={inputRef}
          id="qualifications"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddQualification();
            }
          }}
          placeholder="Enter qualifications (comma separated)"
        />
        <Button
          variant={"outline"}
          size="icon"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddQualification();
            }
          }}
          onClick={handleAddQualification}
        >
          <Plus />
        </Button>
      </div>
      {fieldState.error && (
        <p className="text-sm text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
}
