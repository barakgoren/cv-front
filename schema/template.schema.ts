import { FormField } from '@/components/ui/form';
import { FieldType } from '@/types/template';
import { z } from 'zod';

export const formFieldSchema = z.object({
    fieldName: z.string().refine((val) => {
        // Validate that fieldName is a valid identifier (no spaces, special characters)
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(val);
    }, {
        message: "Field name must be a valid identifier (no spaces or special characters)"
    }),
    fieldType: z.nativeEnum(FieldType, {
        message: "Field type must be one of the predefined types: text, email, tel, textarea, url, number, file"
    }),
    label: z.string().min(1, "Label is required"),
    required: z.boolean().default(false),
    placeholder: z.string().optional(),
});

const createTemplateSchema = z.object({
    name: z.string({
        required_error: 'Template name is required',
        invalid_type_error: 'Template name must be a string',
    })
        .min(1, 'Template name cannot be empty')
        .max(100, 'Template name must be less than 100 characters')
        .trim(),

    description: z.string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
    })
        .min(1, 'Description cannot be empty')
        .max(500, 'Description must be less than 500 characters')
        .trim(),

    isActive: z.boolean({
        required_error: 'Active status is required',
        invalid_type_error: 'Active status must be a boolean',
    }).default(true),
    qualifications: z.array(z.string()).optional(),
    formFields: z.array(formFieldSchema, {
        required_error: 'At least one form field is required',
        invalid_type_error: 'Form fields must be an array of valid form field objects',
    }).optional()
});

export type FormFieldSchema = z.infer<typeof formFieldSchema>;
export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>;
export { createTemplateSchema };