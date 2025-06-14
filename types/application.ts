export interface Application {
  id: string;
  name: string;
  description: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
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
