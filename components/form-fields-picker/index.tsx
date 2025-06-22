import {
  CreateTemplateSchema,
  FormFieldSchema,
} from "@/schema/template.schema";
import { FormField, FieldType } from "@/types/template";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface FormFieldsPickerProps {
  onChange?: (value: FormField[]) => void;
  value?: CreateTemplateSchema["formFields"];
}

interface SingleFormFieldProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: () => void;
}

function SingleFormField({ field, onUpdate, onDelete }: SingleFormFieldProps) {
  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
      <Input
        placeholder="Field name (e.g., firstName)"
        value={field.fieldName}
        onChange={(e) =>
          onUpdate({
            ...field,
            fieldName: e.target.value,
          })
        }
        className="flex-1"
      />
      <Input
        placeholder="Label (e.g., First Name)"
        value={field.label}
        onChange={(e) =>
          onUpdate({
            ...field,
            label: e.target.value,
          })
        }
        className="flex-1"
      />
      <Select
        value={field.fieldType}
        onValueChange={(value) =>
          onUpdate({ ...field, fieldType: value as FieldType })
        }
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(FieldType).map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 px-2"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function FormFieldsPicker({
  onChange,
  value = [],
}: FormFieldsPickerProps) {
  const [fields, setFields] = useState<FormField[]>(value || []);

  const addNewField = () => {
    const newField: FormField = {
      fieldName: "",
      fieldType: FieldType.Text,
      label: "",
      required: false,
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onChange?.(updatedFields);
  };

  const updateField = (index: number, updatedField: FormField) => {
    const updatedFields = fields.map((field, i) =>
      i === index ? updatedField : field
    );
    setFields(updatedFields);
    onChange?.(updatedFields);
  };

  const deleteField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    onChange?.(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-semibold">Form Fields</Label>
          <p className="text-sm text-muted-foreground">
            Define the fields that will appear in your application form
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={addNewField}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No form fields added yet</p>
              <Button
                type="button"
                variant="outline"
                onClick={addNewField}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Field
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <SingleFormField
              key={index}
              field={field}
              onUpdate={(updatedField) => updateField(index, updatedField)}
              onDelete={() => deleteField(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
