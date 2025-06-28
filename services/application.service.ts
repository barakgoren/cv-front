import useSWR from "swr";
import http from "./http.service";
import { Application, ServerApplication } from "@/types/application";
import { ApplicantsCompareResponse } from "@/types/ai-responses.type";

const ENDPOINT = "/application";

interface UseApplicationParams {
    path?: string; // Optional path to append to the base URL
    shouldFetch?: boolean; // Whether to fetch the data immediately
    includeBaseParams?: boolean; // Whether to include base parameters
    [key: string]: any; // Additional query parameters
}

export const useApplication = <T = any>({ path = "", shouldFetch = true, includeBaseParams = true, ...params }: UseApplicationParams) => {
    const url = `${ENDPOINT}${path ? `/${path}` : ""}`
    const { data, error, mutate, isLoading, isValidating } = useSWR(
        url,
        async (url) => {
            const response = await http.get(url);
            return response ? response.data as T : undefined;
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
};

const postApplication = async (data: Record<string, any>) => {
    // Check if the data contains any File objects
    // const hasFiles = http.hasFileData(data);
    console.log({ data });

    const response = await http.postMultipart(`${ENDPOINT}`, data);

    if (response) {
        return response.data;
    }
}

const compareApplications = async (applicationIds: string[], applicationTypeId: string): Promise<ApplicantsCompareResponse | null> => {
    console.log({ applicationIds, applicationTypeId });

    if (!applicationIds || applicationIds.length === 0 || !applicationTypeId || isNaN(Number(applicationTypeId)) || applicationIds.some(id => isNaN(Number(id)))) {
        return null;
    }
    const numeralizedIds = applicationIds.map(id => Number(id));
    const numeralizedTypeId = Number(applicationTypeId);
    const response = await http.post(`${ENDPOINT}/compare`, {
        applicationIds: numeralizedIds,
        applicationTypeId: numeralizedTypeId,
    });
    if (response) {
        return response.data as ApplicantsCompareResponse;
    }
    return null;
}

export function serialize(raw: ServerApplication): Application {
    return {
        id: raw.uid,
        applicationTypeId: raw.applicationTypeId,
        fullName: raw.fullName,
        customFields: raw.customFields,
        applicationTypeName: raw.applicationTypeName,
        companyName: raw.companyName,
        linkPreviews: raw.linkPreviews,
        companyId: raw.companyId,
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
    }
}

export const applicationService = {
    postApplication,
    compareApplications,
    serialize
};