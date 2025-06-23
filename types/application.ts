import { LinkPreview } from "./link-preview";

export interface Application {
  id: number;
  fullName: string;
  applicationTypeId: number;
  applicationTypeName?: string; // Optional, if available
  companyName?: string; // Optional, if available
  customFields: Record<string, any>;
  linkPreviews?: { key: string; preview: LinkPreview }[];
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServerApplication {
  uid: number;
  applicationTypeId: number;
  fullName: string;
  customFields: Record<string, any>;
  linkPreviews?: { key: string; preview: LinkPreview }[];
  companyId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  applicationTypeName?: string; // Optional, if available
  companyName?: string; // Optional, if available
}

export interface PublicCompany {
  uid: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo?: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    code: number;
    title: string;
    message: string;
  };
}

export interface PageProps {
  params: Promise<{ companyName: string }>;
  searchParams: Promise<{ application?: string }>;
}
