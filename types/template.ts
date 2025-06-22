export type Template = {
    id: number; // Unique identifier for the template
    companyId: number; // ID of the company that owns the template
    name: string; // Name of the template
    description: string; // Description of the template
    isActive: boolean; // Whether the template is active or not
    createdAt: Date; // Creation date of the template
    updatedAt: Date; // Last update date of the template
    formFields: FormField[]; // Array of form fields associated with the template
}


export enum FieldType {
    Text = 'text',
    Email = 'email',
    Tel = 'tel',
    Textarea = 'textarea',
    Url = 'url',
    Number = 'number',
    File = 'file'
}

export type FormField = {
    fieldName: string; // The name attribute of the field
    fieldType: FieldType; // The type of the input field
    label: string; // The display label for the field
    required: boolean; // Whether the field is required
    placeholder?: string; // Placeholder text for the field   
}