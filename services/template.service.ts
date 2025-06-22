import http from "./http.service"
import { Template } from "@/types/template";
import { CreateTemplateSchema } from "@/schema/template.schema";
import useSWR from 'swr'

const ENDPOINT = "application-type"

function serializeTemplate(template: any): Template {
    return {
        ...template,
        id: template.uid,
        name: template.name,
        companyId: template.companyId,
        description: template.description,
        createdAt: template.createdAt ? new Date(template.createdAt) : null,
        updatedAt: template.updatedAt ? new Date(template.updatedAt) : null,
    };
}

const getTemplate = async (id: string): Promise<Template | null> => {
    const res = await http.get(`/${ENDPOINT}/${id}`);
    if (res && res.data) {
        return serializeTemplate(res.data);
    }
    return null;
}

const createTemplate = async (template: CreateTemplateSchema): Promise<Template | null> => {
    const res = await http.post(`/${ENDPOINT}`, template);
    if (res && res.data) {
        return serializeTemplate(res.data);
    }
    return null;
}

const updateTemplate = async (id: number, updates: Partial<Template>): Promise<Template | null> => {
    const res = await http.put(`/${ENDPOINT}/${id}`, updates);
    if (res && res.data) {
        return serializeTemplate(res.data);
    }
    return null;
}

const toggleTemplateStatus = async (id: string, isActive: boolean): Promise<Template | null> => {
    // Use PATCH for partial updates instead of PUT
    const res = await http.patch(`/${ENDPOINT}/${id}`, { isActive });
    if (res && res.data) {
        return serializeTemplate(res.data);
    }
    return null;
}

const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
        const res = await http.delete(`/${ENDPOINT}/${id}`);
        return res.data
    } catch (error) {
        console.error("Error deleting template:", error);
        return false;
    }
}

export const templateService = {
    createTemplate,
    updateTemplate,
    toggleTemplateStatus,
    deleteTemplate,
    getTemplate
}


interface UseTemplateParams {
    path?: string; // Optional path to append to the base URL
    shouldFetch?: boolean; // Whether to fetch the data immediately
    includeBaseParams?: boolean; // Whether to include base parameters
    [key: string]: any; // Additional query parameters
}

export const useTemplate = <T = any>({ path = "", shouldFetch = true, includeBaseParams = true, ...params }: UseTemplateParams) => {
    const baseParams = {}
    const mergedParams = { ...baseParams, ...params };
    const queryParams = new URLSearchParams(
        includeBaseParams ?
            Object.entries(mergedParams)
                .filter(([_, value]) => value !== null && value !== undefined) // Remove null or undefined values
                .map(([key, value]) => [key, String(value)]) // Convert all values to strings
            : params
    ).toString();
    const url = `/${ENDPOINT}${path ? `/${path}` : ""}${queryParams ? `?${queryParams}` : ""}`
    const { data, error, mutate, isLoading, isValidating } = useSWR(
        url,
        async (url) => {
            const response = await http.get(url);
            if (response) {
                if (Array.isArray(response.data)) {
                    return response.data.map(serializeTemplate) as T;
                } else if (typeof response.data === 'object' && response.data !== null) {
                    return serializeTemplate(response.data) as T;
                }
                return response as T;
            }
        },
        {
            revalidateOnMount: shouldFetch,
            revalidateIfStale: shouldFetch,
            revalidateOnReconnect: shouldFetch,
            revalidateOnFocus: false,
        }
    )
    return {
        data,
        error,
        mutate,
        isLoading,
        isValidating,
    };
}
