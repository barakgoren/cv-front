import { z } from 'zod';

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
});

const updateTemplateSchema = z.object({
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
    }),
});

export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateSchema = z.infer<typeof updateTemplateSchema>;
export { createTemplateSchema, updateTemplateSchema };