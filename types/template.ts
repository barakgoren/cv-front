export type Template = {
    id: string; // Unique identifier for the template
    companyId: string; // ID of the company that owns the template
    name: string; // Name of the template
    description: string; // Description of the template
    isActive: boolean; // Whether the template is active or not
    createdAt: Date; // Creation date of the template
    updatedAt: Date; // Last update date of the template
}