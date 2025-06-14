import { ApiResponse, Application, PublicCompany } from '@/types/application';
import { notFound } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

/**
 * Custom fetch wrapper for server-side API calls
 */
async function serverFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            cache: 'no-store', // Always fetch fresh data
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            // Return a structured error response
            return {
                data: null as T,
                meta: {
                    code: response.status,
                    title: 'API Error',
                    message: `Failed to fetch data: ${response.status} ${response.statusText}`,
                },
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return {
            data: null as T,
            meta: {
                code: 500,
                title: 'Network Error',
                message: 'Failed to connect to the server',
            },
        };
    }
}

/**
 * Server-side API service for public endpoints
 */
export const serverApiService = {
    /**
     * Fetch company by public name/slug
     */
    async getCompanyByName(companyName: string): Promise<ApiResponse<PublicCompany>> {
        return serverFetch<PublicCompany>(`/company/public/${encodeURIComponent(companyName)}`);
    },

    /**
     * Fetch application type by ID
     */
    async getApplicationById(applicationId: string): Promise<ApiResponse<Application>> {
        return serverFetch<Application>(`/application-type/${encodeURIComponent(applicationId)}`);
    },

    /**
     * Validate company and application combination
     */
    async validateCompanyApplication(
        companyName: string,
        applicationId: string
    ): Promise<{
        company: PublicCompany | null;
        application: Application | null;
        isValid: boolean;
        error?: string;
    }> {
        const [companyResponse, applicationResponse] = await Promise.all([
            this.getCompanyByName(companyName),
            this.getApplicationById(applicationId),
        ]);

        const company = companyResponse.data;
        const application = applicationResponse.data;

        // Check if both requests were successful
        if (!company || !application) {
            return {
                company,
                application,
                isValid: false,
                error: 'Company or application not found',
            };
        }

        // Validate that the application belongs to the company
        const isValid = application.companyId === company.uid;

        return {
            company,
            application,
            isValid,
            error: isValid ? undefined : 'Application does not belong to this company',
        };
    },
};
